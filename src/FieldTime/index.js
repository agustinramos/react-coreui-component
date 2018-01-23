import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label, FormFeedback, Col } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Icon from '../Icon'
import { merge } from 'ramda'
import deepEqual from 'deep-equal'

const StylesInput = {
  padding: '8px 0 0.3rem',
  backgroundColor: 'transparent',
  outline: 'none',
  border: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  display: 'inline-block'
}

class FieldTime extends Component {
  constructor (props) {
    super(props)

    let value = {
      hora: '00',
      minutos: '00'
    }
    if (props.input.value && props.input.value !== '') {
      value = props.input.value.split(':')
      value = {
        hora: value[0],
        minutos: value[1]
      }
    }

    this.state = {
      value,
      hora: this.generateTime(24),
      minutos: this.generateTime(60)
    }
    this.handlerChangeHora = this.handlerChangeHora.bind(this)
    this.handlerChangeMinutos = this.handlerChangeMinutos.bind(this)
    this.setValue = this.setValue.bind(this)
    this._renderInput = this._renderInput.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.input.value && nextProps.input.value !== '' && !deepEqual(nextProps.input.value, this.state.value)) {
      let value = nextProps.input.value.split(':')
      value = {
        hora: value[0],
        minutos: value[1]
      }
      this.setState({
        value
      })
    }
  }

  generateTime (hasta) {
    let cantidad = []
    for (var i = 0; i < hasta; i++) {
      if (i < 10) {
        i = '0' + i
      }
      cantidad.push(i.toString())
    }
    return cantidad
  }

  _renderTooltip (text) {
    return (
      <Tooltip id='tooltip'>
        <strong>{text}</strong>
      </Tooltip>
    )
  }

  handlerChangeHora (e) {
    this.setState({
      value: merge(this.state.value, {hora: e.currentTarget.value})
    }, () => {
      this.setValue()
    })
  }

  handlerChangeMinutos (e) {
    this.setState({
      value: merge(this.state.value, {minutos: e.currentTarget.value})
    }, () => {
      this.setValue()
    })
  }

  setValue () {
    let value = this.state.value.hora + ':' + this.state.value.minutos
    this.props.input && this.props.input.onChange && this.props.input.onChange(value)
    this.props.onChanged && this.props.onChanged(value)
  }

  _renderInput () {
    return (
      <div style={{display: 'flex'}}>
        <select
          style={StylesInput}
          className='form-control'
          value={this.state.value.hora}
          onChange={this.handlerChangeHora}
        >
          { this.state.hora.map((h, k) => (
            <option key={k} value={h}>{ h }</option>
          ))}
        </select>
        <span className='font-xl'>:</span>
        <select
          style={StylesInput}
          className='form-control'
          value={this.state.value.minutos}
          onChange={this.handlerChangeMinutos}
        >
          { this.state.minutos.map((m, k) => (
            <option key={k} value={m}>{ m }</option>
          ))}
        </select>
      </div>
    )
  }

  render () {
    let { horizontal, required, meta, info, className, ...props } = this.props
    return (
      <FormGroup
        color={(meta ? !meta.touched ? '' : meta.valid ? '' : 'danger' : '')}
        row={horizontal ? true : undefined}
        className={className}
      >
        { props.label &&
          <Label
            for={props.label.replace(/ /g, '')}
            xs={horizontal && horizontal.labelSize && horizontal.labelSize.xs ? horizontal.labelSize.xs : undefined}
            sm={horizontal && horizontal.labelSize && horizontal.labelSize.sm ? horizontal.labelSize.sm : undefined}
            md={horizontal && horizontal.labelSize && horizontal.labelSize.md ? horizontal.labelSize.md : undefined}
            lg={horizontal && horizontal.labelSize && horizontal.labelSize.lg ? horizontal.labelSize.lg : undefined}
            xl={horizontal && horizontal.labelSize && horizontal.labelSize.xl ? horizontal.labelSize.xl : undefined}
          >
            {props.label} {required && <span className='text-danger'>*</span>}
            &nbsp;
            { info && info !== '' &&
              <OverlayTrigger
                placement='right'
                overlay={this._renderTooltip(info)}
              >
                <wrapper>
                  <Icon bootstrap='info' />
                </wrapper>
              </OverlayTrigger>
            }
          </Label>
        }

        { horizontal &&
          <Col
            xs={horizontal && horizontal.inputSize && horizontal.inputSize.xs ? horizontal.inputSize.xs : undefined}
            sm={horizontal && horizontal.inputSize && horizontal.inputSize.sm ? horizontal.inputSize.sm : undefined}
            md={horizontal && horizontal.inputSize && horizontal.inputSize.md ? horizontal.inputSize.md : undefined}
            lg={horizontal && horizontal.inputSize && horizontal.inputSize.lg ? horizontal.inputSize.lg : undefined}
            xl={horizontal && horizontal.inputSize && horizontal.inputSize.xl ? horizontal.inputSize.xl : undefined}
          >
            { this._renderInput() }

            {meta && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback>}
          </Col>
        }

        { !horizontal && this._renderInput() }
        { !horizontal && meta && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback> }
      </FormGroup>
    )
  }
}

FieldTime.defaultProps = {
}

FieldTime.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.object,
  horizontal: PropTypes.object,
  info: PropTypes.string,
  className: PropTypes.string,
  onChanged: PropTypes.func,
  input: PropTypes.object
}

export default FieldTime
