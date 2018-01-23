import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

class FormCustomErrors extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    document.getElementById('customError').scrollIntoView()
  }

  render () {
    return (
      <wrapper
        id='customError'
        className='mt-3 animated fadeInUp'
        style={{display: 'block'}}
      >
        <hr />
        <Alert
          color={this.props.color}
        >
          { this.props.title }
        </Alert>
      </wrapper>
    )
  }
}

FormCustomErrors.defaultProps = {
  color: 'danger'
}

FormCustomErrors.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string
}

export default FormCustomErrors
