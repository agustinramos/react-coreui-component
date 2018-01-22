import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TabContent extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  getChildContext () {
    return {
      activeTabId: this.props.activeTab,
      form: this.props.form
    }
  }

  render () {
    return (
      <div className={'tab-content ' + this.props.className}>
        { this.props.children }
      </div>
    )
  }
}

TabContent.childContextTypes = {
  activeTabId: PropTypes.any,
  form: PropTypes.bool
}

TabContent.defaultProps = {
  form: false,
  className: ''
}

TabContent.propTypes = {
  activeTab: PropTypes.any,
  children: PropTypes.any,
  className: PropTypes.string,
  form: PropTypes.bool
}

export default TabContent
