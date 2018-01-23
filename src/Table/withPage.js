import React from 'react'
import PropTypes from 'prop-types'

import { Pagination } from 'react-bootstrap'

export default function withPage (Component) {
  class withPage extends React.Component {
    constructor (props) {
      super(props)

      let items = 0
      if (props.tBodyObject.length !== 0 && props.pagination) {
        if (props.limit) {
          items = Math.ceil((props.pagination.total / props.activeLimit))
        } else if (props.pagination.perPage && props.pagination.total) {
          items = Math.ceil((props.pagination.total / props.pagination.perPage))
        }
      }

      this.state = {
        items
      }
      this.handlerOnChange = this.handlerOnChange.bind(this)
      this._renderPage = this._renderPage.bind(this)
    }

    componentDidMount () {
      if (this.props.pagination.init) {
        this.props.setActivePage(1)
      }
      if (this.props.pagination.restart && this.props.pagination.returnRestart) {
        this.props.pagination.returnRestart()
      }
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.tBodyObject.length !== 0 && nextProps.pagination) {
        let items = 0
        if (nextProps.limit) {
          items = Math.ceil((nextProps.pagination.total / nextProps.activeLimit))
        } else if (nextProps.pagination.perPage && nextProps.pagination.total) {
          items = Math.ceil((nextProps.pagination.total / nextProps.pagination.perPage))
        }
        this.setState({
          items
        })
      }
      if (nextProps.pagination.restart && nextProps.pagination.returnRestart) {
        nextProps.setActivePage(1)
        nextProps.pagination.returnRestart()
      }
    }

    handlerOnChange (activePage) {
      if (activePage !== this.props.activePage) {
        this.props.setActivePage(activePage)
      }
    }

    _renderPage () {
      if (this.props.pagination &&
        !this.props.fetching &&
        this.props.tBodyObject.length !== 0 &&
        this.state.items !== 0
      ) {
        return (
          <nav>
            <Pagination
              {...this.props.pagination.configPagination}
              items={this.state.items}
              activePage={this.props.activePage}
              onSelect={this.handlerOnChange}
            />
          </nav>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderPage={this._renderPage}
          {...this.props}
        />
      )
    }
  }

  withPage.defaultProps = {
    pagination: {init: false},
    tBodyObject: [],
    fetching: false
  }

  withPage.propTypes = {
    pagination: PropTypes.object,
    tBodyObject: PropTypes.array,
    fetching: PropTypes.bool,
    activePage: PropTypes.number,
    activeLimit: PropTypes.number,
    setActivePage: PropTypes.func,
    limit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ])
  }

  return withPage
}
