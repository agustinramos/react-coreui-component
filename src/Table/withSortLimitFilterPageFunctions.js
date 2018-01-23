import React from 'react'
import PropTypes from 'prop-types'

export default function withSortLimitFilterPageFunctions (Component) {
  class withSortLimitFilterPageFunctions extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        activeLimit: 0,
        activePage: 0,
        activeSort: [],
        activeFilter: []
      }
      this.setActiveLimit = this.setActiveLimit.bind(this)
      this.setActivePage = this.setActivePage.bind(this)
      this.setActiveSort = this.setActiveSort.bind(this)
      this.setActiveFilter = this.setActiveFilter.bind(this)
      this.returnSortLimitFilterPage = this.returnSortLimitFilterPage.bind(this)
    }

    setActiveLimit (activeLimit, init) {
      this.setState({
        activeLimit,
        activePage: 1
      }, () => !init && this.returnSortLimitFilterPage())
    }

    setActivePage (activePage, init) {
      this.setState({
        activePage
      }, () => !init && this.returnSortLimitFilterPage())
    }

    setActiveSort (activeSort, init) {
      this.setState({
        activeSort
      }, () => !init && this.returnSortLimitFilterPage())
    }

    setActiveFilter (activeFilter, init) {
      this.setState({
        activeFilter,
        activePage: 1
      }, () => !init && this.returnSortLimitFilterPage())
    }

    calculateEntries (page, perPage) {
      return page * perPage - perPage
    }

    returnSortLimitFilterPage () {
      let activeFilter = (this.state.activeFilter.length !== 0 ? this.state.activeFilter : undefined)
      let activeSort = (this.state.activeSort.length !== 0 ? this.state.activeSort : undefined)
      let activeOffset
      let activeLimit
      // chequeo si existe la propiedad limit sino utilizo la perPage de pagination
      if (this.props.limit) {
        activeOffset = this.calculateEntries(this.state.activePage, this.state.activeLimit)
        activeLimit = this.state.activeLimit
      } else if (this.props.pagination.perPage) {
        activeOffset = this.calculateEntries(this.state.activePage, this.props.pagination.perPage)
        activeLimit = this.props.pagination.perPage
      }
      this.props.returnSortPaginationAndFilter && this.props.returnSortPaginationAndFilter(
        activeFilter,
        activeSort,
        activeLimit,
        activeOffset
      )
    }

    render () {
      return (
        <Component
          activeLimit={this.state.activeLimit}
          activePage={this.state.activePage}
          activeSort={this.state.activeSort}
          activeFilter={this.state.activeFilter}
          setActiveLimit={this.setActiveLimit}
          setActivePage={this.setActivePage}
          setActiveSort={this.setActiveSort}
          setActiveFilter={this.setActiveFilter}
          {...this.props}
        />
      )
    }
  }

  withSortLimitFilterPageFunctions.defaultProps = {
  }

  withSortLimitFilterPageFunctions.propTypes = {
    returnSortPaginationAndFilter: PropTypes.func,
    pagination: PropTypes.object,
    limit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ])
  }

  return withSortLimitFilterPageFunctions
}
