import React, { Component } from 'react'
import PropTypes from 'prop-types'
import deepcopy from 'deepcopy'

import { Row, Col, Label, Badge, FormFeedback } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Interactive from 'react-interactive'
import { DragDropContainer, DropTarget } from './react-drag-drop-container'
import Callout from '../Callout'
import Icon from '../Icon'

class FieldDragDropBoxes extends Component {
  constructor (props) {
    super(props)

    let itemsBox1 = []
    let itemsBox2 = []
    if (props.input && Array.isArray(props.input.value)) {
      itemsBox1 = props.input.value
    } else if (props.input && typeof props.input.value === 'object') {
      if (props.input.value.box1) {
        itemsBox1 = props.input.value.box1
      }
      if (props.input.value.box2) {
        itemsBox2 = props.input.value.box2
      }
    }

    this.state = {
      itemsBox1,
      itemsBox2,
      stylesZonas: {
        box1: {},
        box2: {}
      }
    }
    this.handlerOnHit = this.handlerOnHit.bind(this)
    this.handlerMostrarZonas = this.handlerMostrarZonas.bind(this)
    this.handlerOcultarZonas = this.handlerOcultarZonas.bind(this)
  }

  componentDidMount () {
    this.props.input && this.props.input.onChange({box1: this.state.itemsBox1, box2: this.state.itemsBox2})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.input && nextProps.input.value &&
      nextProps.input.value.box1 &&
      this.state.itemsBox1.length !== nextProps.input.value.box1.length
    ) {
      this.setState({
        itemsBox1: nextProps.input.value.box1
      })
    }
    if (nextProps.input && nextProps.input.value &&
      nextProps.input.value.box2 &&
      this.state.itemsBox2.length !== nextProps.input.value.box2.length
    ) {
      this.setState({
        itemsBox2: nextProps.input.value.box2
      })
    }
  }

  handlerOnHit ({item, index}, box) {
    let itemsBox1 = deepcopy(this.state.itemsBox1)
    let itemsBox2 = deepcopy(this.state.itemsBox2)
    if (box === 'box1') {
      itemsBox1.push(item)
      itemsBox2.splice(index, 1)
    } else {
      itemsBox2.push(item)
      itemsBox1.splice(index, 1)
    }
    this.setState({
      itemsBox1,
      itemsBox2
    }, () => {
      this.handlerOcultarZonas()
      this.props.input && this.props.input.onChange({box1: itemsBox1, box2: itemsBox2})
      this.props.onChanged && this.props.onChanged({box1: itemsBox1, box2: itemsBox2})
    })
  }

  handlerMostrarZonas (zona) {
    let stylesZonas = this.state.stylesZonas
    stylesZonas[zona] = {border: '2px dashed #757879'}
    this.setState({
      stylesZonas
    })
  }

  handlerOcultarZonas () {
    this.setState({
      stylesZonas: {
        box1: {},
        box2: {}
      }
    })
  }

  _renderTooltip (text) {
    return (
      <Tooltip id='tooltip'>
        <strong>{text}</strong>
      </Tooltip>
    )
  }

  render () {
    const styles = {
      border: '2px solid #757879',
      minHeight: 100,
      cursor: 'default'
    }
    return (
      <Row>
        <Col className='col-12'>
          { this.props.label &&
            <Label
              for={this.props.label.replace(/ /g, '')}
              className={this.props.meta && this.props.meta.touched && this.props.meta.error ? 'text-danger' : ''}
            >
              {this.props.label} {this.props.required && <span className='text-danger'>*</span>}
              &nbsp;
              { this.props.info && this.props.info !== '' &&
                <OverlayTrigger
                  placement='right'
                  overlay={this._renderTooltip(this.props.info)}
                >
                  <wrapper>
                    <Icon bootstrap='info' />
                  </wrapper>
                </OverlayTrigger>
              }
            </Label>
          }
        </Col>
        <Col className='col-12' lg='6'>
          <h6><Badge color='success'>{this.state.itemsBox1.length} {(this.state.itemsBox1.length === 1 ? 'elemento' : 'elementos')}</Badge></h6>
          <DropTarget
            targetKey='box1'
            onHit={(e) => this.handlerOnHit(e.dragData, 'box1')}
          >
            <div style={{...styles, ...this.state.stylesZonas.box1}}>
              {this.state.itemsBox1.map((item, index) => {
                return (
                  <DragDropContainer
                    key={'itemsBox1-' + index}
                    targetKey='box2'
                    returnToBase
                    noDragging={item.disabled}
                    dragData={{item, index}}
                    onDragStart={() => this.handlerMostrarZonas('box2')}
                    onDragEnd={this.handlerOcultarZonas}
                  >
                    <Interactive
                      as='div'
                      hover={{
                        background: '#164525',
                        color: 'white',
                        boxShadow: '0px 3px 10px 0px rgba(50, 50, 50, 0.75)',
                        transition: '.2s all ease-in-out'
                      }}
                      style={{
                        width: '100%',
                        transition: '.2s all ease-out'
                      }}
                    >
                      <Callout
                        fullWidth
                        title={() => this.props.showData(item)}
                        color='success'
                        style={{margin: '-10px 0'}}
                      />
                    </Interactive>
                  </DragDropContainer>
                )
              })}
            </div>
          </DropTarget>
        </Col>
        <Col className='col-12' lg='6'>
          <h6><Badge color='success'>{this.state.itemsBox2.length} {(this.state.itemsBox2.length === 1 ? 'elemento' : 'elementos')}</Badge></h6>
          <DropTarget
            targetKey='box2'
            onHit={(e) => this.handlerOnHit(e.dragData, 'box2')}
          >
            <div style={{...styles, ...this.state.stylesZonas.box2}}>
              {this.state.itemsBox2.map((item, index) => {
                return (
                  <DragDropContainer
                    key={'itemsBox2-' + index}
                    targetKey='box1'
                    returnToBase
                    noDragging={item.disabled}
                    dragData={{item, index}}
                    onDragStart={() => this.handlerMostrarZonas('box1')}
                    onDragEnd={this.handlerOcultarZonas}
                  >
                    <Interactive
                      as='div'
                      hover={{
                        background: '#164525',
                        color: 'white',
                        boxShadow: '0px 3px 10px 0px rgba(50, 50, 50, 0.75)',
                        transition: '.2s all ease-in-out'
                      }}
                      style={{
                        width: '100%',
                        transition: '.2s all ease-out'
                      }}
                    >
                      <Callout
                        fullWidth
                        title={() => this.props.showData(item)}
                        color='success'
                        style={{margin: '-10px 0'}}
                      />
                    </Interactive>
                  </DragDropContainer>
                )
              })}
            </div>
          </DropTarget>
        </Col>
        <Col className='col-12'>
          { this.props.meta && this.props.meta.touched && this.props.meta.error &&
            <FormFeedback className='text-danger'>{this.props.meta.error}</FormFeedback>
          }
        </Col>
      </Row>
    )
  }
}

FieldDragDropBoxes.defaultProps = {
}

FieldDragDropBoxes.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  onChanged: PropTypes.func,
  showData: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  info: PropTypes.string
}

export default FieldDragDropBoxes
