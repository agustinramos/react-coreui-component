import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Icon extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    if (this.props.custom) {
      return (
        <img
          style={this.props.style}
          src={this.props.custom}
          className={this.props.className}
          alt=''
          onClick={this.props.onClick}
        />
      )
    } else {
      return (
        <i
          style={this.props.style}
          className={
            (this.props.bootstrap ? 'icon-' + this.props.bootstrap + ' ' : ' ') +
            (this.props.awesome ? 'fa fa-' + this.props.awesome + ' ' : ' ') +
            (this.props.className ? this.props.className : '')
          }
          onClick={this.props.onClick}
        />
      )
    }
  }
}

Icon.defaultProps = {
  onClick: () => {}
}

Icon.propTypes = {
  bootstrap: PropTypes.string,
  awesome: PropTypes.string,
  custom: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func
}

export default Icon
