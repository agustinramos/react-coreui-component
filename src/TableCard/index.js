import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { merge } from 'ramda'
import { Row, Col, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonGroup } from 'reactstrap'
import Icon from '../Icon'

class TableCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      rows: [],
      datalist: [],
      dropdownOpen: {},
      collapseOpen: {},
      cardView: {active: 1, size: 3},
      menu: []
    }
    this.toggleCollapse = this.toggleCollapse.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.handlerChangeCardView = this.handlerChangeCardView.bind(this)
    this.calculoRows = this.calculoRows.bind(this)
    this._renderDropdownItems = this._renderDropdownItems.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._renderCard = this._renderCard.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.datalist.length !== 0 && nextProps.datalist.length !== this.state.datalist.length) {
      let menu = []
      let countMenuEnabled = 0
      nextProps.datalist.map((value, key) => {
        if (nextProps.menu && nextProps.menu.length !== 0) {
          nextProps.menu.map((m1, k1) => {
            if (typeof m1 === 'function') {
              m1 = m1(value)
              if (Array.isArray(m1)) {
                m1.map((m2, k2) => {
                  if (m2.enabled ||
                    m2.enabled(value)
                  ) {
                    menu.push(m2)
                  }

                  if ((m2.enabled ||
                    m2.enabled(value)) &&
                    !m2.header) {
                    countMenuEnabled++
                  }

                  return m2
                })
              } else {
                if (m1.enabled ||
                  m1.enabled(value)
                ) {
                  menu.push(m1)
                }

                if ((m1.enabled ||
                  m1.enabled(value)) &&
                  !m1.header) {
                  countMenuEnabled++
                }
              }
            } else {
              if (m1.enabled ||
                m1.enabled(value)) {
                menu.push(m1)
              }
              if ((m1.enabled ||
                m1.enabled(value)) &&
                !m1.header) {
                countMenuEnabled++
              }
            }
            return m1
          })
        }
        return value
      })

      if (!countMenuEnabled) {
        menu = []
      }
      this.setState({
        menu
      }, () => {
        this.calculoRows(nextProps.datalist)
      })
    }
    if (nextProps.fetching && this.state.datalist.length !== 0) {
      this.setState({
        rows: [],
        datalist: []
      })
    }
  }

  toggleCollapse (key) {
    this.setState({
      collapseOpen: merge(this.state.collapseOpen, {[key]: !this.state.collapseOpen[key]})
    })
  }

  toggleDropdown (key) {
    this.setState({
      dropdownOpen: merge(this.state.dropdownOpen, {[key]: !this.state.dropdownOpen[key]})
    })
  }

  handlerChangeCardView (cardView) {
    this.setState({cardView}, () => { this.calculoRows(this.props.datalist) })
  }

  calculoRows (data) {
    let rows = []
    let datalist = []
    let perRow
    if (this.props.size) {
      perRow = 12 / parseInt(this.props.size, 10)
    } else {
      perRow = 12 / parseInt(this.state.cardView.size, 10)
    }
    let count = 0
    data.map((val, key) => {
      if (key === 0) {
        rows.push('row')
      }

      if (count === 0) {
        datalist.push([])
      }

      count++
      if (perRow >= count) {
        datalist[datalist.length - 1].push(val)
      }

      if (perRow <= count) {
        if ((data.length - 1) !== key) {
          rows.push('row')
        }
        count = 0
      }
      return val
    })
    this.setState({
      rows,
      datalist
    })
  }

  _renderDropdownItems (m, k, c) {
    if (typeof m === 'function') {
      m = m(c)
      if (Array.isArray(m)) {
        let opciones = []
        m.map((menu, key) => {
          if (menu.enabled === undefined ||
            (typeof menu.enabled === 'boolean' &&
            menu.enabled === false) ||
            (typeof menu.enabled === 'function' &&
            !menu.enabled(c))
            ) {
            return false
          }

          opciones.push(
            <DropdownItem
              key={k + '' + key}
              header={menu.header}
              divider={menu.divider}
              disabled={menu.disabled}
              style={{cursor: 'pointer'}}
              onClick={() => menu.onClick(c)}
            >
              { typeof menu.label === 'function'
                  ? menu.label(c)
                  : menu.label
                    ? menu.label
                    : 'Falta el label'
              }
            </DropdownItem>
          )
          return menu
        })
        return opciones
      }
    }
    if (m.enabled === undefined ||
      (typeof m.enabled === 'boolean' &&
      m.enabled === false) ||
      (typeof m.enabled === 'function' &&
      !m.enabled(c))
      ) {
      return false
    }
    return (
      <DropdownItem
        key={k}
        header={m.header}
        divider={m.divider}
        disabled={m.disabled}
        style={{cursor: 'pointer'}}
        onClick={() => m.onClick(c)}
      >
        { typeof m.label === 'function'
            ? m.label(c)
            : m.label
              ? m.label
              : 'Falta el label'
        }
      </DropdownItem>
    )
  }

  _renderRow (r, kr) {
    return (
      <Row key={kr}>
        { this.state.datalist[kr].map((c, kc) => this._renderCard(c, kc, kr)) }
      </Row>
    )
  }

  _renderCard (c, kc, kr) {
    return (
      <Col
        key={kr + '' + kc}
        className={'col-12'}
        // lg={this.props.size}
        style={{transition: '.3s all ease-in-out'}}
        lg={this.state.cardView.size}
      >
        <div className={
            'card ' +
            (typeof this.props.color === 'string' ? 'card-inverse card-' + this.props.color : '') +
            (typeof this.props.color === 'function' ? this.props.color(c) : '')
          }
        >
          <div className='card-block'>
            { (this.props.icon || this.state.menu.length !== 0) &&
              <div className='h1 text-muted text-right mb-2'>
                { this.state.menu.length !== 0 &&
                  <Dropdown isOpen={this.state.dropdownOpen[kr + '' + kc]} toggle={() => this.toggleDropdown(kr + '' + kc)} >
                    <DropdownToggle style={{float: 'left', fontSize: 20, cursor: 'pointer', left: -5, position: 'relative'}} tag='span'>
                      <Icon bootstrap='options-vertical' />
                    </DropdownToggle>
                    <DropdownMenu style={{top: 30}}>
                      { this.props.menu.map((m, k) => this._renderDropdownItems(m, k, c)) }
                    </DropdownMenu>
                  </Dropdown>
                }
                {this.props.icon && typeof this.props.icon === 'object' && <Icon {...this.props.icon} />}
                {this.props.icon && typeof this.props.icon === 'function' && this.props.icon(c)}
              </div>
            }
            { this.props.body && this.props.body(c)}
            { this.props.titulo &&
              typeof this.props.titulo === 'string' &&
              !this.props.body &&
              <div className='h4 mb-0'
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                { this.props.titulo }
              </div>
            }
            { this.props.titulo &&
              typeof this.props.titulo === 'function' &&
              !this.props.body &&
              <div className='h4 mb-0'
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                { this.props.titulo(c) }
              </div>
            }
            { this.props.subtitulo &&
              typeof this.props.subtitulo === 'string' &&
              !this.props.body &&
              <small className='text-muted text-uppercase font-weight-bold'>{ this.props.subtitulo }</small>
            }
            { this.props.subtitulo &&
              typeof this.props.subtitulo === 'function' &&
              !this.props.body &&
              <small className='text-muted text-uppercase font-weight-bold'>{ this.props.subtitulo(c) }</small>
            }
            { this.props.progressBar && this.props.progressBar(c) }
            { this.props.verMas &&
              this.props.verMas.enabled !== undefined &&
              ((typeof this.props.verMas.enabled === 'boolean' &&
              this.props.verMas.enabled) ||
              (typeof this.props.verMas.enabled === 'function' &&
              this.props.verMas.enabled(c))) &&
              <wrapper style={{marginTop: 7, display: 'block'}}>
                <Button
                  block
                  size='sm'
                  color={
                    (typeof this.props.verMas.btnColor === 'string' ? this.props.verMas.btnColor : '') +
                    (typeof this.props.verMas.btnColor === 'function' ? this.props.verMas.btnColor(c) : '')
                  }
                  onClick={() => this.toggleCollapse(kr + '' + kc)}
                >
                  <Icon awesome={(this.state.collapseOpen[kr + '' + kc] ? 'chevron-up' : 'chevron-down')} />
                </Button>
                <Collapse isOpen={this.state.collapseOpen[kr + '' + kc]}>
                  { this.props.verMas.body &&
                    <div className='card-block row'>
                      { this.props.verMas.body(c) }
                    </div>
                  }
                  { this.props.verMas.footer &&
                    <div className='card-footer'>
                      { this.props.verMas.footer(c) }
                    </div>
                  }
                </Collapse>
              </wrapper>
            }
          </div>
        </div>
      </Col>
    )
  }

  render () {
    return (
      <wrapper>
        { !this.props.size &&
          <ButtonGroup>
            <Button
              color='primary'
              onClick={() => this.handlerChangeCardView({active: 1, size: 3})}
              active={this.state.cardView.active === 1}
            >
              <Icon awesome='th' />
            </Button>
            <Button
              color='primary'
              onClick={() => this.handlerChangeCardView({active: 2, size: 6})}
              active={this.state.cardView.active === 2}
            >
              <Icon awesome='th-large' />
            </Button>
            <Button
              color='primary'
              onClick={() => this.handlerChangeCardView({active: 3, size: 12})}
              active={this.state.cardView.active === 3}
            >
              <Icon awesome='th-list' />
            </Button>
          </ButtonGroup>
        }
        { !this.props.size && <hr /> }
        { !this.props.fetching && this.state.rows.map(this._renderRow) }
        { !this.props.fetching && this.props.datalist.length === 0 &&
          <p><strong>{ this.props.txtSinResultados }</strong></p>
        }
        { this.props.fetching &&
          <p><strong>Cargando ...</strong></p>
        }
      </wrapper>
    )
  }
}

TableCard.defaultProps = {
  datalist: [],
  menu: []
}

TableCard.propTypes = {
  size: PropTypes.string,
  datalist: PropTypes.array,
  menu: PropTypes.array,
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  color: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  titulo: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  subtitulo: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  body: PropTypes.func,
  progressBar: PropTypes.func,
  verMas: PropTypes.object,
  txtSinResultados: PropTypes.string,
  fetching: PropTypes.bool
}

export default TableCard
