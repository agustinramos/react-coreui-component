import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col } from 'reactstrap'

class Callout extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <Col
        className={'col-' +
          (this.props.size.xs
            ? this.props.size.xs
            : this.props.size.sm
              ? this.props.size.sm
              : this.props.size.md
                ? this.props.size.md
                : this.props.size.lg
                  ? this.props.size.lg
                  : this.props.size.xl
                    ? this.props.size.xl
                    : 12
          )
        }
        style={{padding: (this.props.fullWidth && 0), ...this.props.style}}
        xs={this.props.size.xs}
        sm={this.props.size.sm}
        md={this.props.size.md}
        lg={this.props.size.lg}
        xl={this.props.size.xl}
      >
        <div className={'callout callout-' + this.props.color} >
          { this.props.small && typeof this.props.small === 'function' && this.props.small() }
          { this.props.small && typeof this.props.small === 'string' && <small className='text-muted'>{ this.props.small }</small> }
          { this.props.small && typeof this.props.small === 'string' && <br /> }
          { this.props.title && typeof this.props.title === 'function' && this.props.title() }
          { this.props.title && typeof this.props.title === 'string' && <strong className='h4'>{ this.props.title }</strong> }
        </div>
      </Col>
    )
  }
}

Callout.defaultProps = {
  size: {},
  color: 'info'
}

Callout.propTypes = {
  small: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  color: PropTypes.string,
  size: PropTypes.object,
  style: PropTypes.object,
  fullWidth: PropTypes.bool
}

export default Callout
