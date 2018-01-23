import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Vr extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <vr
        style={{
          marginRight: -1,
          width: 1,
          background: 'rgba(0, 0, 0, 0.1)',
          marginBottom: '-1rem',
          marginTop: '-1rem',
          ...this.props.style
        }}
        className={this.props.className}
      />
    )
  }
}

Vr.defaultProps = {
  style: {}
}

Vr.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
}

export default Vr
