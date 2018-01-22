import React from 'react'
import PropTypes from 'prop-types'

import { InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap'
import { OverlayTrigger } from 'react-bootstrap'
import Icon from '../Icon'
import FieldDate from '../FieldDate'
import FieldDateTime from '../FieldDateTime'

export default function withFilter (Component) {
  class withFilter extends React.Component {
    constructor (props) {
      super(props)

      let selectFilterType = null
      let selectFilterValue = null
      let filter = null
      if (props.filter && typeof props.filter === 'object' && props.filter.options) {
        filter = []
        let saveFirstActive = true
        for (let prop in props.filter.options) {
          filter.push(prop)
          if (saveFirstActive) {
            selectFilterValue = prop
            selectFilterType = props.filter.options[prop]
            saveFirstActive = false
          }
        }
      }

      this.state = {
        filter,
        selectFilterType,
        selectFilterValue,
        inputFilterValue: ''
      }
      this.handlerOnChangeSelectFilter = this.handlerOnChangeSelectFilter.bind(this)
      this.handlerOnClickFindFilter = this.handlerOnClickFindFilter.bind(this)
      this.handlerOnChangeInput = this.handlerOnChangeInput.bind(this)
      this._renderSelectFilter = this._renderSelectFilter.bind(this)
      this._renderFilter = this._renderFilter.bind(this)
    }

    handlerOnChangeInput (value) {
      this.setState({
        inputFilterValue: value
      })
    }

    handlerOnClickFindFilter (prop, value) {
      let filter = []
      if (value && value !== '') {
        if (this.props.filter.output && this.props.filter.output[prop]) {
          filter.push({
            [this.props.outputDefault.p || 'p']: this.props.filter.output[prop].prop || prop,
            [this.props.outputDefault.v || 'v']: this.props.filter.output[prop].value
              ? typeof this.props.filter.output[prop].value === 'function'
                ? this.props.filter.output[prop].value(value)
                : this.props.filter.output[prop].value
              : value,
            [this.props.outputDefault.t || 't']: this.props.filter.output[prop].type || (this.state.selectFilterType === 'date' || this.state.selectFilterType === 'datetime' ? 'date' : undefined),
            [this.props.outputDefault.e || 'e']: (this.props.filter.output[prop].exp ? this.props.filter.output[prop].exp : undefined)
          })
        } else {
          filter.push({
            [this.props.outputDefault.p || 'p']: prop,
            [this.props.outputDefault.v || 'v']: value,
            [this.props.outputDefault.t || 't']: (this.state.selectFilterType === 'date' || this.state.selectFilterType === 'datetime' ? 'date' : undefined)
          })
        }
      }

      this.setState({
        inputFilterValue: value
      }, () => this.props.setActiveFilter(filter))
    }

    handlerOnChangeSelectFilter (value) {
      if (this.state.selectFilterType) {
        this.setState({
          selectFilterValue: value,
          selectFilterType: this.props.filter.options[value],
          inputFilterValue: ''
        }, () => {
          if (this.state.selectFilterType === 'text' || this.state.selectFilterType === 'number') {
            this.inputFilter.focus()
          }
        })
      } else {
        this.inputFilter.focus()
      }
    }

    _renderSelectFilter (opt, kOpt) {
      return (
        <option
          key={'opt' + kOpt}
          value={opt}
        >
          {this.props.tHead[opt]}
        </option>
      )
    }

    _renderFilter () {
      if (this.props.filter) {
        return (
          <div className='pull-right'>
            <InputGroup>
              <InputGroupButton>
                <select
                  style={{width: '100%'}}
                  className='form-control'
                  value={this.state.selectFilterValue}
                  onChange={e => this.handlerOnChangeSelectFilter(e.currentTarget.value)}
                >
                  { this.state.filter.map(this._renderSelectFilter)}
                </select>
              </InputGroupButton>

              { this.state.selectFilterType && this.state.selectFilterType === 'date' &&
                <FieldDate
                  styleFormGroup={{marginBottom: 0}}
                  styleInputGroup={{height: '2.22rem'}}
                  type='text'
                  formato='DD/MM/YYYY'
                  input={{value: this.state.inputFilterValue}}
                  onSelected={value => this.handlerOnClickFindFilter(this.state.selectFilterValue, value)}
                />
              }
              { this.state.selectFilterType && this.state.selectFilterType === 'datetime' &&
                <FieldDateTime
                  styleFormGroup={{marginBottom: 0}}
                  styleInputGroup={{height: '2.22rem'}}
                  type='text'
                  formato='DD/MM/YYYY'
                  input={{value: this.state.inputFilterValue}}
                  onSelected={value => this.handlerOnClickFindFilter(this.state.selectFilterValue, value)}
                />
              }
              { this.state.selectFilterType && Array.isArray(this.state.selectFilterType) &&
                <select
                  className='form-control'
                  value={this.state.inputFilterValue}
                  onChange={e => this.handlerOnClickFindFilter(this.state.selectFilterValue, e.currentTarget.value)}
                >
                  <option value='' />
                  { this.state.selectFilterType.map((v, k) => {
                    return (
                      <option key={'option-' + k} value={v.value || v}>{ v.label || v }</option>
                    )
                  })}
                </select>
              }
              { (!this.state.selectFilterType || this.state.selectFilterType === 'text' || this.state.selectFilterType === 'number') &&
                <input
                  type={this.state.selectFilterType}
                  ref={(input) => { this.inputFilter = input }}
                  className='form-control'
                  onChange={e => this.handlerOnChangeInput(e.currentTarget.value)}
                  onKeyPress={e => {
                    if (e.which === 13 || e.charCode === 13 || e.keyCode === 13) {
                      this.handlerOnClickFindFilter(this.state.selectFilterValue, e.currentTarget.value)
                    }
                  }}
                />
              }
              <OverlayTrigger
                placement='top'
                overlay={this.props._renderTooltip('Buscar')}
              >
                <InputGroupAddon
                  style={{cursor: 'pointer'}}
                  onClick={e => this.handlerOnClickFindFilter(this.state.selectFilterValue, this.state.inputFilterValue)}
                >
                  <Icon
                    bootstrap='magnifier'
                  />
                </InputGroupAddon>
              </OverlayTrigger>
            </InputGroup>
          </div>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderFilter={this._renderFilter}
          {...this.props}
        />
      )
    }
  }

  withFilter.defaultProps = {
    tHead: {},
    outputDefault: {}
  }

  withFilter.propTypes = {
    filter: PropTypes.object,
    tHead: PropTypes.object,
    outputDefault: PropTypes.object,
    _renderTooltip: PropTypes.func,
    setActiveFilter: PropTypes.func
  }

  return withFilter
}
