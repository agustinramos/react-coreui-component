import React, {} from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label, FormFeedback, Input, InputGroup, InputGroupAddon, Col } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import InputMask from 'react-input-mask'
import Icon from '../Icon'

function _renderTooltip (text) {
  return (
    <Tooltip id='tooltip'>
      <strong>{text}</strong>
    </Tooltip>
  )
}

const FieldInputMask = ({autocomplete, className, iconLeft, iconRight, label, byField, componentClass, input, onSelect, stylesInput, ...props}) => (
  <InputGroup className={className}>
    { iconLeft &&
      <InputGroupAddon>
        { (iconLeft.bootstrap || iconLeft.awesome)
          ? <Icon
            bootstrap={iconLeft.bootstrap}
            awesome={iconLeft.awesome}
            style={iconLeft.style}
          />
          : iconLeft()
        }
      </InputGroupAddon>
    }
    <InputMask
      id={label && label.replace(/ /g, '')}
      className='form-control'
      autoComplete={autocomplete ? 'on' : 'off'}
      type={componentClass}
      style={stylesInput}
      value={input ? (!byField ? input.value : input.value[byField]) : null}
      onChange={(event) => { input.onChange(event.target.value); onSelect ? onSelect(event.target.value) : null }} //eslint-disable-line
      onBlur={input && input.onBlur}
      onFocus={input && input.onFocus}
      {...props}
    />
    { iconRight &&
      <InputGroupAddon>
        { typeof iconRight === 'object'
          ? <Icon
            bootstrap={iconRight.bootstrap}
            awesome={iconRight.awesome}
            style={iconRight.style}
          />
          : iconRight()
        }
      </InputGroupAddon>
    }
  </InputGroup>
)

FieldInputMask.defaultProps = {
  autocomplete: false
}

FieldInputMask.propTypes = {
  label: PropTypes.string,
  byField: PropTypes.any,
  componentClass: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  iconLeft: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  iconRight: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  autocomplete: PropTypes.bool,
  stylesInput: PropTypes.object
}

const FieldInput = ({autocomplete, className, iconLeft, iconRight, label, byField, componentClass, input, onSelect, stylesInput, ...props}) => (
  <InputGroup className={className}>
    { iconLeft &&
      <InputGroupAddon>
        { (iconLeft.bootstrap || iconLeft.awesome)
          ? <Icon
            bootstrap={iconLeft.bootstrap}
            awesome={iconLeft.awesome}
            style={iconLeft.style}
          />
          : iconLeft()
        }
      </InputGroupAddon>
    }
    <Input
      id={label && label.replace(/ /g, '')}
      autoComplete={autocomplete ? 'on' : 'off'}
      type={componentClass}
      style={stylesInput}
      value={input ? (!byField ? input.value : input.value[byField]) : null}
      onChange={(event) => { input.onChange(event.target.value); onSelect ? onSelect((event.target.value !== '' ? {id: parseInt(event.target.value, 10)} : '')) : null }} //eslint-disable-line
      onBlur={input && input.onBlur}
      onFocus={input && input.onFocus}
      {...props}
    />
    { iconRight &&
      <InputGroupAddon>
        { typeof iconRight === 'object'
          ? <Icon
            bootstrap={iconRight.bootstrap}
            awesome={iconRight.awesome}
            style={iconRight.style}
          />
          : iconRight()
        }
      </InputGroupAddon>
    }
  </InputGroup>
)

FieldInput.defaultProps = {
  autocomplete: false
}

FieldInput.propTypes = {
  label: PropTypes.string,
  byField: PropTypes.any,
  componentClass: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  iconLeft: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  iconRight: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  autocomplete: PropTypes.bool,
  stylesInput: PropTypes.object
}

const FieldGroupIcon = ({horizontal, required, meta, info, className, ...props}) => (
  <FormGroup
    color={(meta && !meta.touched ? '' : meta && meta.valid ? '' : 'danger')}
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
            overlay={_renderTooltip(info)}
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
        { props.mask && FieldInputMask(props) }
        { !props.mask && FieldInput(props) }

        {meta && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback>}
      </Col>
    }

    { !horizontal && props.mask && FieldInputMask(props) }
    { !horizontal && !props.mask && FieldInput(props) }

    { !horizontal && meta && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback> }
  </FormGroup>
)

FieldGroupIcon.defaultProps = {
}

FieldGroupIcon.propTypes = {
  label: PropTypes.string,
  mask: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.object,
  horizontal: PropTypes.object,
  info: PropTypes.string,
  className: PropTypes.string
}

export default FieldGroupIcon
