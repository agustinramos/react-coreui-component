import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Collapse } from 'reactstrap'
import Icon from '../Icon'

class Card extends Component {
  constructor (props) {
    super(props)

    this.state = {
      propOpen: props.open,
      collapseOpen: (!props.animated ? true : (props.open)),
      textCollapse: (!props.animated ? '' : (props.open ? 'ocultar contenido' : 'mostrar contenido'))
    }
    this.toggle = this.toggle.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open !== this.state.propOpen) {
      this.setState({
        collapseOpen: nextProps.open,
        propOpen: nextProps.open
      })
    }
  }

  toggle () {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
      textCollapse: (!this.state.collapseOpen ? 'ocultar contenido' : 'mostrar contenido')
    })
  }

  render () {
    return (
      <Col
        className='col-12'
        style={{padding: (this.props.fullWidth && 0)}}
        xs={this.props.size.xs}
        sm={this.props.size.sm}
        md={this.props.size.md}
        lg={this.props.size.lg}
        xl={this.props.size.xl}
      >
        <div
          className={'card' +
            (this.props.outlineColor ? ' card-outline-' + this.props.outlineColor : '') +
            (this.props.topColor ? ' card-accent-' + this.props.topColor : '') +
            (this.props.cardColor ? ' card-inverse card-' + this.props.cardColor : '')
          }
        >
          { this.props.title &&
            <div className='card-header'
              onClick={this.props.animated && this.toggle}
              style={{cursor: (this.props.animated ? 'pointer' : 'default')}}
            >
              { this.props.icon &&
                <Icon {...this.props.icon} />
              }
              { this.props.title }
              { this.props.nextTitle }
              { this.props.animated &&
                <small><strong>&nbsp;&nbsp;(click para {this.state.textCollapse})</strong></small>
              }
            </div>
          }
          <Collapse isOpen={this.state.collapseOpen}>
            <div
              className={'card-block' +
                (this.props.fullWidth ? ' row' : '')
              }
            >
              { this.props.children }
            </div>
            { this.props.footer &&
              <div className='card-footer'>
                { this.props.footer }
              </div>
            }
          </Collapse>
        </div>
      </Col>
    )
  }
}

Card.defaultProps = {
  size: {},
  animated: false,
  open: false,
  fullWidth: false
}

Card.propTypes = {
  size: PropTypes.object,
  animated: PropTypes.bool,
  open: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.object,
  title: PropTypes.any,
  nextTitle: PropTypes.any,
  outlineColor: PropTypes.string,
  topColor: PropTypes.string,
  cardColor: PropTypes.string,
  footer: PropTypes.any,
  children: PropTypes.any
}

export default Card
