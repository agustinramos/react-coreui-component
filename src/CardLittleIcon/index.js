import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col } from 'reactstrap'
import Icon from '../Icon'

class CardLittleIcon extends Component {
  constructor (props) {
    super(props)

    this.state = {}
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
        <div className={'card ' + this.props.className} style={this.props.style}>
          <div className={(!this.props.box ? 'p-0 ' : '') + 'card-block clearfix'}>
            <Icon
              {...this.props.icon}
              className={
                (this.props.color ? 'bg-' + this.props.color : '') +
                ' p-2 font-2xl mr-1 pull-left'
              }
            />
            <div className={'h5 text-' + this.props.color + ' mb-0 pt-1'}>{this.props.titulo}</div>
            { this.props.subtitulo &&
              <div className='text-muted text-uppercase font-weight-bold font-xs'>
                {this.props.subtitulo}
              </div>
            }
          </div>
        </div>
      </Col>
    )
  }
}

CardLittleIcon.defaultProps = {
  size: {},
  fullWidth: false
}

CardLittleIcon.propTypes = {
  box: PropTypes.bool,
  size: PropTypes.object,
  fullWidth: PropTypes.bool,
  icon: PropTypes.object,
  titulo: PropTypes.string,
  subtitulo: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string
}

export default CardLittleIcon
