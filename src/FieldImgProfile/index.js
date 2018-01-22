import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { merge } from 'ramda'
import { Button } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Icon from '../Icon'

class FieldFileUpload extends Component {
  constructor (props) {
    super(props)

    let file = false
    let restore = false
    if (props.input) {
      file = props.input.value
      restore = props.input.value
    }

    this.state = {
      file,
      restore,
      btnRestore: false
    }
    this.onDrop = this.onDrop.bind(this)
    this.deleteIMG = this.deleteIMG.bind(this)
    this.restoreIMG = this.restoreIMG.bind(this)
  }

  onDrop (file, reject) {
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader() // eslint-disable-line
      reader.readAsDataURL(file[0])
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result)
        } else {
          reject(Error('Failed converting to base64'))
        }
      }
    })
    promise.then(result => {
      this.setState({
        file: {
          fileName: file[0].name,
          fileSize: file[0].size,
          fileType: file[0].type,
          preview: file[0].preview,
          base64: result.split(',')[1]
        },
        btnRestore: true
      }, () => {
        this.props.input && this.props.input.onChange(merge(this.state.file, {preview: undefined}))
      })
    }, err => {
      console.log(err)
    })
  }

  deleteIMG (e) {
    e.stopPropagation()
    if (this.state.file.preview) {
      window.URL.revokeObjectURL(this.state.file.preview)
    }
    this.setState({
      file: false,
      btnRestore: true
    }, () => {
      this.props.input && this.props.input.onChange('')
      this.props.input && this.props.input.onBlur('')
    })
  }

  restoreIMG (e) {
    e.stopPropagation()
    this.setState({
      file: this.state.restore,
      btnRestore: false
    }, () => {
      this.props.input && this.props.input.onChange(this.state.file)
    })
  }

  _renderTooltip (text) {
    return (
      <Tooltip id='tooltip'>
        <strong>{text}</strong>
      </Tooltip>
    )
  }

  render () {
    return (
      <Dropzone
        onDrop={this.onDrop}
        multiple={false}
        accept={this.props.accept}
        name={this.props.name}
        style={{
          width: '100%',
          height: 200,
          borderWidth: 2,
          borderColor: 'rgb(102, 102, 102)',
          borderStyle: 'dashed',
          borderRadius: 5,
          position: 'relative',
          overflow: 'hidden',
          background: '#c5c5c5',
          cursor: 'pointer',
          marginBottom: '1rem',
          ...this.props.style
        }}
      >
        { !this.state.file &&
          <img
            alt=''
            src='/icons/icon-avatar.png'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        }
        { this.state.file &&
          <img
            alt=''
            src={this.state.file.preview ? this.state.file.preview : this.state.file.uri}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...this.props.styleImg
            }}
          />
        }
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            textAlign: 'right',
            ...this.props.styleButtons
          }}
        >
          { this.state.restore && this.state.btnRestore &&
            <OverlayTrigger
              placement='top'
              overlay={this._renderTooltip('Restaurar original')}
            >
              <Button
                size='sm'
                color='info'
                onClick={this.restoreIMG}
              >
                <Icon bootstrap='action-undo' />
              </Button>
            </OverlayTrigger>
          }
          { this.state.file &&
            <OverlayTrigger
              placement='top'
              overlay={this._renderTooltip('Eliminar')}
            >
              <Button
                size='sm'
                color='danger'
                onClick={this.deleteIMG}
              >
                <Icon bootstrap='trash' />
              </Button>
            </OverlayTrigger>
          }
        </div>
      </Dropzone>
    )
  }
}

FieldFileUpload.defaultProps = {
  accept: 'image/png, image/jpeg, image/jpg',
  style: {},
  styleButtons: {},
  styleImg: {}
}

FieldFileUpload.propTypes = {
  accept: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.object,
  styleButtons: PropTypes.object,
  styleImg: PropTypes.object,
  input: PropTypes.object
}

export default FieldFileUpload
