import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal as ModalReactstrap } from 'reactstrap'

const ANIMATING_START_RIGHT = 'StartRight'
const ANIMATING__END_RIGHT = 'EndRight'
const ANIMATING_START_LEFT = 'StartLeft'
const ANIMATING_END_LEFT = 'EndLeft'

class ModalMultiView extends Component {
  constructor (props) {
    super(props)

    this.state = {views: props.views, activeView: 0, animating: ''}
    this._onCloseModal = this._onCloseModal.bind(this)
    this._renderViews = this._renderViews.bind(this)
    this._modalNextView = this._modalNextView.bind(this)
    this._modalPrevView = this._modalPrevView.bind(this)
  }

  _onCloseModal () {
    this.props.onClose()
    setTimeout(() => this.setState({activeView: 0}), 1100)
  }

  _modalNextView (key) {
    if (typeof key === 'number' && !this.state.views[key]) {
      alert('la vista no existe') //  eslint-disable-line
      return
    }
    if (typeof key === 'number' && !this.props.viewsSize[key]) {
      alert('no se encuentra asignado el tamaño') //  eslint-disable-line
      return
    }
    this.setState({animating: ANIMATING_START_LEFT}, () => {
      setTimeout(() => {
        let activeView = this.state.activeView + 1
        if (typeof key === 'number') {
          activeView = key
        }
        this.setState({activeView: activeView, animating: ANIMATING__END_RIGHT})
      }, 1100)
      setTimeout(() =>
        this.setState({animating: ''}
      ), 2200)
    })
  }

  _modalPrevView (key) {
    if (typeof key === 'number' && !this.state.views[key]) {
      alert('la vista no existe') //  eslint-disable-line
      return
    }
    if (typeof key === 'number' && !this.props.viewsSize[key]) {
      alert('no se encuentra asignado el tamaño') //  eslint-disable-line
      return
    }
    this.setState({animating: ANIMATING_START_RIGHT}, () => {
      setTimeout(() => {
        let activeView = this.state.activeView - 1
        if (typeof key === 'number') {
          activeView = key
        }
        this.setState({activeView: activeView, animating: ANIMATING_END_LEFT})
      }, 1100)
      setTimeout(() =>
        this.setState({animating: ''}
      ), 2200)
    })
  }

  _renderViews (view, key) {
    return (
      <wrapper key={key}>
        {
          this.state.activeView === key &&
          view(this._modalNextView, this._modalPrevView, this.state.animating !== '', this._onCloseModal)
        }
      </wrapper>
    )
  }

  render () {
    return (
      <ModalReactstrap
        backdrop='static'
        dialogClassName={
          'modal-' + this.props.viewsSize[this.state.activeView] +
          ' ' + (this.state.animating === ANIMATING_START_LEFT
            ? 'modal-ModalMultiView' + ANIMATING_START_LEFT + '-' + this.props.viewsSize[this.state.activeView]
            : this.state.animating === ANIMATING__END_RIGHT
            ? 'modal-ModalMultiView' + ANIMATING__END_RIGHT + '-' + this.props.viewsSize[this.state.activeView]
            : this.state.animating === ANIMATING_START_RIGHT
            ? 'modal-ModalMultiView' + ANIMATING_START_RIGHT + '-' + this.props.viewsSize[this.state.activeView]
            : this.state.animating === ANIMATING_END_LEFT
            ? 'modal-ModalMultiView' + ANIMATING_END_LEFT + '-' + this.props.viewsSize[this.state.activeView]
            : null)
        }
        show={this.props.showModal}
        onHide={this._onCloseModal}
      >
        { this.state.views.map(this._renderViews) }
      </ModalReactstrap>
    )
  }
}

ModalMultiView.defaultProps = {
  views: [],
  viewsSize: [],
  showModal: false
}

ModalMultiView.propTypes = {
  views: PropTypes.array.isRequired,
  viewsSize: PropTypes.array.isRequired,
  showModal: PropTypes.bool,
  onClose: PropTypes.func
}

export default ModalMultiView
