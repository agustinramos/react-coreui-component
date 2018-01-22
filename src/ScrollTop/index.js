import React, { Component } from 'react'
import ScrollToTop from 'react-scroll-up'
import Icon from '../Icon'

class ScrollTop extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <ScrollToTop
        {...this.props}
        style={{
          position: 'fixed',
          bottom: 50,
          right: 30,
          cursor: 'pointer',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'linear',
          transitionDelay: '0s',
          zIndex: 1
        }}
      >
        <Icon
          style={{
            fontSize: 33,
            background: '#20a8d8',
            color: 'white',
            padding: '4px 6px',
            borderRadius: 7
          }}
          className='hidden-print'
          bootstrap='arrow-up-circle' />
      </ScrollToTop>
    )
  }
}

ScrollTop.defaultProps = {
}

ScrollTop.propTypes = {
}

export default ScrollTop
