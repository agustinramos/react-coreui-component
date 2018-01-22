import React from 'react'
import PropTypes from 'prop-types'

export default function withPageDetail (Component) {
  class withPageDetail extends React.Component {
    constructor (props) {
      super(props)

      this.state = {}
      this._renderPageDetail = this._renderPageDetail.bind(this)
    }

    _renderPageDetail () {
      if (this.props.pagination &&
        this.props.pagination.detalle &&
        !this.props.fetching &&
        this.props.tBodyObject.length !== 0 &&
        (this.props.limit || this.props.pagination.perPage)
      ) {
        return (
          <p className='text-right mt-q mb-h'>
            {'Mostrando del ' + (this.props.activePage * this.props.activeLimit - this.props.activeLimit + 1) + ' al ' +
            (((this.props.activePage * this.props.activeLimit) < this.props.pagination.total) ? (this.props.activePage * this.props.activeLimit) : this.props.pagination.total) +
            ' de ' + this.props.pagination.total + ' registros'}
          </p>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderPageDetail={this._renderPageDetail}
          {...this.props}
        />
      )
    }
  }

  withPageDetail.defaultProps = {}

  withPageDetail.propTypes = {
    pagination: PropTypes.object,
    activePage: PropTypes.number,
    activeLimit: PropTypes.number,
    fetching: PropTypes.bool,
    tBodyObject: PropTypes.array,
    limit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ])
  }

  return withPageDetail
}
