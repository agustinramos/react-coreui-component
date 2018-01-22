import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import DayPicker from 'react-day-picker'
import { FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap'
import Icon from '../Icon'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

// Translate month names
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// Translate weekdays header
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Translate weekdays header titles
const WEEKDAYS_LONG = ['Domingo', 'Lunes', 'Martes',
  'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Translate for aria-label attribute
const LABELS = {
  nextMonth: 'Siguiente mes',
  previousMonth: 'Anterior mes'
}

// Component will receive date, locale and localeUtils props
function YearMonthForm ({ date, localeUtils, onChange, enabledYearChange }) {
  let years = []
  if (typeof enabledYearChange === 'number' || typeof enabledYearChange === 'object') {
    let fromMonth = 0
    let toMonth = 0

    if (typeof enabledYearChange === 'object') {
      if (enabledYearChange.from && enabledYearChange.to && enabledYearChange.from <= enabledYearChange.to) {
        fromMonth = parseInt(moment().add(enabledYearChange.from, 'year').format('YYYY'), 10)
        toMonth = parseInt(moment().add(enabledYearChange.to, 'year').format('YYYY'), 10)
      }
      if (enabledYearChange.from &&
        enabledYearChange.to &&
        enabledYearChange.dynamic &&
        enabledYearChange.from <= enabledYearChange.to
      ) {
        fromMonth = parseInt(moment(date.getFullYear(), 'YYYY', true).add(enabledYearChange.from, 'year').format('YYYY'), 10)
        toMonth = parseInt(moment(date.getFullYear(), 'YYYY', true).add(enabledYearChange.to, 'year').format('YYYY'), 10)
      }
    } else {
      fromMonth = parseInt(enabledYearChange <= 0 ? moment().add(enabledYearChange, 'year').format('YYYY') : moment().format('YYYY'), 10)
      toMonth = parseInt(enabledYearChange <= 0 ? moment().format('YYYY') : moment().add(enabledYearChange, 'year').format('YYYY'), 10)
    }
    for (let i = fromMonth; i <= toMonth; i += 1) {
      years.push(i)
    }
  } else if (Array.isArray(enabledYearChange)) {
    years = enabledYearChange
  }

  return (
    <div className='DayPicker-Caption'>
      <span>{ MONTHS[date.getMonth()] }</span>
      <select
        name='year'
        onChange={e => onChange(e.currentTarget.value, date.getMonth())}
        value={date.getFullYear()}
      >
        {years.map((year, i) =>
          <option key={i} value={year}>
            {year}
          </option>
        )}
      </select>
    </div>
  )
}

YearMonthForm.propTypes = {
  date: PropTypes.object,
  localeUtils: PropTypes.object,
  onChange: PropTypes.func,
  enabledYearChange: PropTypes.any
}

class FieldDate extends Component {
  constructor (props) {
    super(props)
    let formato = (props.formato ? props.formato : 'DD/MM/YYYY')

    this.state = {
      formato,
      showOverlay: false,
      value: (props.input.value && props.input.value !== '' ? moment(props.input.value, formato, true).format(formato) : ''),
      selectedDay: (props.input.value && props.input.value !== '' ? moment(props.input.value, formato, true).toDate() : null)
    }
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleOpenDatepicker = this.handleOpenDatepicker.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this)
    this.handleCleanDatepicker = this.handleCleanDatepicker.bind(this)
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.input.value === '') {
      this.setState({
        value: '',
        selectedDay: null
      })
    } else {
      this.setState({
        value: (nextProps.input.value && nextProps.input.value !== '' ? moment(nextProps.input.value, this.state.formato, true).format(this.state.formato) : ''),
        selectedDay: (nextProps.input.value && nextProps.input.value !== '' ? moment(nextProps.input.value, this.state.formato, true).toDate() : null)
      })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.clickTimeout)
  }

  handleContainerMouseDown () {
    this.clickedInside = true
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  handleCleanDatepicker () {
    this.setState({
      value: '',
      showOverlay: false,
      selectedDay: null
    }, () => {
      this.props.input && this.props.input.onChange && this.props.input.onChange('')
      this.props.input && this.props.input.onBlur && this.props.input.onBlur('')
      this.props.onSelected && this.props.onSelected('')
    })
  }

  handleOpenDatepicker () {
    this.setState({
      showOverlay: true
    })
    this.input.focus()
  }

  handleInputBlur (e) {
    let showOverlay = this.clickedInside

    this.setState({
      showOverlay
    })

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      // this.input.focus()
    }
  }

  handleInputChange (e) {
    let { value } = e.target
    let momentDay = moment(value, this.state.formato, true)
    if (momentDay.isValid()) {
      this.setState({
        selectedDay: momentDay.toDate(),
        value
      }, () => {
        this.daypicker.showMonth(this.state.selectedDay)
      })
    } else {
      this.setState({ value, selectedDay: null })
    }

    // if (this.props.onSelected) {
    //   this.props.onSelected(value)
    // } else {
    //   this.props.input.onChange(value)
    // }
  }

  handleDayClick (day, { disabled, selected }) {
    if (disabled) {
      return
    }
    this.setState({
      value: moment(day).format(this.state.formato),
      selectedDay: day,
      showOverlay: false
    }, () => {
      this.props.input && this.props.input.onChange && this.props.input.onChange(this.state.value)
      this.props.onSelected && this.props.onSelected(this.state.value)
    })
  }

  _renderTooltip (text) {
    return (
      <Tooltip id='tooltip'>
        <strong>{text}</strong>
      </Tooltip>
    )
  }

  handleYearMonthChange (year, month) {
    this.setState({
      month: new Date(year, month)
    })
  }

  render () {
    return (
      <FormGroup
        color={(!this.props.meta.touched ? '' : this.props.meta.valid ? '' : 'danger')}
        style={this.props.styleFormGroup}
        className={this.props.className}
      >
        { this.props.label &&
          <Label for={this.props.label.replace(/ /g, '')}>
            {this.props.label} {this.props.required && <span className='text-danger'>*</span>}
          </Label>
        }
        <div onMouseDown={this.handleContainerMouseDown}>
          <InputGroup style={this.props.styleInputGroup}>
            <input
              className='form-control'
              readOnly
              disabled={this.props.disabled}
              type='text'
              ref={(input) => { this.input = input }}
              placeholder={this.props.placeholder}
              value={this.state.value}
              onChange={this.handleInputChange}
              onBlur={this.handleInputBlur}
            />

            { (this.props.disabled && this.props.motiveDisabled) &&
              <OverlayTrigger
                placement='top'
                overlay={this._renderTooltip(this.props.motiveDisabled)}
              >
                <InputGroupAddon style={{cursor: 'not-allowed'}}
                >
                  <Icon
                    bootstrap='calendar'
                  />
                </InputGroupAddon>
              </OverlayTrigger>
            }

            { (this.props.disabled && !this.props.motiveDisabled) &&
              <InputGroupAddon
                style={{cursor: 'not-allowed'}}
              >
                <Icon
                  bootstrap='calendar'
                />
              </InputGroupAddon>
            }

            { !this.props.disabled &&
              <OverlayTrigger
                placement='top'
                overlay={this._renderTooltip('Abrir calendario')}
              >
                <InputGroupAddon
                  style={{cursor: 'pointer'}}
                  onClick={this.handleOpenDatepicker}>
                  <Icon
                    bootstrap='calendar'
                  />
                </InputGroupAddon>
              </OverlayTrigger>
            }

            { !this.props.required &&
              <OverlayTrigger
                placement='top'
                overlay={this._renderTooltip('Limpiar')}
              >
                <InputGroupAddon style={{cursor: 'pointer'}} onClick={this.handleCleanDatepicker}>
                  <Icon
                    bootstrap='close'
                  />
                </InputGroupAddon>
              </OverlayTrigger>
            }
          </InputGroup>
          { this.state.showOverlay &&
            <div
              style={{
                position: 'absolute',
                height: 325,
                zIndex: 10
              }}
            >
              <div
                style={{
                  position: 'relative',
                  background: 'white',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, .15)'
                }}
              >
                <DayPicker
                  ref={daypicker => { this.daypicker = daypicker }}
                  locale='es'
                  months={MONTHS}
                  weekdaysLong={WEEKDAYS_LONG}
                  weekdaysShort={WEEKDAYS_SHORT}
                  labels={LABELS}
                  initialMonth={this.state.selectedDay || this.props.initialMonth}
                  onDayClick={this.handleDayClick}
                  selectedDays={this.state.selectedDay}
                  month={this.state.month}
                  fromMonth={this.props.fromMonth}
                  toMonth={this.props.toMonth}
                  disabledDays={this.props.disabledDays}
                  captionElement={
                    this.props.enabledYearChange &&
                    <YearMonthForm
                      onChange={this.handleYearMonthChange}
                      enabledYearChange={this.props.enabledYearChange}
                    />
                  }
                  {...this.props.config}
                />
              </div>
            </div>
          }
        </div>
        {this.props.meta.touched && this.props.meta.error && <FormFeedback>{this.props.meta.error}</FormFeedback>}
      </FormGroup>
    )
  }
}

FieldDate.defaultProps = {
  meta: {},
  enabledYearChange: {from: -70, to: +10, dynamic: true}
}

FieldDate.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  onSelected: PropTypes.func,
  fromMonth: PropTypes.object,
  toMonth: PropTypes.object,
  placeholder: PropTypes.string,
  formato: PropTypes.string,
  disabled: PropTypes.bool,
  motiveDisabled: PropTypes.string,
  initialMonth: PropTypes.object,
  styleFormGroup: PropTypes.object,
  styleInputGroup: PropTypes.object,
  disabledDays: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.func
  ]),
  config: PropTypes.object,
  className: PropTypes.string,
  enabledYearChange: PropTypes.any
}

export default FieldDate
