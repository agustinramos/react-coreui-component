import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from '../Icon'

class Sidebar extends Component {
  constructor (props) {
    super(props)

    this.state = {}
    this._renderSidebarMenu = this._renderSidebarMenu.bind(this)
    this._renderDropdownMenu = this._renderDropdownMenu.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e.preventDefault()
    e.target.parentElement.classList.toggle('open')
  }

  activeDropdown (routeName) {
    return window.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown'
  }

  activeRoute (menu) {
    return (window.location.pathname.indexOf(menu.to) > -1 && window.location.pathname.length === menu.to.length) ? 'active' : ''
  }

  _renderSidebarMenu (menu, key) {
    if (menu.divider) {
      return (
        <li key={key} className='divider' />
      )
    }
    if (menu.title) {
      return (
        <li key={key} className='nav-title'>
          {menu.name}
        </li>
      )
    }
    if (menu.dropdown) {
      if (!menu.to) {
        alert('falta la key "to"') // eslint-disable-line
        return
      }
      return (
        <li key={key} className={this.activeDropdown(menu.to)}>
          <a className='nav-link nav-dropdown-toggle'
            href='#'
            onClick={this.handleClick}
          >
            { menu.icon &&
              <Icon {...menu.icon} />
            }
            {menu.name}
          </a>
          <ul className='nav-dropdown-items'>
            { menu.submenus.map(this._renderSidebarMenu) }
          </ul>
        </li>
      )
    }

    if (!menu.to) {
      alert('falta la key "to"') // eslint-disable-line
      return
    }
    return (
      <li key={key} className='nav-item'>
        <Link to={menu.to} className={'nav-link ' + this.activeRoute(menu)}>
          { menu.icon &&
            <Icon {...menu.icon} />
          }
          {menu.name}
          { menu.badge &&
            <span className={'badge ' + (menu.badge.style ? 'badge-' + menu.badge.style : 'badge-info')}>
              {menu.badge.name}
            </span>
          }
        </Link>
      </li>
    )
  }

  _renderDropdownMenu (submenu, key) {
    return (
      <li className='nav-item'>
        <Link to={submenu.to} className='nav-link'>
          { submenu.icon &&
            <Icon {...submenu.icon} />
          }
          &nbsp; {submenu.name}
          { submenu.badge &&
            <span className={'badge ' + (submenu.badge.style ? 'badge-info' : 'badge-')}>{submenu.badge.name}</span>
          }
        </Link>
      </li>
    )
  }

  render () {
    return (
      <div className='sidebar'>
        <nav className='sidebar-nav'>
          <ul className='nav'>
            { this.props.sidebarMenu.map(this._renderSidebarMenu) }
          </ul>
        </nav>
      </div>
    )
  }
}

Sidebar.defaultProps = {
  sidebarMenu: []
}

Sidebar.propTypes = {
  sidebarMenu: PropTypes.array
}

export default Sidebar
