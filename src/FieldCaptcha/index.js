import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label, FormFeedback, Input, InputGroup, InputGroupAddon, Col } from 'reactstrap'
import Icon from '../Icon'
import { } from 'react-bootstrap'

class FieldCaptcha extends Component {
  constructor (props) {
    super(props)

    this.state = {
      captcha: null,
      loadImg: false,
      endpoint: ''
    }
    this.reloadCaptcha = this.reloadCaptcha.bind(this)
    this._renderIMG = this._renderIMG.bind(this)
    this._renderInput = this._renderInput.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.endpoint && nextProps.captcha !== this.state.captcha) {
      this.setState({
        captcha: nextProps.captcha
      })
      this.reloadCaptcha(nextProps.captcha)
    }
  }

  randomNumber () {
    return Math.floor((Math.random() * 1000) + 1)
  }

  reloadCaptcha (captcha) {
    this.setState({
      loadImg: false
    }, () => {
      this.setState({
        loadImg: true,
        endpoint: this.props.endpoint + '?random=' + captcha
      })
    })
  }

  _renderIMG () {
    return (
      <img
        style={{
          marginTop: '-1.5rem',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          OUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none'
        }}
        src={this.state.endpoint}
        alt=''
      />
    )
  }

  _renderInput () {
    let { autocomplete, className, label, byField, componentClass, input, onSelect, captcha, meta, endpoint, ...props } = this.props // eslint-disable-line
    return (
      <InputGroup className={className}>
        <Input
          id={label && label.replace(/ /g, '')}
          autoComplete={autocomplete ? 'on' : 'off'}
          type={componentClass}
          value={input ? (!byField ? input.value : input.value[byField]) : null}
          onChange={(event) => { input.onChange(event.target.value); onSelect ? onSelect(event.target.value) : null }} //eslint-disable-line
          onBlur={input && input.onBlur}
          onFocus={input && input.onFocus}
          {...props}
        />
        <InputGroupAddon
          onClick={() => this.reloadCaptcha(this.randomNumber())}
          style={{cursor: 'pointer'}}
        >
          <Icon
            bootstrap='refresh'
          />
        </InputGroupAddon>
      </InputGroup>
    )
  }

  render () {
    const { horizontal, required, meta, ...props } = this.props
    return (
      <FormGroup
        color={(!meta.touched ? '' : meta.valid ? '' : 'danger')}
        row={horizontal ? true : undefined}
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
            { this.state.loadImg && this._renderIMG() }
            {meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback>}
          </Col>
        }

        { !horizontal && this._renderInput() }
        { !horizontal && this.state.loadImg && this._renderIMG() }
        { !horizontal && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback> }
      </FormGroup>
    )
  }
}

FieldCaptcha.defaultProps = {
  autocomplete: false
}

FieldCaptcha.propTypes = {
  label: PropTypes.string,
  mask: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.object,
  horizontal: PropTypes.object,
  byField: PropTypes.any,
  componentClass: PropTypes.string,
  input: PropTypes.object,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  autocomplete: PropTypes.bool,
  endpoint: PropTypes.string,
  captcha: PropTypes.number
}

export default FieldCaptcha
