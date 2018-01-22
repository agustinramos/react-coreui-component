import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {Motion, spring} from 'react-motion'

// Constants
const SPRING_CONFIG = [400, 28]

// Utility functions
function toRadians (degrees) {
  return degrees * 0.0174533
}

class IconMotionMenu extends Component {
  constructor (props) {
    super(props)

    let button = React.cloneElement(props.button, {
      ref: (iconMotionMenuBtn) => { this.iconMotionMenuBtn = iconMotionMenuBtn },
      onClick: (e) => this.toggleMenu(e)
    })

    let childrens = []
    if (Array.isArray(props.children)) {
      childrens = props.children
    } else {
      childrens.push(props.children)
    }
    childrens = childrens.filter(c => c)
    let children = childrens
      .map((v, k) => {
        v = React.cloneElement(v, {
          onClick: () => {}
        })
        return v
      })
    this.state = {
      isOpen: false,
      button,
      childButtons: [],
      children,
      baseAngle: '',
      childPosition: {x: 15, y: 15},
      childrens
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.animateChildButtonsWithDelay = this.animateChildButtonsWithDelay.bind(this)
    this.initialChildButtonStyles = this.initialChildButtonStyles.bind(this)
    this.finalChildButtonStyles = this.finalChildButtonStyles.bind(this)
    this.finalChildDeltaPositions = this.finalChildDeltaPositions.bind(this)
    this.renderChildButton = this.renderChildButton.bind(this)
  }

  componentDidMount () {
    let childButtons = []
    this.state.children.map((button, index) => {
      childButtons.push(this.renderChildButton(index))
      return button
    })
    let element = ReactDOM.findDOMNode(this.iconMotionMenuBtn)
    let FAN_ANGLE = (this.props.initAngle
      ? this.props.initAngle
      : (childButtons.length - 1) * this.props.separationAngle
    )
    if (element) {
      element.style.position = 'relative'
      element.style.zIndex = 1
    }
    this.setState({
      childButtons,
      baseAngle: ((180 - FAN_ANGLE) / 2),
      childPosition: {x: (element && element.offsetWidth / 2), y: 15}
    })
  }

  initialChildButtonStyles () {
    return {
      width: this.props.childButtonDiam,
      height: this.props.childButtonDiam,
      top: spring(this.state.childPosition.y - (this.props.childButtonDiam / 2), SPRING_CONFIG),
      left: spring(this.state.childPosition.x - (this.props.childButtonDiam / 2), SPRING_CONFIG),
      rotate: spring(-180, SPRING_CONFIG),
      scale: spring(0.5, SPRING_CONFIG),
      zIndex: 0
    }
  }

  finalChildButtonStyles (childIndex) {
    let {deltaX, deltaY} = this.finalChildDeltaPositions(childIndex)
    return {
      width: this.props.childButtonDiam,
      height: this.props.childButtonDiam,
      top: spring(this.state.childPosition.y - deltaY, SPRING_CONFIG),
      left: spring(this.state.childPosition.x + deltaX, SPRING_CONFIG),
      rotate: spring(0, SPRING_CONFIG),
      scale: spring(1, SPRING_CONFIG),
      zIndex: (this.props.backlock ? 1042 : 0)
    }
  }

  finalChildDeltaPositions (index) {
    let angle = this.state.baseAngle + (index * this.props.separationAngle)
    let delta = (Math.cos(toRadians(angle)) < 0 ? Math.cos(toRadians(angle)) * -1 : Math.cos(toRadians(angle)) * -1)
    return {
      deltaX: this.props.flyOutRadius * delta - (this.props.childButtonDiam / 2),
      deltaY: this.props.flyOutRadius * Math.sin(toRadians(angle)) + (this.props.childButtonDiam / 2)
    }
  }

  toggleMenu (e) {
    e.stopPropagation()
    this.setState({
      isOpen: !this.state.isOpen
    }, () => {
      let element = ReactDOM.findDOMNode(this.iconMotionMenuBtn)
      if (this.state.isOpen && this.props.backlock) {
        element.style.zIndex = 1043
      } else {
        element.style.zIndex = 1
      }
      this.state.isOpen ? document.body.classList.add('modal-open') : document.body.classList.remove('modal-open')
    })
    this.animateChildButtonsWithDelay()
  }

  closeMenu () {
    this.setState({
      isOpen: false
    }, () => {
      document.body.classList.remove('modal-open')
      let element = ReactDOM.findDOMNode(this.iconMotionMenuBtn)
      element.style.zIndex = 1
    })
    this.animateChildButtonsWithDelay()
  }

  animateChildButtonsWithDelay () {
    this.state.childButtons.map((button, index) => {
      let {childButtons} = this.state
      setTimeout(() => {
        if (this.props.animate.direccion === 'right') {
          let key = this.state.childButtons.length - index - 1
          childButtons[key] = this.renderChildButton(key)
        } else {
          childButtons[index] = this.renderChildButton(index)
        }
      }, index *
        (this.props.animate.velocidad
          ? this.props.animate.velocidad
          : IconMotionMenu.defaultProps.animate.velocidad)
      )
      return button
    })
  }

  renderChildButton (index) {
    let style = this.state.isOpen ? this.finalChildButtonStyles(index) : this.initialChildButtonStyles()
    return (
      <Motion style={style} key={index}>
        {({width, height, top, left, rotate, scale, zIndex}) =>
          <div
            className='IconMotionMenu child-button'
            style={{
              width,
              height,
              top,
              left,
              transform: `rotate(${rotate}deg) scale(${scale})`,
              zIndex
            }}
            onClick={() => { this.state.childrens[index].props.onClick(); this.closeMenu() }}
          >
            { this.state.children[index] }
          </div>
        }
      </Motion>
    )
  }

  render () {
    let {isOpen, button, childButtons} = this.state
    let mainButtonRotation = isOpen ? {rotate: spring(0, [500, 30])} : {rotate: spring(-135, [500, 30])}
    if (this.state.children.length !== 0) {
      return (
        <Motion style={mainButtonRotation}>
          {({rotate}) =>
            <wrapper
              style={{
                position: 'relative',
                display: 'inline-block'
              }}
            >
              { this.props.backlock &&
                <div
                  onClick={() => this.closeMenu()}
                  style={{
                    visibility: (this.state.isOpen ? 'visible' : 'hidden'),
                    transition: (!this.state.isOpen ? 'visibility 0s linear 0.5s,opacity 0.5s linear' : '')
                  }}
                  className={
                    'modal-backdrop fade ' +
                    (this.state.isOpen ? 'show' : '')
                  }
                />
              }
              <wrapper
                style={{
                  zIndex: (
                    this.props.rotateButton
                      ? (this.props.backlock && this.state.isOpen
                        ? 1043
                        : 1)
                      : 'initial'
                  ),
                  position: (this.props.rotateButton ? 'absolute' : 'initial'),
                  transform: (this.props.rotateButton ? `rotate(${rotate}deg)` : '')
                }}
              >
                { button }
              </wrapper>
              { childButtons.map(button => button) }
            </wrapper>
          }
        </Motion>
      )
    } else {
      return null
    }
  }
}

IconMotionMenu.defaultProps = {
  animate: {
    direccion: 'left',
    velocidad: 60
  },
  childButtonDiam: 30,
  separationAngle: 40,
  flyOutRadius: 60,
  backlock: true
}

IconMotionMenu.propTypes = {
  animate: PropTypes.object,
  children: PropTypes.any,
  button: PropTypes.any,
  rotateButton: PropTypes.bool,
  childButtonDiam: PropTypes.number,
  separationAngle: PropTypes.number,
  flyOutRadius: PropTypes.number,
  initAngle: PropTypes.number,
  backlock: PropTypes.bool
}

export default IconMotionMenu
