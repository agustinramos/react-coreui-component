import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Breadcrumb extends Component {
  constructor (props) {
    super(props)

    this._renderRoutes = this._renderRoutes.bind(this)
    this.state = {}
  }

  getRoutes () {
    let routes = window.location.pathname.split('/').filter((r, i) => { return r !== '' })
    return routes
  }

  _renderRoutes (route, key, last) {
    if (route === this.props.initialRoute.to) {
      return
    }
    if (key === last) {
      if (this.props.normalizeRoutes[route]) {
        return (
          <span key={key} className='breadcrumb-item'>{ this.props.normalizeRoutes[route].name }</span>
        )
      } else {
        return (
          <span key={key} className='breadcrumb-item'>{ route }</span>
        )
      }
    }
    if (this.props.normalizeRoutesDropdown[route]) {
      return (
        <span key={key} className='breadcrumb-item'>
          { this.props.normalizeRoutesDropdown[route].to
            ? <Link to={this.props.normalizeRoutesDropdown[route].to}>
              { this.props.normalizeRoutesDropdown[route].name }
            </Link>
            : this.props.normalizeRoutesDropdown[route].name
              ? this.props.normalizeRoutesDropdown[route].name
              : route
          }
        </span>
      )
    } else {
      return (
        <span key={key} className='breadcrumb-item'>
          { route }
        </span>
      )
    }
  }

  render () {
    return (
      <ol className='breadcrumb'>
        { this.props.initialRoute &&
          <span className='breadcrumb-item'>
            <Link to={'/' + this.props.initialRoute.to}>
              { this.props.initialRoute.name }
            </Link>
          </span>
        }
        { this.getRoutes().map((v, i) => this._renderRoutes(v, i, (this.getRoutes().length - 1))) }
      </ol>
    )
  }
}

Breadcrumb.defaultProps = {
  initialRoute: {to: 'inicio', name: 'Inicio'},
  normalizeRoutes: {},
  normalizeRoutesDropdown: {}
}

Breadcrumb.propTypes = {
  initialRoute: PropTypes.object,
  normalizeRoutes: PropTypes.object,
  normalizeRoutesDropdown: PropTypes.object
}

export default Breadcrumb
