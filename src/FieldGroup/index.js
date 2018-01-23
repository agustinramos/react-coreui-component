import React, {} from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label, FormFeedback, Input, Col } from 'reactstrap'
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

const FieldInputMask = ({label, input, autocomplete, componentClass, byField, onSelect, stylesInput, ...props}) => (
  <InputMask
    id={label ? label.replace(/ /g, '') : input.name.replace(/ /g, '')}
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
)

FieldInputMask.defaultProps = {
  autocomplete: false
}

FieldInputMask.propTypes = {
  label: PropTypes.string,
  byField: PropTypes.any,
  componentClass: PropTypes.string,
  input: PropTypes.object,
  onSelect: PropTypes.func,
  autocomplete: PropTypes.bool,
  stylesInput: PropTypes.object
}

const FieldInput = ({label, input, autocomplete, componentClass, byField, onSelect, stylesInput, ...props}) => (
  <Input
    id={label ? label.replace(/ /g, '') : input.name.replace(/ /g, '')}
    autoComplete={autocomplete ? 'on' : 'off'}
    type={componentClass}
    style={stylesInput}
    value={input ? (!byField ? input.value : input.value[byField]) : null}
    onChange={(event) => { input.onChange(event.target.value); onSelect ? onSelect(event.target.value) : null }} //eslint-disable-line
    onBlur={input && input.onBlur}
    onFocus={input && input.onFocus}
    {...props}
  />
)

FieldInput.defaultProps = {
  autocomplete: false
}

FieldInput.propTypes = {
  label: PropTypes.string,
  byField: PropTypes.any,
  componentClass: PropTypes.string,
  input: PropTypes.object,
  onSelect: PropTypes.func,
  autocomplete: PropTypes.bool,
  stylesInput: PropTypes.object
}

const FieldGroup = ({ horizontal, required, meta, info, className, ...props }) => (
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

FieldGroup.defaultProps = {
}

FieldGroup.propTypes = {
  label: PropTypes.string,
  mask: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.object,
  horizontal: PropTypes.object,
  info: PropTypes.string,
  className: PropTypes.string
}

export default FieldGroup
