import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TabPane as TabPaneReacstrap } from 'reactstrap'

class TabPane extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      tabIsShow: (props.tabId === context.activeTabId || context.form)
    }
  }

  componentWillReceiveProps (nextProps, nextConstext) {
    if (!this.state.tabIsShow && nextProps.tabId === nextConstext.activeTabId) {
      this.setState({
        tabIsShow: true
      })
    }
  }

  render () {
    if (this.state.tabIsShow) {
      return (
        <TabPaneReacstrap tabId={this.props.tabId}>
          { this.props.children }
        </TabPaneReacstrap>
      )
    }
    return null
  }
}

TabPane.contextTypes = {
  activeTabId: PropTypes.any,
  form: PropTypes.bool
}

TabPane.defaultProps = {
}

TabPane.propTypes = {
  children: PropTypes.any,
  tabId: PropTypes.string,
  form: PropTypes.bool
}

export default TabPane
