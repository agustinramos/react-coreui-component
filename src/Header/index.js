import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap'
import { Link } from 'react-router-dom'
import Icon from '../Icon'

class Header extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.toggleNot = this.toggleNot.bind(this)
    this._renderMenuLeft = this._renderMenuLeft.bind(this)
    this._renderMenuRight = this._renderMenuRight.bind(this)
    this.state = { dropdownOpen: false, dropdownOpenNot: false }
  }

  toggle () {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  toggleNot () {
    this.setState({ dropdownOpenNot: !this.state.dropdownOpenNot })
  }

  sidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-hidden')
  }

  mobileSidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-mobile-show')
  }

  asideToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('aside-menu-hidden')
  }

  activeRoute (routeName) {
    return window.location.pathname.indexOf(routeName) > -1 ? 'active' : ''
  }

  _renderMenuLeft (menu, key) {
    if (!menu.to) {
      alert('falta la key "to"') // eslint-disable-line
      return
    }
    return (
      <li key={key} className='nav-item px-1'>
        { menu.text &&
          <Link to={menu.to} className={'nav-link ' + this.activeRoute(menu.to)}>{menu.text}</Link>
        }
        { menu.icon &&
          <Link to={menu.to} className={'nav-link ' + this.activeRoute(menu.to)}>
            <Icon {...menu.icon} />
          </Link>
        }
      </li>
    )
  }

  _renderMenuRight (menu, key) {
    if (!menu.to) {
      alert('falta la key "to"') // eslint-disable-line
      return
    }
    return (
      <li key={key} className='nav-item hidden-md-down'>
        { menu.text &&
          <Link to={menu.to} className={'nav-link ' + this.activeRoute(menu.to)}>{menu.text}</Link>
        }
        { menu.icon &&
          <Link to={menu.to} className={'nav-link ' + this.activeRoute(menu.to)}>
            <Icon {...menu.icon} />
          </Link>
        }
      </li>
    )
  }

  _renderMenuUser (menu, key) {
    if (menu.divider) {
      return (
        <DropdownItem key={key} divider />
      )
    }
    if (menu.header) {
      return (
        <DropdownItem key={key} header
          className='text-center'
        >
          <strong>{menu.name}</strong>
        </DropdownItem>
      )
    }
    return (
      <Link key={key}
        to={menu.to}
        onClick={(menu.onClick) ? () => menu.onClick() : () => {}}
        className='nav-link'
      >
        <DropdownItem>
          { menu.icon &&
            <Icon {...menu.icon} />
          }
          {menu.name}
          { menu.notificacion &&
            <span className={
              'badge ' + (menu.notificacion.style ? 'badge-' + menu.notificacion.style : 'badge-info')}
            >
              {menu.notificacion.cantidad}
            </span>
          }
        </DropdownItem>
      </Link>
    )
  }

  render () {
    return (
      <header className={'app-header navbar ' + this.props.className}>
        { this.props.sidebarToggle &&
          <button className='btn navbar-toggler mobile-sidebar-toggler hidden-lg-up hidden-print'
            onClick={this.mobileSidebarToggle}
            type='button'
          >
              &#9776;
          </button>
        }
        <div className='navbar-brand'>
          { this.props.logo &&
            <img
              src={this.props.logo}
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
              alt=''
            />
          }
        </div>
        <ul className='nav navbar-nav hidden-md-down'>
          { this.props.sidebarToggle &&
            <li className='nav-item'>
              <a className='nav-link navbar-toggler sidebar-toggler'
                onClick={this.sidebarToggle}
                href='#'
              >
                &#9776;
              </a>
            </li>
          }
          { this.props.menuLeft.map(this._renderMenuLeft) }
        </ul>
        <ul className='nav navbar-nav ml-auto'>
          { this.props.notificaciones &&
            <li className='nav-item hidden-md-down' id='notificaciones'>
              <Dropdown isOpen={this.state.dropdownOpenNot} toggle={this.toggleNot}>
                <a className='nav-link'
                  onClick={this.toggleNot}
                  href='#'
                >
                  <i className='icon-bell' />
                  <span className='badge badge-pill badge-danger'>
                    { this.props.notificaciones.cantidad }
                  </span>
                </a>
                { this.props.notificaciones.component }
              </Dropdown>
            </li>
          }
          { this.props.menuRight.map(this._renderMenuRight) }
          { this.props.menuUser &&
            <li className='nav-item' style={{paddingRight: (!this.props.asideMenu ? 15 : 0)}}>
              { this.props.menuUser.dropdown &&
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <a onClick={this.toggle}
                    className={'nav-link dropdown-toggle ' + this.props.menuUser.className}
                    role='button'
                  >
                    <img
                      src={this.props.menuUser.avatar}
                      className='img-avatar'
                      alt=''
                    />
                    <span className='hidden-md-down'>{this.props.menuUser.username}</span>
                  </a>
                  <DropdownMenu className='dropdown-menu-right'>
                    { this.props.menuUser.dropdown.map(this._renderMenuUser)}
                  </DropdownMenu>
                </Dropdown>
              }
              { !this.props.menuUser.dropdown &&
                <div
                  className={'nav-link ' + this.props.menuUser.className}
                  role='button'
                >
                  <img
                    src={this.props.menuUser.avatar}
                    className='img-avatar'
                    alt=''
                  />
                  <span className='hidden-md-down'>{this.props.menuUser.username}</span>
                </div>
              }
            </li>
          }
          { this.props.asideMenu &&
            <li className='nav-item hidden-md-down'>
              <a className='nav-link navbar-toggler aside-menu-toggler'
                onClick={this.asideToggle}
                href='#'
              >
                &#9776;
              </a>
            </li>
          }
        </ul>
      </header>
    )
  }
}

Header.defaultProps = {
  asideMenu: false,
  sidebarToggle: true,
  menuLeft: [],
  menuRight: []
}

Header.propTypes = {
  asideMenu: PropTypes.bool,
  sidebarToggle: PropTypes.bool,
  notificaciones: PropTypes.object,
  menuLeft: PropTypes.array,
  menuRight: PropTypes.array,
  menuUser: PropTypes.object,
  logo: PropTypes.string,
  className: PropTypes.string
}

export default Header
