import React, { } from 'react'
import PropTypes from 'prop-types'

const Loader = ({show}) => (
  <wrapper className={'loader-body-fetching ' + (show ? 'loader-fadeIn' : 'loader-fadeOut')}>
    <div className='loader-content-fetching' />
    <div className='showbox'>
      <div className='loader'>
        <svg className='circular' viewBox='25 25 50 50'>
          <circle className='path'
            cx='50'
            cy='50'
            r='20'
            fill='none'
            strokeWidth='2'
            strokeMiterlimit='10'
          />
        </svg>
      </div>
    </div>
  </wrapper>
)

Loader.defaultProps = {
  show: false
}

Loader.propTypes = {
  show: PropTypes.bool
}

export default Loader
