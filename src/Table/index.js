import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Row, Col } from 'reactstrap'

import withTooltip from './withTooltip'
import withColumnsTag from './withColumnsTag'
import withSortLimitFilterPageFunctions from './withSortLimitFilterPageFunctions'
import withLimit from './withLimit'
import withFilter from './withFilter'
import withSort from './withSort'
import withPage from './withPage'
import withPageDetail from './withPageDetail'
import withMultiFilter from './withMultiFilter'
import withPrint from './withPrint'
import withTable from './withTable'
import withFixHeader from './withFixHeader'

class Table extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <wrapper
        className='componentTable'
        style={{display: 'block', ...this.props.style}}
      >
        { this.props._renderMultiFilter() }

        { (this.props.limit || this.props.filter) &&
          <Row className='table_filtros'>
            <Col className='col-12 mb-1' lg='6'>
              { this.props._renderLimit() }
            </Col>
            <Col className='col-12 mb-1' lg='6'>
              { this.props._renderFilter() }
            </Col>
          </Row>
        }

        { this.props._renderColumnsTag() }

        { this.props.fixHeader &&
          this.props._renderTableFixHeader()
        }
        { !this.props.fixHeader &&
          this.props._renderTable()
        }

        { this.props.pagination && !this.props.fetching &&
          <Row>
            <Col className='col-12' lg='7'>
              { this.props._renderPage() }
            </Col>
            <Col className='col-12' lg='5'>
              { this.props._renderPageDetail() }
            </Col>
          </Row>
        }

        { ((this.props.print || this.props.otherOptions) && !this.props.fetching) &&
          <Row>
            <Col className='col-12'>
              { this.props._renderPrintButton() }

              { !this.props.popupWindow && this.props.otherOptions }
            </Col>
          </Row>
        }

        { this.props._renderPrint() }
      </wrapper>
    )
  }
}

Table.defaultProps = {}

Table.propTypes = {
  // withColumnsTag
  _renderColumnsTag: PropTypes.func,
  // withLimit
  _renderLimit: PropTypes.func,
  // withFilter
  _renderFilter: PropTypes.func,
  // withPage
  _renderPage: PropTypes.func,
  // withPageDetail
  _renderPageDetail: PropTypes.func,

  // withMultiFilter
  _renderMultiFilter: PropTypes.func,
  // withPrint
  _renderPrintButton: PropTypes.func,
  _renderPrint: PropTypes.func,
  // withTable
  _renderTable: PropTypes.func,
  // withFixHeader
  _renderTableFixHeader: PropTypes.func,

  style: PropTypes.object,
  filter: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  limit: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  pagination: PropTypes.object,
  fixHeader: PropTypes.bool,
  print: PropTypes.bool,
  otherOptions: PropTypes.any,
  popupWindow: PropTypes.bool,
  fetching: PropTypes.bool
}

export default
withTooltip(
  withColumnsTag(
    withSortLimitFilterPageFunctions(
      withLimit(
        withFilter(
          withSort(
            withPage(
              withPageDetail(
                withMultiFilter(
                  withPrint(
                    withTable(
                      withFixHeader(Table)
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
)
