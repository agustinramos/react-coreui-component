import React from 'react'
import PropTypes from 'prop-types'

import deepcopy from 'deepcopy'
import { Row, Col, Badge } from 'reactstrap'

export default function withColumnsTag (Component) {
  class withColumnsTag extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        columnsTag: props.columnsTag,
        columnsTagPrint: props.columnsTag
      }
      this.setColumnsTagPrint = this.setColumnsTagPrint.bind(this)
      this.handlerClickColumnsTag = this.handlerClickColumnsTag.bind(this)
      this.handlerClickColumnsTagPrint = this.handlerClickColumnsTagPrint.bind(this)
      this._renderColumnsTagElements = this._renderColumnsTagElements.bind(this)
      this._renderColumnsTagElementsPrint = this._renderColumnsTagElementsPrint.bind(this)
      this._renderColumnsTag = this._renderColumnsTag.bind(this)
      this._renderColumnsTagPrint = this._renderColumnsTagPrint.bind(this)
    }

    setColumnsTagPrint () {
      this.setState({
        columnsTagPrint: deepcopy(this.state.columnsTag)
      })
    }

    handlerClickColumnsTag (prop) {
      let columnsTag = this.state.columnsTag
      columnsTag[prop] = (!columnsTag[prop])

      this.setState({
        columnsTag
      })
    }

    handlerClickColumnsTagPrint (prop) {
      let columnsTagPrint = this.state.columnsTagPrint
      columnsTagPrint[prop] = (!columnsTagPrint[prop])

      this.setState({
        columnsTagPrint
      })
    }

    _renderColumnsTagElements () {
      let elements = []
      for (let prop in this.state.columnsTag) {
        if (this.props.tHead[prop]) {
          elements.push(
            <wrapper key={prop}>
              <Badge
                pill
                className='mb-q'
                color={(this.state.columnsTag[prop] ? 'primary' : 'default')}
                role='button'
                style={{fontSize: '.80rem'}}
                onClick={() => this.handlerClickColumnsTag(prop)}
              >
                { this.props.tHead[prop] }
              </Badge>&nbsp;
            </wrapper>
          )
        }
      }
      return elements
    }

    _renderColumnsTag () {
      if (this.state.columnsTag) {
        return (
          <Row>
            <Col className='col-12 mb-q' sm='12'>
              { this._renderColumnsTagElements() }
            </Col>
          </Row>
        )
      } else {
        return null
      }
    }

    _renderColumnsTagElementsPrint () {
      let elements = []
      for (let prop in this.state.columnsTagPrint) {
        if (this.props.tHead[prop]) {
          elements.push(
            <wrapper key={prop}>
              <Badge
                pill
                className='mb-q'
                color={(this.state.columnsTagPrint[prop] ? 'primary' : 'default')}
                role='button'
                style={{fontSize: '.80rem'}}
                onClick={() => this.handlerClickColumnsTagPrint(prop)}
              >
                { this.props.tHead[prop] }
              </Badge>&nbsp;
            </wrapper>
          )
        }
      }
      return elements
    }

    _renderColumnsTagPrint () {
      if (this.state.columnsTagPrint) {
        return (
          <Row className='hidden-print'>
            <Col className='col-12 mb-q' sm='12'>
              { this._renderColumnsTagElementsPrint() }
            </Col>
          </Row>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderColumnsTag={this._renderColumnsTag}
          _renderColumnsTagPrint={this._renderColumnsTagPrint}
          setColumnsTagPrint={this.setColumnsTagPrint}
          {...this.props}
          columnsTag={this.state.columnsTag}
          columnsTagPrint={this.state.columnsTagPrint}
        />
      )
    }
  }

  withColumnsTag.defaultProps = {}

  withColumnsTag.propTypes = {
    tHead: PropTypes.object,
    columnsTag: PropTypes.object
  }

  return withColumnsTag
}
