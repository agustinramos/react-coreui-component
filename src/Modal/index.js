import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal as ModalReactstrap, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class Modal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      close: false
    }
    this._renderHeader = this._renderHeader.bind(this)
    this._renderBody = this._renderBody.bind(this)
    this._renderFooter = this._renderFooter.bind(this)
    this.close = this.close.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOpen) {
      document.body.classList.add('modal-open')
    }
  }

  _renderHeader () {
    return (
      <ModalHeader toggle={!this.props.noHeaderBtnClose && this.close}>
        { this.props.title }
      </ModalHeader>
    )
  }

  _renderBody () {
    return (
      <ModalBody>
        { this.props.titleBody && <p>{this.props.titleBody}</p> }
        { this.props.children }
      </ModalBody>
    )
  }

  _renderFooter () {
    return (
      <ModalFooter>
        { this.props.preFooter }
        { !this.props.noFooterBtnClose &&
          <Button
            disabled={this.props.fetching}
            onClick={this.close}
            style={{ marginRight: 5 }}
          >
            Cerrar
          </Button>
        }
        { this.props.footer }
      </ModalFooter>
    )
  }

  close () {
    if (this.props.animation.out) {
      this.setState({
        close: true
      }, () => {
        setTimeout(() => {
          this.props.close()
          this.setState({
            close: false
          })
        }, 300)
      })
    } else {
      this.props.close()
    }
  }

  render () {
    return (
      <ModalReactstrap
        isOpen={this.props.isOpen}
        backdrop='static'
        size={this.props.size}
        className={
          (this.props.color ? 'modal-' + this.props.color : '') +
          (this.props.animation.in && !this.state.close ? ' animated ' + this.props.animation.in : ' ') +
          (this.props.animation.out && this.state.close ? ' animated ' + this.props.animation.out : ' ')
        }
      >
        { this.props.title && this._renderHeader() }
        { this._renderBody() }
        { !this.props.noFooter && this._renderFooter() }
      </ModalReactstrap>
    )
  }
}

Modal.defaultProps = {
  isOpen: false,
  noHeaderBtnClose: false,
  noFooterBtnClose: false,
  noFooter: false,
  size: 'md',
  animation: {}
}

Modal.propTypes = {
  size: PropTypes.string,
  title: PropTypes.string,
  titleBody: PropTypes.string,
  color: PropTypes.string,
  isOpen: PropTypes.bool,
  noHeaderBtnClose: PropTypes.bool,
  noFooterBtnClose: PropTypes.bool,
  noFooter: PropTypes.bool,
  fetching: PropTypes.bool,
  close: PropTypes.func.isRequired,
  children: PropTypes.any,
  footer: PropTypes.any,
  preFooter: PropTypes.any,
  animation: PropTypes.object
}

export default Modal
