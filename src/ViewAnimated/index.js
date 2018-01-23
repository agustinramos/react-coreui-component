import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ViewAnimated extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    setTimeout(() => {
      document.body.classList.remove('modal-open')
      if (this.viewAnimated) {
        this.viewAnimated.classList.remove('animated')
      }
    }, 500)
  }

  render () {
    return (
      <div
        ref={(viewAnimated) => { this.viewAnimated = viewAnimated }}
        className={'animated fadeIn ' + this.props.className}
      >
        { this.props.children }
      </div>
    )
  }
}

ViewAnimated.defaultProps = {
}

ViewAnimated.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
}

export default ViewAnimated
