import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-s-alert'

// mandatory
// import 'react-s-alert/dist/s-alert-default.css'

// optional - you can choose the effect you want
// import 'react-s-alert/dist/s-alert-css-effects/slide.css'
// import 'react-s-alert/dist/s-alert-css-effects/scale.css'
// import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css'
// import 'react-s-alert/dist/s-alert-css-effects/flip.css'
// import 'react-s-alert/dist/s-alert-css-effects/genie.css'
// import 'react-s-alert/dist/s-alert-css-effects/jelly.css'
// import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'

class AlertNotification extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div>
        <span>
          { this.props.children }
        </span>
        <Alert {...this.props} />
      </div>
    )
  }
}

AlertNotification.defaultProps = {
}

AlertNotification.propTypes = {
  children: PropTypes.any
}

export default AlertNotification
