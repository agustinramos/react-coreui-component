import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, FormGroup, Label, Input, FormFeedback, Col, InputGroup, InputGroupAddon } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Icon from '../Icon'

class FieldGroupFile extends Component {
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
    this.deleteFILE = this.deleteFILE.bind(this)
    this.restoreFILE = this.restoreFILE.bind(this)
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
          base64: result.split(',')[1]
        },
        btnRestore: true
      }, () => {
        this.props.input && this.props.input.onChange(this.state.file)
        this.props.onSelect && this.props.onSelect(this.state.file)
      })
    }, err => {
      console.log(err)
    })
  }

  deleteFILE (e) {
    e.stopPropagation()
    this.setState({
      file: false,
      btnRestore: true
    }, () => {
      this.props.input && this.props.input.onChange('')
      this.props.input && this.props.input.onBlur('')
      this.props.onSelect && this.props.onSelect('')
    })
  }

  restoreFILE (e) {
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

  _renderFieldInput ({autocomplete, icon, label, input, stylesInput, ...props}) {
    return (
      <InputGroup>
        <OverlayTrigger
          placement='top'
          overlay={this._renderTooltip('Agregar archivo')}
        >
          <InputGroupAddon
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Dropzone
              onDrop={this.onDrop}
              multiple={false}
              accept={this.props.accept}
              name={this.props.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            { (icon.bootstrap || icon.awesome) &&
              <Icon
                bootstrap={icon.bootstrap}
                awesome={icon.awesome}
                style={icon.style}
              />
            }
          </InputGroupAddon>
        </OverlayTrigger>
        <Input
          id={label && label.replace(/ /g, '')}
          autoComplete={autocomplete ? 'on' : 'off'}
          type='text'
          style={stylesInput}
          value={this.state.file ? this.state.file.fileName : ''}
          readOnly
        />
        { this.state.restore && this.state.btnRestore &&
          <InputGroupAddon style={{display: 'flex', padding: 0}}>
            <OverlayTrigger
              placement='top'
              overlay={this._renderTooltip('Restaurar original')}
            >
              <Button
                style={{flex: 1}}
                size='sm'
                color='info'
                onClick={this.restoreFILE}
              >
                <Icon bootstrap='action-undo' />
              </Button>
            </OverlayTrigger>
          </InputGroupAddon>
        }
        { this.state.file && this.state.file.uri &&
          <InputGroupAddon style={{display: 'flex', padding: 0, position: 'relative'}}>
            <OverlayTrigger
              placement='top'
              overlay={this._renderTooltip('Descargar')}
            >
              <Button
                style={{flex: 1}}
                size='sm'
                color='success'
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={this.state.file.uri}
                  download={this.state.file.fileName}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                  }}
                />
                <Icon bootstrap='cloud-download' />
              </Button>
            </OverlayTrigger>
          </InputGroupAddon>
        }
        { this.state.file &&
          <InputGroupAddon style={{display: 'flex', padding: 0}}>
            <OverlayTrigger
              placement='top'
              overlay={this._renderTooltip('Eliminar')}
            >
              <Button
                style={{flex: 1}}
                size='sm'
                color='danger'
                onClick={this.deleteFILE}
              >
                <Icon bootstrap='trash' />
              </Button>
            </OverlayTrigger>
          </InputGroupAddon>
        }
      </InputGroup>
    )
  }

  render () {
    const { horizontal, required, meta, info, className, ...props } = this.props
    return (
      <FormGroup
        color={(meta && !meta.touched ? '' : meta && meta.valid ? '' : 'danger')}
        row={horizontal ? true : undefined}
        className={className}
      >
        { props.label &&
          <Label
            for={props.label.replace(/ /g, '')}
            xs={horizontal && horizontal.labelSize && horizontal.labelSize.xs ? horizontal.labelSize.xs : undefined}
            sm={horizontal && horizontal.labelSize && horizontal.labelSize.sm ? horizontal.labelSize.sm : undefined}
            md={horizontal && horizontal.labelSize && horizontal.labelSize.md ? horizontal.labelSize.md : undefined}
            lg={horizontal && horizontal.labelSize && horizontal.labelSize.lg ? horizontal.labelSize.lg : undefined}
            xl={horizontal && horizontal.labelSize && horizontal.labelSize.xl ? horizontal.labelSize.xl : undefined}
          >
            {props.label} {required && <span className='text-danger'>*</span>}
            &nbsp;
            { info && info !== '' &&
              <OverlayTrigger
                placement='right'
                overlay={this._renderTooltip(info)}
              >
                <wrapper>
                  <Icon bootstrap='info' />
                </wrapper>
              </OverlayTrigger>
            }
          </Label>
        }
        { horizontal &&
          <Col
            xs={horizontal && horizontal.inputSize && horizontal.inputSize.xs ? horizontal.inputSize.xs : undefined}
            sm={horizontal && horizontal.inputSize && horizontal.inputSize.sm ? horizontal.inputSize.sm : undefined}
            md={horizontal && horizontal.inputSize && horizontal.inputSize.md ? horizontal.inputSize.md : undefined}
            lg={horizontal && horizontal.inputSize && horizontal.inputSize.lg ? horizontal.inputSize.lg : undefined}
            xl={horizontal && horizontal.inputSize && horizontal.inputSize.xl ? horizontal.inputSize.xl : undefined}
          >
            { this._renderFieldInput(props) }

            {meta && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback>}
          </Col>
        }

        { !horizontal && this._renderFieldInput(props) }

        { !horizontal && meta && meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback> }
      </FormGroup>
    )
  }
}

FieldGroupFile.defaultProps = {
  autocomplete: false,
  icon: {bootstrap: 'doc'}
}

FieldGroupFile.propTypes = {
  accept: PropTypes.string,
  name: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  horizontal: PropTypes.bool,
  info: PropTypes.string,
  onSelect: PropTypes.func
}

export default FieldGroupFile
