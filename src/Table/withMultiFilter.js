// const EQ        = '=';
// const NEQ       = '<>';
// const LT        = '<';
// const LTE       = '<=';
// const GT        = '>';
// const GTE       = '>=';
// const IS        = '='; // no difference with EQ
// const IN        = 'IN';
// const NIN       = 'NIN';
// const CONTAINS  = 'CONTAINS';

import React from 'react'
import PropTypes from 'prop-types'

import { merge } from 'ramda'
import deepcopy from 'deepcopy'
import { Row, Col, Button } from 'reactstrap'
import { OverlayTrigger } from 'react-bootstrap'
import Card from '../Card'
import Icon from '../Icon'
import FieldDate from '../FieldDate'
import FieldDateTime from '../FieldDateTime'

export default function withMultiFilter (Component) {
  class withMultiFilter extends React.Component {
    constructor (props) {
      super(props)

      let fields = []
      for (let prop in props.multiFilter) {
        if (props.tHead[prop]) {
          fields.push({value: prop, label: props.tHead[prop], showAlways: props.multiFilter[prop].showAlways})
        } else if (props.multiFilter[prop].label) {
          fields.push({value: prop, label: props.multiFilter[prop].label, showAlways: props.multiFilter[prop].showAlways})
        }
      }

      this.state = {
        fields,
        fieldsBck: fields,
        fieldsUsados: {},
        filtros: [{field: '', criterio: '', valor: ''}]
      }
      this.handlerResetear = this.handlerResetear.bind(this)
      this.handlerAgregarFiltro = this.handlerAgregarFiltro.bind(this)
      this.handlerEliminarFiltro = this.handlerEliminarFiltro.bind(this)
      this.handlerGuardarLabel = this.handlerGuardarLabel.bind(this)
      this.handlerGuardarCriterio = this.handlerGuardarCriterio.bind(this)
      this.handlerGuardarValue = this.handlerGuardarValue.bind(this)
      this.handlerFiltrar = this.handlerFiltrar.bind(this)
      this.recalculoFieldsUsados = this.recalculoFieldsUsados.bind(this)
      this.saveFiltros = this.saveFiltros.bind(this)
      this._renderMultiFilter = this._renderMultiFilter.bind(this)
      this._renderFiltro = this._renderFiltro.bind(this)
      this._renderCriterio = this._renderCriterio.bind(this)
      this._renderCampo = this._renderCampo.bind(this)
    }

    handlerResetear (e) {
      if (this.Card.state.collapseOpen) {
        e.stopPropagation()
      }
      this.setState({
        fields: this.state.fieldsBck,
        fieldsUsados: {},
        filtros: [{field: '', criterio: '', valor: ''}]
      })
    }

    handlerAgregarFiltro (e) {
      if (this.Card.state.collapseOpen) {
        e.stopPropagation()
      }
      let filtros = deepcopy(this.state.filtros)
      filtros.push({field: '', criterio: '', valor: ''})
      this.saveFiltros(filtros)
    }

    handlerEliminarFiltro (kf) {
      this.recalculoFieldsUsados(undefined, kf)

      let filtros = deepcopy(this.state.filtros)
      filtros.splice(kf, 1)
      this.saveFiltros(filtros)
    }

    handlerGuardarLabel (value, kf) {
      this.recalculoFieldsUsados(value, kf)

      let filtros = deepcopy(this.state.filtros)
      filtros[kf] = merge(filtros[kf], {field: value, criterio: '', valor: ''})
      this.saveFiltros(filtros)
    }

    handlerGuardarCriterio (value, kf) {
      let filtros = deepcopy(this.state.filtros)
      let criteria = this.props.multiFilter[this.state.filtros[kf].field].criteria.filter(c => c.v === value)[0]
      filtros[kf] = merge(filtros[kf], {criterio: value, valor: criteria.d || ''})
      this.saveFiltros(filtros)
    }

    handlerGuardarValue (value, kf) {
      let filtros = deepcopy(this.state.filtros)
      filtros[kf] = merge(filtros[kf], {valor: value})
      this.saveFiltros(filtros)
    }

    handlerFiltrar () {
      let normalizeFiltros = deepcopy(this.state.filtros)
      normalizeFiltros = normalizeFiltros
        .filter(f => (f.field !== '' && f.criterio !== '' && f.valor !== ''))
        .map((f, kf) => {
          f[this.props.outputDefault.p || 'p'] = (this.props.multiFilter[f.field].prop ? this.props.multiFilter[f.field].prop : f.field)
          f[this.props.outputDefault.v || 'v'] = f.valor
          f[this.props.outputDefault.t || 't'] = (this.props.multiFilter[f.field].type === 'date' || this.props.multiFilter[f.field].type === 'datetime' ? 'date' : undefined)
          f[this.props.outputDefault.e || 'e'] = f.criterio
          delete f.field
          delete f.valor
          delete f.criterio
          return f
        })
      this.props.setActiveFilter(normalizeFiltros)
    }

    saveFiltros (filtros) {
      this.setState({filtros})
    }

    recalculoFieldsUsados (value, kf) {
      let fields = deepcopy(this.state.fields)
      let fieldsUsados = deepcopy(this.state.fieldsUsados)
      fieldsUsados[kf] = value

      fields = fields.map(f => {
        f.usado = false
        for (let prop in fieldsUsados) {
          if (f.value === fieldsUsados[prop]) {
            f.usado = true
          }
        }
        return f
      })

      this.setState({
        fieldsUsados,
        fields
      })
    }

    _renderLabels (kf) {
      return (
        <select
          value={this.state.filtros[kf].field}
          className='form-control'
          onChange={(e) => this.handlerGuardarLabel(e.currentTarget.value, kf)}
        >
          <option value='' />
          { this.state.fields.filter(f => !f.usado || f.value === this.state.filtros[kf].field || f.showAlways).map((f, kf) => (
            <option
              key={'opt-' + kf}
              value={f.value}
            >
              { f.label }
            </option>
          ))}
        </select>
      )
    }

    _renderCriterioDisabled (kf) {
      return (
        <select
          value={this.state.filtros[kf].criterio}
          className='form-control'
          disabled
        />
      )
    }

    _renderCriterio (field, kf) {
      if (this.props.multiFilter[field].criteria) {
        return (
          <select
            value={this.state.filtros[kf].criterio}
            className='form-control'
            onChange={(e) => this.handlerGuardarCriterio(e.currentTarget.value, kf)}
          >
            <option value='' />
            {this.props.multiFilter[field].criteria.map((cr, kcr) => (
              <option
                key={'opt-' + kcr}
                value={cr.v}
              >
                { cr.l }
              </option>
            ))}
          </select>
        )
      } else {
        return this._renderCriterioDisabled(kf)
      }
    }

    _renderCampoDisabled (kf) {
      return (
        <input
          className='form-control'
          value={this.state.filtros[kf].valor}
          disabled
        />
      )
    }

    _renderCampo (field, kf) {
      if (this.props.multiFilter[field].type === 'date') {
        return (
          <FieldDate
            styleFormGroup={{marginBottom: 0}}
            styleInputGroup={{height: '2.22rem'}}
            type='text'
            formato='DD/MM/YYYY'
            input={{value: this.state.filtros[kf].valor}}
            onSelected={value => this.handlerGuardarValue(value, kf)}
          />
        )
      } else if (this.props.multiFilter[field].type === 'datetime') {
        return (
          <FieldDateTime
            styleFormGroup={{marginBottom: 0}}
            styleInputGroup={{height: '2.22rem'}}
            type='text'
            formato='DD/MM/YYYY'
            input={{value: this.state.filtros[kf].valor}}
            onSelected={value => this.handlerGuardarValue(value, kf)}
          />
        )
      } else if (Array.isArray(this.props.multiFilter[field].type)) {
        return (
          <select
            className='form-control'
            value={this.state.filtros[kf].valor}
            onChange={e => this.handlerGuardarValue(e.currentTarget.value, kf)}
          >
            <option value='' />
            { this.props.multiFilter[field].type.map((opt, kOpt) => {
              return (
                <option key={'opt-' + kOpt} value={opt.value || opt}>{ opt.label || opt }</option>
              )
            })}
          </select>
        )
      } else if (this.props.multiFilter[field].type === 'text' || this.props.multiFilter[field].type === 'number') {
        return (
          <input
            type={this.props.multiFilter[field].type}
            className='form-control'
            value={this.state.filtros[kf].valor}
            onChange={e => this.handlerGuardarValue(e.currentTarget.value, kf)}
          />
        )
      } else {
        return this._renderCampoDisabled(kf)
      }
    }

    _renderFiltro (f, kf) {
      return (
        <Row key={'filtro-' + kf} style={{width: '100%', margin: '0 0 5px'}}>
          <Col className='col-12' lg='3'>
            <div style={{display: 'flex'}}>
              <strong style={{padding: '0.5rem 0.75rem 0.5rem 0', flex: 'none'}}>{(kf + 1)} -</strong>
              { this._renderLabels(kf) }
            </div>
          </Col>
          <Col className='col-12' lg='2'>
            { this.state.filtros[kf].field && this.state.filtros[kf].field !== ''
              ? this._renderCriterio(this.state.filtros[kf].field, kf)
              : this._renderCriterioDisabled(kf)
            }
          </Col>
          <Col className='col-12' lg='3'>
            { this.state.filtros[kf].field && this.state.filtros[kf].field !== ''
              ? this._renderCampo(this.state.filtros[kf].field, kf)
              : this._renderCampoDisabled(kf)
            }
          </Col>
          <Col className='col-12' lg='3'>
            { kf !== 0 &&
              <OverlayTrigger
                placement='top'
                overlay={this.props._renderTooltip('Eliminar filtro')}
              >
                <Button
                  color='danger'
                  size='sm'
                  onClick={() => this.handlerEliminarFiltro(kf)}
                >
                  <Icon bootstrap='trash' />
                </Button>
              </OverlayTrigger>
            }
          </Col>
        </Row>
      )
    }

    _renderMultiFilter () {
      if (this.props.multiFilter) {
        return (
          <Card
            ref={Card => { this.Card = Card }}
            fullWidth
            size={{sm: 12}}
            icon={{bootstrap: 'diamond'}}
            title='Filtros avanzados'
            topColor='dark'
            animated
            nextTitle={
              <wrapper className='pull-right'>
                <OverlayTrigger
                  placement='top'
                  overlay={this.props._renderTooltip('Resetear')}
                >
                  <Button
                    color='dark'
                    size='sm'
                    onClick={this.handlerResetear}
                  >
                    <Icon bootstrap='refresh' />
                  </Button>
                </OverlayTrigger> &nbsp;
                <OverlayTrigger
                  placement='top'
                  overlay={this.props._renderTooltip('Sumar filtro')}
                >
                  <Button
                    color='dark'
                    size='sm'
                    onClick={this.handlerAgregarFiltro}
                  >
                    <Icon bootstrap='plus' />
                  </Button>
                </OverlayTrigger>
              </wrapper>
            }
          >
            { this.state.filtros.map(this._renderFiltro) }

            <Row style={{width: '100%', margin: '0 0 5px'}}>
              <Col className='col-12'>
                <hr />
                <Button
                  color='dark'
                  onClick={this.handlerFiltrar}
                >
                  Filtrar
                </Button>
              </Col>
            </Row>
          </Card>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderMultiFilter={this._renderMultiFilter}
          {...this.props}
        />
      )
    }
  }

  withMultiFilter.defaultProps = {
    outputDefault: {}
  }

  withMultiFilter.propTypes = {
    // withTooltip
    _renderTooltip: PropTypes.func,
    multiFilter: PropTypes.object,
    tHead: PropTypes.object,
    outputDefault: PropTypes.object,
    setActiveFilter: PropTypes.func
  }

  return withMultiFilter
}
