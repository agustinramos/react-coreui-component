import React from 'react'

import { Tooltip } from 'react-bootstrap'

export default function withTooltip (Component) {
  class withTooltip extends React.Component {
    _renderTooltip (text) {
      return (
        <Tooltip id='tooltip'>
          <strong>{text}</strong>
        </Tooltip>
      )
    }

    render () {
      return (
        <Component
          _renderTooltip={this._renderTooltip}
          {...this.props}
        />
      )
    }
  }

  return withTooltip
}
