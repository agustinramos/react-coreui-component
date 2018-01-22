import React from 'react'
import PropTypes from 'prop-types'

import objectPath from 'object-path'
import { OverlayTrigger } from 'react-bootstrap'

export default function withTable (Component) {
  class withTable extends React.Component {
    constructor (props) {
      super(props)

      this.state = {}
      this._renderTable = this._renderTable.bind(this)
      this._renderTHEAD = this._renderTHEAD.bind(this)
      this._renderTBODY = this._renderTBODY.bind(this)
      this._renderLines = this._renderLines.bind(this)
      this._renderTHEADbutton = this._renderTHEADbutton.bind(this)
    }

    _renderTHEAD (data, key) {
      if (!this.props.columnsTag || this.props.columnsTag[data.key] === undefined || this.props.columnsTag[data.key]) {
        if (this.props.sort && this.props.sort.fieldsSort[data.key]) {
          return (
            <OverlayTrigger
              key={key}
              placement='top'
              overlay={this.props._renderTooltip('Ordenar ' + (this.props.sort.fieldsSort[data.key] === 'asc' ? 'descendentemente' : 'ascendentemente'))}
            >
              <th
                style={this.props.tBodyStyle[data.key]}
                className={
                  (this.props.sort.fieldsSort[data.key] ? this.props.cssClassName.enabled + ' ' : ' ') +
                  (this.props.sort.init === data.key ? this.props.cssClassName.sorting + this.props.sort.fieldsSort[data.key] : ' ')
                }
                onClick={() => {
                  if (this.props.sort.fieldsSort[data.key]) {
                    this.props.handlerSortOnChange(data.key)
                  }
                }}
              >
                { data.value }
              </th>
            </OverlayTrigger>
          )
        } else {
          return (
            <th
              key={key}
              style={this.props.tBodyStyle[data.key]}
            >
              { data.value }
            </th>
          )
        }
      }
    }

    _renderTBODY (data, key) {
      let tBody = []
      this.props.tHead.map(v => {
        if (this.props.tBodyDefault[v.key] &&
          (objectPath.get(data, v.key) === undefined ||
          objectPath.get(data, v.key) === '')
        ) {
          tBody.push({key: v.key, value: this.props.tBodyDefault[v.key]})
          return v
        }

        if (this.props.tBodyFormat[v.key]) {
          let valueData = this.props.tBodyFormat[v.key](data, key)
          tBody.push({key: v.key, value: valueData})
          return v
        }

        tBody.push({key: v.key, value: objectPath.get(data, v.key)})
        return v
      })

      return (
        <tr key={key} className={this.props.tBodyStyleTR && this.props.tBodyStyleTR(data, key)}>
          { tBody.map(this._renderLines) }
          { this.props.footerButtonsAction && this.props.footerButtonsAction(data, key) }
        </tr>
      )
    }

    _renderTHEADbutton () {
      return (
        <th className=''>Acciones</th>
      )
    }

    _renderLines (data, key) {
      if (!this.props.columnsTag || this.props.columnsTag[data.key] === undefined || this.props.columnsTag[data.key]) {
        return (
          <td key={key}
            style={this.props.tBodyStyle[data.key]}
          >
            {data.value}
          </td>
        )
      }
    }

    _renderTable () {
      return (
        <table
          ref={refTable => !this.state.refTable && this.setState({refTable})}
          className={
            'table table-hover table-md' +
            (this.props.striped ? 'table-striped ' : '') +
            (this.props.condensed ? 'table-condensed ' : '') +
            (this.props.bordered ? 'table-bordered ' : '')
          }
          style={{position: 'relative'}}
        >
          <thead>
            <tr>
              { this.props.tHead.map(this._renderTHEAD) }
              { this.props.footerButtonsAction && this._renderTHEADbutton() }
            </tr>
          </thead>
          <tbody>
            { !this.props.fetching && this.props.tBodyObject.map(this._renderTBODY) }
          </tbody>
          <tfoot>
            <tr>
              { this.props.fetching && <th colSpan={this.props.tHead.length + 1}>Cargando ...</th> }
              { !this.props.fetching &&
                this.props.tBodyObject.length === 0 &&
                <th colSpan={this.props.tHead.length + 1}>{this.props.txtSinResultados}</th>
              }
            </tr>
          </tfoot>
        </table>
      )
    }

    render () {
      return (
        <Component
          _renderTable={this._renderTable}
          _renderTHEADbutton={this._renderTHEADbutton}
          refTable={this.state.refTable}
          {...this.props}
        />
      )
    }
  }

  withTable.defaultProps = {
    tBodyStyle: {},
    tBodyDefault: {},
    tBodyFormat: {}
  }

  withTable.propTypes = {
    // withTooltip
    _renderTooltip: PropTypes.func,
    // withSort
    handlerSortOnChange: PropTypes.func,
    cssClassName: PropTypes.object,
    // withColumnsTag
    columnsTag: PropTypes.object,

    striped: PropTypes.bool,
    condensed: PropTypes.bool,
    bordered: PropTypes.bool,
    sort: PropTypes.object,
    tHead: PropTypes.array,
    tBodyObject: PropTypes.array,
    tBodyDefault: PropTypes.object,
    tBodyFormat: PropTypes.object,
    tBodyStyle: PropTypes.object,
    tBodyStyleTR: PropTypes.func,
    fetching: PropTypes.bool,
    txtSinResultados: PropTypes.string,
    footerButtonsAction: PropTypes.func
  }

  return withTable
}
