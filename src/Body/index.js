import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Body extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className='app-body'>
        { this.props.Sidebar }
        <main className={'main' + (!this.props.sidebarToggle ? ' ml-0' : '')}>
          { this.props.Breadcrumb }
          <div className='container-fluid'>
            { this.props.children }
          </div>
        </main>
        { this.props.Aside }
      </div>
    )
  }
}

Body.defaultProps = {
  sidebarToggle: true
}

Body.propTypes = {
  children: PropTypes.any,
  Sidebar: PropTypes.any,
  Breadcrumb: PropTypes.any,
  Aside: PropTypes.any,
  sidebarToggle: PropTypes.bool
}

export default Body
