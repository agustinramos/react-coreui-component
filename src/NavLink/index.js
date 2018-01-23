import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { NavLink as NavLinkReactstrap } from 'reactstrap'

class NavLink extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <NavLinkReactstrap
        className={
          (this.props.tab !== undefined && this.props.tab === this.props.active ? 'active' : '') +
          (this.props.required ? ' text-danger' : '')
        }
        disabled={this.props.disabled}
        onClick={() => this.props.onClick(this.props.tab)}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onMouseOut={this.props.onMouseOut}
        onMouseOver={this.props.onMouseOver}
      >
        { this.props.children }
        { this.props.required &&
          <span className='text-danger'>&nbsp;!</span>
        }
      </NavLinkReactstrap>
    )
  }
}

NavLink.defaultProps = {
  onClick: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onMouseOut: () => {},
  onMouseOver: () => {}
}

NavLink.propTypes = {
  children: PropTypes.any,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  tab: PropTypes.string,
  active: PropTypes.string,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func
}

export default NavLink
