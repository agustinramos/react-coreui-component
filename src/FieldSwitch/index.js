import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Label } from 'reactstrap'
import { } from 'react-bootstrap'

class FieldSwitch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: (props.input.value !== '' && props.input.value !== false)
    }
    this.handlerChange = this.handlerChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.input.value !== '' && nextProps.input.value !== this.state.value) {
      this.setState({
        value: nextProps.input.value
      })
    }
  }

  handlerChange (e) {
    this.setState({
      value: (e.currentTarget.value === 'false')
    }, () => {
      this.props.input.onChange && this.props.input.onChange(this.state.value)
      this.props.onChanged && this.props.onChanged(this.state.value)
    })
  }

  render () {
    let { disabled, size, style, label, horizontal, right, withText, pill, color, outline, outlineAlt, onChanged, input, meta, ...props } = this.props // eslint-disable-line
    return (
      <FormGroup
        check
        className={right && 'overflow-hidden'}
        style={style}
      >
        { (!horizontal && label) &&
          <wrapper>
            <Label for={label.replace(/ /g, '')}>{label}</Label>
            <br />
          </wrapper>
        }
        { (horizontal && label) &&
          <wrapper>
            <span className={(right ? 'pull-left' : '')} style={{maxWidth: (right ? '75%' : 'initial')}}>{ label }</span>
            { !right && <wrapper>&nbsp;&nbsp;</wrapper> }
          </wrapper>
        }
        <label
          className={'switch' +
            (right ? ' pull-right' : '') +
            (withText ? ' switch-text' : ' switch-default') +
            (pill ? ' switch-pill' : '') +
            (color ? ' switch-' + color : '') +
            (outline ? '-outline' : '') +
            (outlineAlt ? '-outline-alt' : '') +
            (size ? ' switch-' + size : '')
          }
          style={{cursor: (disabled ? 'not-allowed' : '')}}
        >
          <Input
            className='switch-input'
            type={props.type}
            checked={this.state.value}
            value={this.state.value}
            onChange={this.handlerChange}
            disabled={disabled}
          />
          <span
            className={
              'switch-label' +
              (disabled ? ' switch-disabled' : '')
            }
            data-on={withText && withText.on}
            data-off={withText && withText.off} />
          <span className='switch-handle' />
        </label>
      </FormGroup>
    )
  }
}

FieldSwitch.defaultProps = {
  color: 'primary',
  size: 'md',
  disabled: false
}

FieldSwitch.propTypes = {
  label: PropTypes.string,
  right: PropTypes.bool,
  withText: PropTypes.object,
  pill: PropTypes.bool,
  color: PropTypes.string,
  outline: PropTypes.bool,
  outlineAlt: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  horizontal: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  onChanged: PropTypes.func
}

export default FieldSwitch
