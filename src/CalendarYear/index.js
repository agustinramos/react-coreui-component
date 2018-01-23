import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DayPicker from 'react-day-picker'
import moment from 'moment'

// Translate month names
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre',
  'Diciembre']

// Translate weekdays header
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Translate weekdays header titles
const WEEKDAYS_LONG = ['Domingo', 'Lunes', 'Martes',
  'Miércoles', 'Jueves', 'Viernes', 'Sábado']

class CalendarYear extends Component {
  constructor (props) {
    super(props)

    let year = props.calendarios[0]
    if (props.initCalendario) {
      year = props.initCalendario
    }

    this.state = {
      year,
      calendarios: []
    }
    this.showPrevious = this.showPrevious.bind(this)
    this.showNext = this.showNext.bind(this)
    this.handleDayClick = this.handleDayClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.calendarios.length !== 0 && this.state.calendarios.length === 0) {
      let year = nextProps.calendarios[0]
      if (nextProps.initCalendario) {
        year = nextProps.initCalendario
      }

      nextProps.changeCalendario(year)
      this.setState({
        year,
        calendarios: nextProps.calendarios
      })
    }
  }

  showPrevious () {
    this.props.changeCalendario(this.state.year - 1)
    this.setState({
      year: this.state.year - 1
    })
  }

  showNext () {
    this.props.changeCalendario(this.state.year + 1)
    this.setState({
      year: this.state.year + 1
    })
  }

  handleDayClick (day, modifiers, { disabled, selected }) {
    if (disabled) {
      return
    }
    this.props.onSelected && this.props.onSelected(moment(day))
  }

  render () {
    return (
      <div className='YearCalendar'>
        { this.props.calendarios.length !== 0 &&
          <h1>
            { this.props.calendarios[this.props.calendarios.indexOf(this.state.year - 1)] && <a onClick={this.showPrevious}>{this.state.year - 1}</a>}
            {this.state.year}
            { this.props.calendarios[this.props.calendarios.indexOf(this.state.year + 1)] && <a onClick={this.showNext}>{this.state.year + 1}</a>}
          </h1>
        }
        { this.props.calendarios.length !== 0 &&
          <hr />
        }
        { !this.props.fetching && this.props.fetchingDias && this.props.calendarios.length !== 0 &&
          <DayPicker
            locale='es'
            months={MONTHS}
            weekdaysLong={WEEKDAYS_LONG}
            weekdaysShort={WEEKDAYS_SHORT}
            onDayClick={this.handleDayClick}
            canChangeMonth={false}
            month={new Date(this.state.year, 0, 1)}
            numberOfMonths={12}
            modifiers={this.props.modifiers}
            renderDay={this.props.renderDay && this.props.renderDay}
          />
        }
        { this.props.fetching &&
          <h3 style={{color: '#596464'}}>Cargando ...</h3>
        }
        { !this.props.fetching && this.props.calendarios.length === 0 &&
          <p style={{color: '#596464'}}><strong>No existen calendarios cargados</strong></p>
        }
      </div>
    )
  }
}

CalendarYear.defaultProps = {
  calendarios: []
}

CalendarYear.propTypes = {
  calendarios: PropTypes.array,
  initCalendario: PropTypes.number,
  fetching: PropTypes.bool,
  fetchingDias: PropTypes.bool,
  onSelected: PropTypes.func,
  renderDay: PropTypes.func,
  changeCalendario: PropTypes.func,
  modifiers: PropTypes.object
}

export default CalendarYear
