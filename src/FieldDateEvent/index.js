import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { merge } from 'ramda'
import moment from 'moment'

import { FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon, Button, Alert } from 'reactstrap'
import Icon from '../Icon'
import FieldSwitch from '../FieldSwitch'
import FieldDate from '../FieldDate'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

// Translate weekdays header
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

class FieldDateEvent extends Component {
  constructor (props) {
    super(props)

    let repeticiones = []
    for (let i = 1; i <= 52; i++) {
      repeticiones.push(i)
    }

    let inputsDays = {}
    for (let j = 0; j <= 6; j++) {
      inputsDays[j] = false
    }

    this.state = {
      showOverlay: false,
      value: {semanas: 1, desde: '', hasta: '', dias: []},
      inputsDays: inputsDays,
      repeticionPorSemana: repeticiones,
      formatStringValue: '',
      showErrors: ''
    }
    this.handleOpenDatepickerEvent = this.handleOpenDatepickerEvent.bind(this)
    this.handleCleanDatepickerEvent = this.handleCleanDatepickerEvent.bind(this)
    this.handlerOnSelectedDay = this.handlerOnSelectedDay.bind(this)
    this.handlerChangeRepeticionSemana = this.handlerChangeRepeticionSemana.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
    this.cleanFechaHasta = this.cleanFechaHasta.bind(this)

    this._renderDays = this._renderDays.bind(this)
    this.handlerChangeDay = this.handlerChangeDay.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.input.value === '') {
      let repeticiones = []
      for (let i = 1; i <= 52; i++) {
        repeticiones.push(i)
      }

      let inputsDays = {}
      for (let j = 0; j <= 6; j++) {
        inputsDays[j] = false
      }

      this.setState({
        showOverlay: false,
        value: {semanas: 1, desde: '', hasta: '', dias: []},
        inputsDays: inputsDays,
        repeticionPorSemana: repeticiones,
        formatStringValue: '',
        showErrors: ''
      })
    }
  }

  handleCleanDatepickerEvent () {
    this.setState({value: ''}, () => this.props.input.onChange(''))
  }

  handleOpenDatepickerEvent () {
    this.setState({ showOverlay: true })
  }

  handlerOnSelectedDay (field, value) {
    this.setState({
      value: merge(this.state.value, {[field]: value})
    }, () => {
      if (field === 'desde') {
        this.cleanFechaHasta()
      }
      this.props.input.onChange(this.state.value)
    })
  }

  handlerChangeRepeticionSemana (value) {
    this.setState({
      value: merge(this.state.value, {semanas: parseInt(value, 10)})
    }, () => this.props.input.onChange(this.state.value))
  }

  cleanFechaHasta () {
    this.setState({
      value: merge(this.state.value, {hasta: ''})
    }, () => this.props.input.onChange(this.state.value))
  }

  hideOverlay () {
    let showErrors = ''
    if (this.state.value && this.state.value.desde === '' && this.state.value.hasta === '') {
      showErrors += 'Ingrese desde y hasta'
    }
    if (this.state.value && this.state.value.desde === '' && this.state.value.hasta !== '') {
      showErrors += 'Ingrese desde'
    }
    if (this.state.value && this.state.value.desde !== '' && this.state.value.hasta === '') {
      showErrors += 'Ingrese hasta'
    }

    let hayAlgunDia = false
    let dias = ', todos los '
    for (let propiedad in this.state.inputsDays) {
      if (this.state.inputsDays[propiedad]) {
        hayAlgunDia = true
        dias += WEEKDAYS_SHORT[propiedad] + ', '
      }
    }

    if (!hayAlgunDia) {
      showErrors += (showErrors !== '' ? ', ingrese algún día' : 'ingrese algún día')
    }

    if (showErrors !== '') {
      this.setState({
        showErrors
      })
    } else {
      let formatStringValue = 'del ' + this.state.value.desde + ' hasta el ' + this.state.value.hasta
      formatStringValue += dias.slice(0, -2)
      formatStringValue += ', cada ' + this.state.value.semanas + (this.state.value.semanas === 1 ? ' semana' : ' semanas')

      this.setState({
        showOverlay: false,
        showErrors,
        formatStringValue
      })
    }
  }

  _renderDays (day, key) {
    return (
      <FieldSwitch
        key={'dia-' + key}
        name={'dia-' + key}
        label={day}
        type='checkbox'
        right
        horizontal
        size='sm'
        input={{value: this.state.inputsDays[key]}}
        onChanged={(value) => this.handlerChangeDay(value, key)}
      />
    )
  }

  handlerChangeDay (value, key) {
    let inputsDays = this.state.inputsDays
    inputsDays[key] = value

    // CONVIERTO EL OBJETO A UN ARRAY DE ID SOLOS
    let inputsRedux = []
    for (let propiedad in inputsDays) {
      if (inputsDays[propiedad]) {
        inputsRedux.push(parseInt(propiedad, 10))
      }
    }

    this.setState({
      inputsDays,
      value: merge(this.state.value, {dias: inputsRedux})
    }, () => {
      this.props.input.onChange(this.state.value)
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
    return (
      <FormGroup color={(!this.props.meta.touched ? '' : this.props.meta.valid ? '' : 'danger')}>
        { this.props.label &&
          <Label for={this.props.label.replace(/ /g, '')}>{this.props.label} {this.props.required && <span className='text-danger'>*</span>}</Label>
        }

        <InputGroup>
          <input
            className='form-control'
            readOnly
            type='text'
            ref={(input) => { this.input = input }}
            placeholder={this.props.placeholder}
            value={this.state.formatStringValue}
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
                onClick={this.handleOpenDatepickerEvent}>
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
              <InputGroupAddon style={{cursor: 'pointer'}} onClick={this.handleCleanDatepickerEvent}>
                <Icon
                  bootstrap='close'
                />
              </InputGroupAddon>
            </OverlayTrigger>
          }
        </InputGroup>

        <div style={{
          position: 'absolute',
          background: 'white',
          boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
          width: 510,
          height: 330,
          zIndex: 10,
          display: (this.state.showOverlay ? 'block' : 'none')
        }}
        >

          <div className='DayPicker-repeat'
            style={{float: 'left', width: 90, margin: '1rem 1rem 0px'}}
          >
            <label style={{marginBottom: 10}}>Repetir <span className='text-danger'>*</span></label>
            { WEEKDAYS_SHORT.map(this._renderDays) }
          </div>

          <div style={{float: 'left', width: 350, margin: '1rem'}}>
            <Field
              required
              name='desde'
              type='text'
              label='Desde'
              formato={this.props.formato}
              input={{value: this.state.value.desde}}
              {...this.props.configDesde}
              component={FieldDate}
              onSelected={(value) => {
                this.handlerOnSelectedDay('desde', value)
              }}
            />

            <Field
              required
              name='hasta'
              type='text'
              label='Hasta'
              formato={this.props.formato}
              input={{value: this.state.value.hasta}}
              disabled={!this.state.value.desde}
              motiveDisabled='Seleccione primero desde'
              initialMonth={moment(this.state.value.desde, 'DD/MM/YYYY', true).toDate()}
              disabledDays={[{
                before: moment(this.state.value.desde, 'DD/MM/YYYY', true).toDate()
              }]}
              {...this.props.configHasta}
              component={FieldDate}
              onSelected={(value) => {
                this.handlerOnSelectedDay('hasta', value)
              }}
            />

            <FormGroup>
              <Label for='repeticionPorSemana'>
                Se repite cada &nbsp;
                <select name='repeticionPorSemana'
                  style={{
                    width: 70,
                    color: '#607d8b',
                    backgroundColor: '#fff',
                    backgroundImage: 'none',
                    backgroundClip: 'padding-box',
                    border: '1px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: 0,
                    transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s'
                  }}
                  value={this.state.value.semanas}
                  onChange={(e) => {
                    this.handlerChangeRepeticionSemana(e.currentTarget.value)
                  }}
                >
                  { this.state.repeticionPorSemana.map((v, k) => {
                    return (
                      <option key={k} value={v}>{v}</option>
                    )
                  })}
                </select>
                &nbsp; semana/s
              </Label>
            </FormGroup>

            { this.state.showErrors !== '' &&
              <wrapper
                id='customError'
                className='animated fadeInUp'
              >
                <Alert
                  color='danger'
                >
                  { this.state.showErrors }
                </Alert>
              </wrapper>
            }
            <div style={{ position: 'absolute', width: 350, bottom: 20 }}>
              <span className='pull-left text-danger'>* Campos requeridos</span>
              <Button
                className='pull-right'
                size='sm'
                color='success'
                onClick={this.hideOverlay}
              >
                Listo
              </Button>
            </div>
          </div>

        </div>

        {this.props.meta.touched && this.props.meta.error && <FormFeedback>{this.props.meta.error}</FormFeedback>}
      </FormGroup>
    )
  }
}

FieldDateEvent.defaultProps = {
}

FieldDateEvent.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  formato: PropTypes.string,
  configDesde: PropTypes.object,
  configHasta: PropTypes.object,
  disabled: PropTypes.bool,
  motiveDisabled: PropTypes.string
}

export default FieldDateEvent
