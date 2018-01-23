import React, { Component } from 'react'
import PropTypes from 'prop-types'
import objectPath from 'object-path'

import { FormGroup, Label, Button, FormFeedback, Col, InputGroup, InputGroupAddon, Input, Dropdown, DropdownMenu } from 'reactstrap'
import Icon from '../Icon'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class FieldBusqueda extends Component {
  constructor (props) {
    super(props)

    let value = ''
    if (props.input.value && props.datalist[0]) {
      value = (props.itemValueShow
        ? typeof props.itemValueShow === 'function'
          ? props.itemValueShow(props.input.value)
          : objectPath.get(props.datalist[0], props.itemValue) !== undefined
            ? objectPath.get(props.datalist[0], props.itemValueShow)
            : typeof props.itemValueDefault === 'function'
              ? props.itemValueDefault(props.datalist[0])
              : props.itemValueDefault
        : typeof props.itemValue === 'function'
          ? props.itemValue(props.datalist[0])
          : objectPath.get(props.datalist[0], props.itemValue) !== undefined
            ? objectPath.get(props.datalist[0], props.itemValue)
            : typeof props.itemValueDefault === 'function'
              ? props.itemValueDefault(props.datalist[0])
              : props.itemValueDefault
      )
    }

    let searchDebounce = 0
    if (!props.withButton) {
      searchDebounce = props.searchDebounce
    }

    this.state = {
      dropdownOpen: false,
      value,
      firstSearch: false,
      searchDebounce
    }
    this.toggle = this.toggle.bind(this)
    this._renderInput = this._renderInput.bind(this)
    this._renderResult = this._renderResult.bind(this)
    this.handlerChangeSearch = this.handlerChangeSearch.bind(this)
    this.handlerSelectItem = this.handlerSelectItem.bind(this)
    this.handlerKeyPress = this.handlerKeyPress.bind(this)
    this.handlerClickSearch = this.handlerClickSearch.bind(this)
    this.handleCleanBuscador = this.handleCleanBuscador.bind(this)
  }

  componentDidMount () {
    if (this.props.fieldArray && !this.props.noRescue && this.props.input && this.props.input.value) {
      this.props.input.onChange && this.props.input.onChange({itemKey: this.props.input.value, itemValue: this.state.value})
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.input && nextProps.input.value === '') {
      this.setState({
        value: ''
      })
    } else if (nextProps.input && nextProps.input.value !== '' &&
      typeof nextProps.input.value === 'object' &&
      nextProps.input.value.itemValue &&
      nextProps.input.value.itemValue !== this.state.value
    ) {
      this.setState({
        value: nextProps.input.value.itemValue
      })
    }
  }

  _renderTooltip (text) {
    return (
      <Tooltip id='tooltip'>
        <strong>{text}</strong>
      </Tooltip>
    )
  }

  toggle () {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    }, () => {
      this.inputSearch.focus()
    })
  }

  handlerChangeSearch (value) {
    let props = this.props
    window.clearTimeout(this.timeoutField)
    this.timeoutField = window.setTimeout(function () {
      props.onSearch(value)
    }, this.state.searchDebounce)
  }

  handlerSelectItem (value) {
    let itemValueShow = (this.props.itemValueShow
      ? typeof this.props.itemValueShow === 'function'
        ? this.props.itemValueShow(value)
        : objectPath.get(value, this.props.itemValue) !== undefined
          ? objectPath.get(value, this.props.itemValueShow)
          : typeof this.props.itemValueDefault === 'function'
            ? this.props.itemValueDefault(value)
            : this.props.itemValueDefault
      : typeof this.props.itemValue === 'function'
        ? this.props.itemValue(value)
        : objectPath.get(value, this.props.itemValue) !== undefined
          ? objectPath.get(value, this.props.itemValue)
          : typeof this.props.itemValueDefault === 'function'
            ? this.props.itemValueDefault(value)
            : this.props.itemValueDefault
    )
    this.setState({
      value: itemValueShow,
      dropdownOpen: false
    }, () => {
      if (this.props.fieldArray) {
        this.props.input && this.props.input.onChange && this.props.input.onChange({itemKey: objectPath.get(value, this.props.itemKey), itemValue: objectPath.get(value, this.props.itemValue)})
      } else {
        this.props.input && this.props.input.onChange && this.props.input.onChange(objectPath.get(value, this.props.itemKey))
      }
      this.props.input && this.props.input.onBlur && this.props.input.onBlur()
      this.props.onChanged && this.props.onChanged(objectPath.get(value, this.props.itemKey))
    })
  }

  handlerKeyPress (e) {
    if (e.which === 13 || e.charCode === 13 || e.keyCode === 13) {
      e.preventDefault()
      if (this.props.withButton) {
        this.handlerChangeSearch(e.currentTarget.value)
      }
    }
  }

  handlerClickSearch (e) {
    e.preventDefault()
    this.handlerChangeSearch(this.inputSearch.value)
  }

  handleCleanBuscador () {
    this.setState({
      value: '',
      dropdownOpen: false
    }, () => {
      this.props.input && this.props.input.onChange && this.props.input.onChange('')
      this.props.input && this.props.input.onBlur && this.props.input.onBlur('')
      this.props.onChanged && this.props.onChanged('')
    })
  }

  _renderResult (r, k) {
    return (
      <li key={k} role='presentation'>
        <a
          role='menuitem'
          tabIndex='-1'
          onClick={() => this.handlerSelectItem(r)}
        >
          { typeof this.props.itemValue === 'function'
            ? this.props.itemValue(r)
            : objectPath.get(r, this.props.itemValue) !== undefined
              ? objectPath.get(r, this.props.itemValue)
              : typeof this.props.itemValueDefault === 'function'
                ? this.props.itemValueDefault(r)
                : this.props.itemValueDefault
          }
        </a>
      </li>
    )
  }

  _renderInput () {
    let {
      datalist, itemKey, itemValue, onSearch, autocomplete, componentClass, onChanged, noRescue, // eslint-disable-line
      stylesInput, className, label, onSelect, withButton, byField, disabled, motiveDisabled, fieldArray, // eslint-disable-line
      input, meta, required, fetching, searchDebounce, itemValueDefault, itemValueShow, ...props} = this.props // eslint-disable-line
    return (
      <InputGroup className={className + ' FieldBusqueda'}>
        <InputGroupAddon>
          <Icon
            bootstrap='magnifier'
          />
        </InputGroupAddon>
        <div style={{width: '100%'}}>
          <Input
            id={label ? label.replace(/ /g, '') : input.name.replace(/ /g, '')}
            autoComplete={autocomplete ? 'on' : 'off'}
            type={componentClass}
            style={{...stylesInput, width: '100%'}}
            value={this.state.value}
            readOnly
            {...props}
          />
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownMenu>
              <FormGroup style={{margin: 7}}>
                <InputGroup>
                  <input
                    ref={(inputSearch) => { this.inputSearch = inputSearch }}
                    type='search'
                    placeholder='Buscar ...'
                    className='form-control'
                    style={{width: '100%', padding: '0.3rem 0.75rem'}}
                    onChange={e => !this.props.withButton && this.handlerChangeSearch(e.currentTarget.value)}
                    onKeyPress={this.handlerKeyPress}
                  />
                  { this.props.withButton &&
                    <Button
                      size='sm'
                      color='primary'
                      onClick={this.handlerClickSearch}
                    >
                      Buscar
                    </Button>
                  }
                  <Button
                    size='sm'
                    onClick={this.toggle}
                  >
                    Cerrar
                  </Button>
                </InputGroup>
              </FormGroup>
              <hr style={{margin: '5px 7px'}} />
              <ul role='menu'>
                <li role='presentation'
                  className={
                    ((datalist.length || fetching)
                      ? 'disabled'
                      : '')
                  }
                >
                  { fetching && <a role='menuitem' tabIndex='-1'>Buscando ...</a> }
                  { datalist.length === 0 && !fetching && <a role='menuitem' tabIndex='-1'>No se encuentran resultados</a> }
                </li>
                { datalist.length !== 0 && !fetching && datalist.map(this._renderResult) }
              </ul>
            </DropdownMenu>
          </Dropdown>
        </div>

        { (disabled && motiveDisabled) &&
          <OverlayTrigger
            placement='top'
            overlay={this._renderTooltip(motiveDisabled)}
          >
            <InputGroupAddon style={{cursor: 'not-allowed'}}
            >
              <Icon
                bootstrap='arrow-down'
              />
            </InputGroupAddon>
          </OverlayTrigger>
        }

        { (disabled && !motiveDisabled) &&
          <InputGroupAddon
            style={{cursor: 'not-allowed'}}
          >
            <Icon
              bootstrap='arrow-down'
            />
          </InputGroupAddon>
        }

        { !disabled &&
          <OverlayTrigger
            placement='top'
            overlay={this._renderTooltip('Abrir buscador')}
          >
            <InputGroupAddon
              style={{cursor: 'pointer'}}
              onClick={this.toggle}
            >
              <Icon
                bootstrap='arrow-down'
              />
            </InputGroupAddon>
          </OverlayTrigger>
        }

        { !required &&
          <OverlayTrigger
            placement='top'
            overlay={this._renderTooltip('Limpiar')}
          >
            <InputGroupAddon style={{cursor: 'pointer'}} onClick={this.handleCleanBuscador}>
              <Icon
                bootstrap='close'
              />
            </InputGroupAddon>
          </OverlayTrigger>
        }
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
            {meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback>}
          </Col>
        }

        { !horizontal && this._renderInput() }

        { !horizontal && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback> }
      </FormGroup>
    )
  }
}

FieldBusqueda.defaultProps = {
  autocomplete: false,
  searchDebounce: 300,
  fetching: false,
  datalist: [],
  noRescue: false
}

FieldBusqueda.propTypes = {
  label: PropTypes.string,
  mask: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.object,
  horizontal: PropTypes.object,
  byField: PropTypes.any,
  input: PropTypes.object,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  autocomplete: PropTypes.bool,
  itemReactKeyPropName: PropTypes.string,
  itemValuePropName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  searchDebounce: PropTypes.number,
  fetching: PropTypes.bool,
  onSearchValue: PropTypes.func,
  datalist: PropTypes.array,
  withButton: PropTypes.any,
  placeholder: PropTypes.string,
  disabled: PropTypes.any,
  motiveDisabled: PropTypes.string,
  itemValueShow: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  itemValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  itemValueDefault: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  itemKey: PropTypes.string,
  onSearch: PropTypes.func,
  componentClass: PropTypes.string,
  stylesInput: PropTypes.object,
  onChanged: PropTypes.func,
  fieldArray: PropTypes.bool,
  noRescue: PropTypes.bool
}

export default FieldBusqueda
