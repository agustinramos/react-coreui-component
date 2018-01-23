import React from 'react'
import PropTypes from 'prop-types'

import objectPath from 'object-path'
import moment from 'moment'
import PopoutWindow from 'react-popout'
import Draggable from 'react-draggable'
import { CSVLink } from 'react-csv'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import { Container, Row, Col, Button } from 'reactstrap'
import { } from 'react-bootstrap'
import Icon from '../Icon'

export default function withPrint (Component) {
  class withPrint extends React.Component {
    constructor (props) {
      super(props)

      let tHead = []
      for (let prop in props.tHead) {
        tHead.push({key: prop, value: props.tHead[prop]})
      }

      this.state = {
        tHead,
        popupWindow: false,
        popupWindowTitle: '',
        csv: {data: [], filename: ''},
        pdf: {data: '', filename: ''}
      }
      this.handleColumnStart = this.handleColumnStart.bind(this)
      this.handleColumnStop = this.handleColumnStop.bind(this)
      this.handlePrintOpen = this.handlePrintOpen.bind(this)
      this.handlePrintClose = this.handlePrintClose.bind(this)
      this.handleGenerateCSV = this.handleGenerateCSV.bind(this)
      this.handleGeneratePDF = this.handleGeneratePDF.bind(this)
      this.tHeadGenerate = this.tHeadGenerate.bind(this)
      this.tBodyGenerate = this.tBodyGenerate.bind(this)
      this._renderResize = this._renderResize.bind(this)
      this._renderTablePrint = this._renderTablePrint.bind(this)
      this._renderTHEADprint = this._renderTHEADprint.bind(this)
      this._renderTBODYprint = this._renderTBODYprint.bind(this)
      this._renderLinesPrint = this._renderLinesPrint.bind(this)
      this._renderPrint = this._renderPrint.bind(this)
      this._renderPrintButton = this._renderPrintButton.bind(this)
    }

    tHeadGenerate () {
      let tHead = []
      this.state.tHead.map(vThead => {
        if (!this.props.columnsTagPrint ||
          this.props.columnsTagPrint[vThead.key] === undefined ||
          this.props.columnsTagPrint[vThead.key]
        ) {
          tHead.push(vThead)
        }
        return vThead
      })
      return tHead
    }

    tBodyGenerate (tHead) {
      let tBodys = []
      this.props.tBodyObject.map((vTbody, tBodyK) => {
        let tBody = []
        tHead.map(vThead => {
          if (this.props.tBodyDefault[vThead.key] &&
            (objectPath.get(vTbody, vThead.key) === undefined ||
            objectPath.get(vTbody, vThead.key) === '')
          ) {
            tBody.push(this.props.tBodyDefault[vThead.key])
            return vThead
          }
          let valueData
          if (this.props.tBodyFormatCSV[vThead.key]) {
            valueData = this.props.tBodyFormatCSV[vThead.key](vTbody, tBodyK)
            tBody.push(valueData)
            return vThead
          } else if (this.props.tBodyFormat[vThead.key]) {
            valueData = this.props.tBodyFormat[vThead.key](vTbody, tBodyK)
            if (typeof valueData === 'string') {
              tBody.push(valueData)
              return vThead
            }
          }
          if (objectPath.get(vTbody, vThead.key) === true || objectPath.get(vTbody, vThead.key) === false) {
            valueData = (objectPath.get(vTbody, vThead.key) === true ? 'SI' : 'NO')
            tBody.push(valueData)
            return vThead
          }

          tBody.push(objectPath.get(vTbody, vThead.key))
          return vThead
        })
        tBodys.push(tBody)
        return vTbody
      })
      return tBodys
    }

    handleGeneratePDF (childWindow) {
      let pdf = {data: '', filename: ''}
      let tHead = this.tHeadGenerate()
      let tBody = this.tBodyGenerate(tHead)
      tHead = tHead.map(v => v.value)

      let doc = new JsPDF('landscape', 'pt')
      let options = {
        theme: 'striped',
        styles: {
          overflow: 'linebreak'
        },
        headerStyles: {
          fillColor: [38, 50, 56]
        },
        margin: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10
        }
      }
      doc.setFontSize(12)
      doc.setFont('helvetica')
      doc.setTextColor(38, 50, 56)
      doc.autoTable(tHead, tBody, options)
      pdf.data = doc.output('dataurlstring')
      pdf.filename = this.state.popupWindowTitle + ' (' + moment().format('DD-MM-YYYY HH-mm') + 'hs).pdf'
      this.setState({
        pdf
      })
    }

    handleGenerateCSV () {
      let csv = {data: [], filename: ''}
      let tHead = this.tHeadGenerate()
      let tBody = this.tBodyGenerate(tHead)
      tHead = tHead.map(v => v.value)
      csv.data.push(tHead)
      tBody.map(v => {
        csv.data.push(v)
        return v
      })
      csv.filename = this.state.popupWindowTitle + ' (' + moment().format('DD-MM-YYYY HH-mm') + 'hs).csv'
      this.setState({
        csv
      })
    }

    handlePrintClose () {
      this.setState({
        popupWindow: false
      })
    }

    handlePrintOpen () {
      this.props.setColumnsTagPrint()
      let popupWindowTitle = 'REPORTE - ' + document.querySelector('head title').innerHTML
      this.setState({
        popupWindowTitle,
        popupWindow: true
      })
    }

    handleColumnStart (e) {
      this.position = e.pageX
      this.element = e.currentTarget
      if (this.element.parentNode.style.width === '') {
        this.element.parentNode.style.width = this.element.parentNode.clientWidth + 'px'
      }
    }

    handleColumnStop (e) {
      let withParent = this.element.parentNode.clientWidth
      this.element.parentNode.style.width = (withParent + e.pageX - this.position) + 'px'
      this.element.style.right = (parseInt(this.element.style.right.replace('px', ''), 10) + e.pageX - this.position) + 'px'
      this.element = null
    }

    _renderResize () {
      return (
        <Draggable
          axis='x'
          onStart={this.handleColumnStart}
          onStop={this.handleColumnStop}
        >
          <div
            className='hidden-print'
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: 13,
              background: '#343a40',
              width: 3,
              cursor: 'col-resize'
            }}
          />
        </Draggable>
      )
    }

    _renderTablePrint () {
      return (
        <table
          ref={refTable => { this.refTable = refTable }}
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
              { this.state.tHead.map(this._renderTHEADprint) }
            </tr>
          </thead>
          <tbody>
            { !this.props.fetching && this.props.tBodyObject.map(this._renderTBODYprint) }
          </tbody>
          <tfoot>
            <tr>
              { this.props.fetching && <th colSpan={Object.keys(this.props.tHead).length + 1}>Cargando ...</th> }
              { !this.props.fetching &&
                this.props.tBodyObject.length === 0 &&
                <th colSpan={Object.keys(this.props.tHead).length + 1}>{this.props.txtSinResultados}</th>
              }
            </tr>
          </tfoot>
        </table>
      )
    }

    _renderTHEADprint (data, key) {
      if (!this.props.columnsTagPrint || this.props.columnsTagPrint[data.key] === undefined || this.props.columnsTagPrint[data.key]) {
        return (
          <th
            key={key}
            style={this.props.tBodyStyle[data.key]}
          >
            { data.value }
            { this.props.resize && this._renderResize() }
          </th>
        )
      } else {
        return null
      }
    }

    _renderTBODYprint (data, key) {
      let tBody = []
      this.state.tHead.map(v => {
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
          { tBody.map(this._renderLinesPrint) }
        </tr>
      )
    }

    _renderLinesPrint (data, key) {
      if (!this.props.columnsTagPrint || this.props.columnsTagPrint[data.key] === undefined || this.props.columnsTagPrint[data.key]) {
        return (
          <td key={key}
            style={this.props.tBodyStyle[data.key]}
          >
            {data.value}
          </td>
        )
      }
    }

    _renderPrintButton () {
      if (this.props.print && this.props.tBodyObject.length !== 0) {
        return (
          <div style={{display: 'flex'}}>
            { !this.state.popupWindow &&
              <Button
                style={{flex: 1}}
                color='success'
                onClick={this.handlePrintOpen}
              >
                <Icon bootstrap='printer' /> Modo impresión
              </Button>
            }
            { this.state.popupWindow &&
              <Button
                style={{flex: 1}}
                color='dark'
                onClick={this.handlePrintClose}
              >
                <Icon bootstrap='close' /> Cerrar modo impresión
              </Button>
            }
          </div>
        )
      } else {
        return null
      }
    }

    _renderPrint () {
      if (this.state.popupWindow) {
        return (
          <PopoutWindow
            options={{width: '1200px', height: '600px'}}
            title={this.state.popupWindowTitle}
            onClosing={this.handlePrintClose}
          >
            {childWindow => (
              <wrapper>
                <link
                  rel='stylesheet'
                  href={window.location.origin + '/css/font-awesome.min.css'}
                  crossOrigin='anonymous'
                />
                <link
                  rel='stylesheet'
                  href={window.location.origin + '/css/simple-line-icons.css'}
                  crossOrigin='anonymous'
                />
                <link
                  rel='stylesheet'
                  href={window.location.origin + '/css/style.css'}
                  crossOrigin='anonymous'
                />
                <Container fluid className='mt-h mb-h'>
                  <Row className='hidden-print mb-h'>
                    <Col className='col-12'>
                      <Button
                        color='success'
                        onClick={() => childWindow.print()}
                      >
                        <Icon bootstrap='printer' /> Imprimir
                      </Button> &nbsp;
                      <Button
                        style={{position: 'relative'}}
                        color='success'
                      >
                        <Icon awesome='file-excel-o' /> Excel
                        <CSVLink
                          style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                          }}
                          data={this.state.csv.data}
                          filename={this.state.csv.filename}
                          onClick={this.handleGenerateCSV}
                        />
                      </Button> &nbsp;
                      <Button
                        style={{position: 'relative'}}
                        color='success'
                      >
                        <Icon awesome='file-pdf-o' /> PDF
                        <a
                          style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                          }}
                          href={this.state.pdf.data}
                          download={this.state.pdf.filename}
                          onClick={() => this.handleGeneratePDF(childWindow)}
                        />
                      </Button>
                    </Col>
                  </Row>
                  { this.props._renderColumnsTagPrint() }
                  <Row>
                    <Col className='col-12'>
                      { this._renderTablePrint() }
                    </Col>
                  </Row>
                  <Row className='hidden-print mt-q'>
                    <Col className='col-12'>
                      { this.props._renderPageDetail() }
                    </Col>
                  </Row>
                </Container>
              </wrapper>
            )}
          </PopoutWindow>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderPrint={this._renderPrint}
          _renderPrintButton={this._renderPrintButton}
          popupWindow={this.state.popupWindow}
          {...this.props}
          tHead={this.state.tHead}
        />
      )
    }
  }

  withPrint.defaultProps = {
    tBodyStyle: {},
    tBodyDefault: {},
    tBodyFormat: {},
    tBodyFormatCSV: {}
  }

  withPrint.propTypes = {
    // withColumnsTag
    _renderColumnsTagPrint: PropTypes.func,
    columnsTagPrint: PropTypes.object,
    setColumnsTagPrint: PropTypes.func,
    // withPageDetail
    _renderPageDetail: PropTypes.func,

    resize: PropTypes.bool,
    tHead: PropTypes.object,
    striped: PropTypes.bool,
    condensed: PropTypes.bool,
    bordered: PropTypes.bool,
    tBodyObject: PropTypes.array,
    tBodyDefault: PropTypes.object,
    tBodyFormat: PropTypes.object,
    tBodyFormatCSV: PropTypes.object,
    tBodyStyle: PropTypes.object,
    tBodyStyleTR: PropTypes.func,
    fetching: PropTypes.bool,
    txtSinResultados: PropTypes.string,
    print: PropTypes.bool
  }

  return withPrint
}
