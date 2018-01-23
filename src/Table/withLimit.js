import React from 'react'
import PropTypes from 'prop-types'

export default function withLimit (Component) {
  class withLimit extends React.Component {
    constructor (props) {
      super(props)

      let limit = null
      if (props.limit) {
        if (typeof props.limit === 'object' && props.limit.options) {
          limit = props.limit
        } else {
          limit = {
            options: [10, 25, 50, 100, 1000]
          }
        }
      }

      this.state = {
        limit
      }
      this.handlerOnChange = this.handlerOnChange.bind(this)
      this._renderLimit = this._renderLimit.bind(this)
    }

    componentDidMount () {
      if (this.state.limit) {
        this.props.setActiveLimit(this.state.limit.options[0], true)
      }
    }

    handlerOnChange (value) {
      this.props.setActiveLimit(parseInt(value, 10))
    }

    _renderLimitElements (opt, kOpt) {
      return (
        <option
          key={'opt-' + kOpt}
          value={opt}
        >
          {opt}
        </option>
      )
    }

    _renderLimit () {
      if (this.state.limit) {
        return (
          <div className='pull-left'>
            Mostrar &nbsp;
            <select
              value={this.props.activeLimit}
              onChange={e => this.handlerOnChange(e.currentTarget.value)}
            >
              {this.state.limit.options.map(this._renderLimitElements)}
            </select>&nbsp;
            registros
          </div>
        )
      } else {
        return null
      }
    }

    render () {
      return (
        <Component
          _renderLimit={this._renderLimit}
          {...this.props}
        />
      )
    }
  }

  withLimit.defaultProps = {}

  withLimit.propTypes = {
    limit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    setActiveLimit: PropTypes.func,
    activeLimit: PropTypes.number
  }

  return withLimit
}
