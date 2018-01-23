import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Footer extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <footer
        className={
          'app-footer ' +
          (!this.props.sidebarToggle ? 'ml-0 ' : ' ') +
          this.props.className
        }
      >
        { this.props.contentCenter &&
          <div className='text-center'>
            { this.props.contentCenter }
          </div>
        }
        { !this.props.contentCenter &&
          <wrapper>
            { this.props.contentLeft }
            <span className='float-right'>
              { this.props.contentRight }
            </span>
          </wrapper>
        }
      </footer>
    )
  }
}

Footer.defaultProps = {
  sidebarToggle: true
}

Footer.propTypes = {
  contentCenter: PropTypes.any,
  contentLeft: PropTypes.any,
  contentRight: PropTypes.any,
  sidebarToggle: PropTypes.bool,
  className: PropTypes.string
}

export default Footer
