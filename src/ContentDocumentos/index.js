import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Button } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Icon from '../Icon'
import Callout from '../Callout'
import Interactive from 'react-interactive'

class ContentDocumentos extends Component {
  constructor (props) {
    super(props)

    this.state = {}
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
      <Col
        className='col-12'
        lg={this.props.size}
      >
        <Interactive
          as='div'
          active={{
            transition: '.2s all ease-in-out',
            transform: 'scale(.95)'
          }}
          style={{
            transition: '.2s all ease-out'
          }}
        >
          <Callout
            fullWidth
            title={() => (
              <wrapper style={{
                display: 'block',
                padding: '5px 0px'
              }}
              >
                { this.props.children }
                <hr />
                <Row
                  style={{
                    display: 'flex',
                    marginBottom: -5,
                    marginTop: 10
                  }}
                >
                  { this.props.download &&
                    <OverlayTrigger
                      placement='top'
                      overlay={this._renderTooltip('Descargar documento')}
                    >
                      <Button
                        style={{
                          flex: 1,
                          position: 'relative'
                        }}
                        size='sm'
                        color='success'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={this.props.download.uri}
                          download={this.props.download.fileName}
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
                  }
                  { this.props.download && <wrapper>&nbsp;&nbsp;</wrapper>}
                  { this.props.edit &&
                    <OverlayTrigger
                      placement='top'
                      overlay={this._renderTooltip('Editar documento')}
                    >
                      <Button
                        style={{
                          flex: 1
                        }}
                        size='sm'
                        onClick={this.props.edit}
                      >
                        <Icon bootstrap='pencil' />
                      </Button>
                    </OverlayTrigger>
                  }
                  { this.props.edit && <wrapper>&nbsp;&nbsp;</wrapper>}
                  { this.props.delete &&
                    <OverlayTrigger
                      placement='top'
                      overlay={this._renderTooltip('Eliminar documento')}
                    >
                      <Button
                        style={{
                          flex: 1
                        }}
                        size='sm'
                        color='danger'
                        onClick={this.props.delete}
                      >
                        <Icon bootstrap='trash' />
                      </Button>
                    </OverlayTrigger>
                  }
                  { this.props.rescue &&
                    <OverlayTrigger
                      placement='top'
                      overlay={this._renderTooltip('Recuperar documento')}
                    >
                      <Button
                        style={{
                          flex: 1
                        }}
                        size='sm'
                        color='info'
                        onClick={this.props.rescue}
                      >
                        <Icon bootstrap='action-undo' />
                      </Button>
                    </OverlayTrigger>
                  }
                </Row>
              </wrapper>
            )}
            color='primary'
          />
        </Interactive>
      </Col>
    )
  }
}

ContentDocumentos.defaultProps = {
  size: '3'
}

ContentDocumentos.propTypes = {
  children: PropTypes.any,
  size: PropTypes.string,
  download: PropTypes.object,
  edit: PropTypes.func,
  delete: PropTypes.func,
  rescue: PropTypes.func
}

export default ContentDocumentos
