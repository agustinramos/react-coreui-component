import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Jumbotron } from 'reactstrap'

class CardImgFull extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <wrapper>
        <Container fluid
          style={{height: 230, padding: 0, marginLeft: -30, marginRight: -30, marginTop: -25, marginBottom: -210}}
        >
          <img
            src={this.props.image}
            style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', backgroundRepeat: 'no-repeat'}}
            alt=''
          />
        </Container>
        <Jumbotron fluid style={{position: 'relative', height: 240, color: this.props.color}}>
          { this.props.titulo &&
            <label
              className='display-3'
              style={{background: 'rgba(0,0,0,0.5)', padding: '5px 20px', marginLeft: -30}}
            >
              {this.props.titulo}
            </label>
          }
          { this.props.subtitulo && <p className='lead' style={{marginTop: 75}}>{this.props.subtitulo}</p>}
        </Jumbotron>
      </wrapper>
    )
  }
}

CardImgFull.defaultProps = {
}

CardImgFull.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  titulo: PropTypes.string,
  subtitulo: PropTypes.string
}

export default CardImgFull
