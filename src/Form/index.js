import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <form
        noValidate
        onSubmit={this.props.onSubmit}
        className={this.props.className}
        ref={(e) => this.props.refs(e)}
        style={{width: '100%'}}
      >
        { !this.props.disabled && <button type='sumbit' style={{display: 'none'}} /> }
        { this.props.children }
      </form>
    )
  }
}

Form.defaultProps = {
  refs: () => {}
}

Form.propTypes = {
  children: PropTypes.any,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  refs: PropTypes.func,
  disabled: PropTypes.bool
}

export default Form
