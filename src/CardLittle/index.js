import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col } from 'reactstrap'

class CardLittle extends Component {
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
            <Col className='col-12 p-0 pull-left text-center' md='6'>
              <div
                className={
                  'bg-' + this.props.color +
                  (!this.props.noPadding ? ' pt-1 pb-1 ' : ' ') +
                  this.props.txtLeft.className
                }
                style={this.props.txtLeft.style}
              >
                {this.props.txtLeft.titulo || this.props.txtLeft}
              </div>
            </Col>
            <Col className='col-12 p-0 pull-right text-center' md='6'>
              <div
                className={
                  'text-' + this.props.color +
                  (!this.props.noPadding ? ' pt-1 pb-1 ' : ' ') +
                  this.props.txtRight.className
                }
                style={this.props.txtRight.style}
              >
                {this.props.txtRight.titulo || this.props.txtRight}
              </div>
            </Col>
          </div>

        </div>
      </Col>
    )
  }
}

CardLittle.defaultProps = {
  size: {},
  fullWidth: false,
  txtLeft: {},
  txtRight: {}
}

CardLittle.propTypes = {
  box: PropTypes.bool,
  size: PropTypes.object,
  fullWidth: PropTypes.bool,
  icon: PropTypes.object,
  titulo: PropTypes.string,
  subtitulo: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  txtLeft: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  txtRight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default CardLittle
