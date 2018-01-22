import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'

class Aside extends Component {
  constructor (props) {
    super(props)

    this.state = { activeTab: 0 }
    this.toggle = this.toggle.bind(this)
    this._renderNavItems = this._renderNavItems.bind(this)
    this._renderTabPanels = this._renderTabPanels.bind(this)
  }

  toggle (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  _renderNavItems (item, key) {
    return (
      <NavItem key={key}>
        <NavLink className={classnames({ active: this.state.activeTab === key })} onClick={() => { this.toggle(key) }}>
          { item.icon &&
            <i className={item.icon} />
          }
          { item.text &&
            <i>{item.text}</i>
          }
        </NavLink>
      </NavItem>
    )
  }

  _renderTabPanels (tab, key) {
    return (
      <TabPane
        key={key}
        className={tab.props.className}
        tabId={key}
      >
        {tab}
      </TabPane>
    )
  }

  render () {
    return (
      <aside className='aside-menu'>
        <Nav tabs>
          { this.props.NavItems.map(this._renderNavItems) }
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          { this.props.TabPanels.map(this._renderTabPanels) }
        </TabContent>
      </aside>
    )
  }
}

Aside.defaultProps = {
  NavItems: [],
  TabPanels: []
}

Aside.propTypes = {
  NavItems: PropTypes.array,
  TabPanels: PropTypes.array
}

export default Aside
