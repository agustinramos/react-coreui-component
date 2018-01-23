import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Navbar, Button } from 'reactstrap'

class MenuTopMotion extends Component {
  constructor (props) {
    super(props)

    this.state = {
      buttons: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOpen === true) {
      document.body.classList.add('modal-open')

      let buttons = []
      if (nextProps.buttons && Array.isArray(nextProps.buttons.props.children)) {
        nextProps.buttons.props.children.map((b, bk) => {
          if (b) {
            b = React.cloneElement(b, {
              key: 'button-' + bk,
              style: {flex: 1}
            })
            buttons.push(b)
          }
          return b
        })
      } else {
        let btn = React.cloneElement(nextProps.buttons, {
          key: 'button',
          style: {flex: 1}
        })
        buttons.push(btn)
      }
      buttons.push(
        <Button
          style={{flex: 1}}
          key='close'
          size='md'
          onClick={() => this.props.closeMenu(false)}
          name='close'
        >
          Cerrar
        </Button>
      )

      this.setState({
        buttons
      })
    } else {
      document.body.classList.remove('modal-open')
    }
  }

  render () {
    return (
      <wrapper
        className='MenuTopMotion'
        style={{
          visibility: (this.props.isOpen ? 'visible' : 'hidden'),
          transition: (!this.props.isOpen ? 'visibility 0s linear 1s,opacity 1s linear' : '')
        }}
      >
        { this.props.backlock &&
          <div
            onClick={() => this.props.closeMenu(false)}
            style={{
              visibility: (this.props.isOpen ? 'visible' : 'hidden'),
              transition: (!this.props.isOpen ? 'visibility 0s linear 0.5s,opacity 0.5s linear' : '')
            }}
            className={
              'modal-backdrop fade ' +
              (this.props.isOpen ? 'show' : '')
            }
          />
        }
        <Navbar color={this.props.backgroundColor}
          toggleable
          className={
            'animated-3 ' +
            (this.props.isOpen ? this.props.animation.open : this.props.animation.close)
          }
        >
          { this.props.children }
          <wrapper
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              flexWrap: 'wrap'
            }}
          >
            { this.state.buttons }
          </wrapper>
        </Navbar>
      </wrapper>
    )
  }
}

MenuTopMotion.defaultProps = {
  backlock: true,
  backgroundColor: 'faded',
  animation: {open: 'slideInDown', close: 'slideOutUp'}
}

MenuTopMotion.propTypes = {
  backgroundColor: PropTypes.string,
  backlock: PropTypes.bool,
  animation: PropTypes.object,
  isOpen: PropTypes.bool,
  closeMenu: PropTypes.func,
  children: PropTypes.any,
  buttons: PropTypes.any
}

export default MenuTopMotion
