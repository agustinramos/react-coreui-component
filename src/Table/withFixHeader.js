import React from 'react'
import PropTypes from 'prop-types'

import { StickyContainer, Sticky } from 'react-sticky'

export default function withFixHeader (Component) {
  class withFixHeader extends React.Component {
    constructor (props) {
      super(props)

      this.state = {}
      this._renderTHEADclone = this._renderTHEADclone.bind(this)
      this._renderTableFixHeader = this._renderTableFixHeader.bind(this)
    }

    _renderTHEADclone (data, key) {
      if (key === 0) {
        this.countColumn = -1
      }
      if (!this.props.columnsTag || this.props.columnsTag[data.key] === undefined || this.props.columnsTag[data.key]) {
        this.countColumn++
        return (
          <th
            key={key}
            style={{...this.props.tBodyStyle[data.key], width: this.props.refTable.children[0].children[0].children[this.countColumn].offsetWidth}}
          >
            { data.value }
          </th>
        )
      }
    }

    _renderTableFixHeader () {
      return (
        <StickyContainer>
          <div style={{position: 'fixed', zIndex: 2}}>
            <Sticky topOffset={-55} bottomOffset={-130}>
              {
                ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                  if (isSticky) {
                    return (
                      <table
                        className={
                          'table table-hover ' +
                          (this.props.striped ? 'table-striped ' : '') +
                          (this.props.condensed ? 'table-condensed ' : '') +
                          (this.props.bordered ? 'table-bordered ' : '')
                        }
                        style={{...style, top: 55, background: 'white', width: this.props.refTable.children[0].children[0].offsetWidth}}
                      >
                        <thead>
                          <tr>
                            { this.props.tHead.map(this._renderTHEADclone) }
                            { this.props.footerButtonsAction && this.props._renderTHEADbutton() }
                          </tr>
                        </thead>
                      </table>
                    )
                  } else {
                    return <div />
                  }
                }
              }
            </Sticky>
          </div>
          { this.props._renderTable() }
        </StickyContainer>
      )
    }

    render () {
      return (
        <Component
          _renderTableFixHeader={this._renderTableFixHeader}
          {...this.props}
        />
      )
    }
  }

  withFixHeader.defaultProps = {
    tBodyStyle: {}
  }

  withFixHeader.propTypes = {
    striped: PropTypes.string,
    condensed: PropTypes.string,
    bordered: PropTypes.string,
    columnsTag: PropTypes.object,
    tBodyStyle: PropTypes.object,
    footerButtonsAction: PropTypes.func,
    tHead: PropTypes.array,
    _renderTable: PropTypes.func,
    _renderTHEADbutton: PropTypes.func,
    refTable: PropTypes.any
  }

  return withFixHeader
}
