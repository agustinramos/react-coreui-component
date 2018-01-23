import React, { Component } from 'react'
import PropTypes from 'prop-types'
import objectPath from 'object-path'

class ContentDetail extends Component {
  constructor (props) {
    super(props)

    let descripciones = []
    for (var key in props.descripciones) {
      descripciones.push({key: key, valor: props.descripciones[key]})
    }

    let contenido = {}
    if (props.contenido && Object.keys(props.contenido).length !== 0) {
      contenido = props.contenido
    }

    this.state = {
      descripciones,
      contenido
    }
    this._renderLi = this._renderLi.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.contenido && Object.keys(nextProps.contenido).length !== 0) {
      this.setState({contenido: nextProps.contenido})
    }
  }

  _renderLi (dato, key, total) {
    let value = '-'
    if (this.props.formatContenido[dato.key]) {
      if (typeof this.props.formatContenido[dato.key] === 'function') {
        value = this.props.formatContenido[dato.key](objectPath.get(this.state.contenido, dato.key), this.state.contenido)
      } else {
        value = objectPath.get(this.props.formatContenido, dato.key)
      }
    } else if ((objectPath.get(this.state.contenido, dato.key) &&
      objectPath.get(this.state.contenido, dato.key) !== '') ||
      objectPath.get(this.state.contenido, dato.key) === 0 ||
      objectPath.get(this.state.contenido, dato.key) === false) {
      if (objectPath.get(this.state.contenido, dato.key) === true) {
        value = this.props.defaultBooleanTxt.true
      } else if (objectPath.get(this.state.contenido, dato.key) === false) {
        value = this.props.defaultBooleanTxt.false
      } else {
        value = objectPath.get(this.state.contenido, dato.key)
      }
    }
    return (
      <li key={key}
        style={{
          overflow: 'hidden',
          borderBottom: (key === (total - 1) ? 'none' : '1px solid #999999'),
          paddingTop: 10
        }}
      >
        <label className='pull-left'>{ dato.valor }</label>
        <strong className='pull-right'>
          { value }
        </strong>
      </li>
    )
  }

  render () {
    return (
      <wrapper style={{width: '100%'}}>
        { Object.keys(this.state.contenido).length === 0 &&
          <h5>Cargando ...</h5>
        }
        { Object.keys(this.state.contenido).length !== 0 &&
          <ul style={{listStyleType: 'none', paddingLeft: 0}}>
            { this.state.descripciones.map((v, k) => this._renderLi(v, k, this.state.descripciones.length)) }
          </ul>
        }
        { this.props.children }
      </wrapper>
    )
  }
}

ContentDetail.defaultProps = {
  descripciones: {},
  contenido: {},
  formatContenido: {},
  defaultBooleanTxt: {true: 'Si', false: 'No'}
}

ContentDetail.propTypes = {
  descripciones: PropTypes.object,
  contenido: PropTypes.object,
  formatContenido: PropTypes.object,
  children: PropTypes.any,
  defaultBooleanTxt: PropTypes.object
}

export default ContentDetail
