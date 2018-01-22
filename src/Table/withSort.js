import React from 'react'
import PropTypes from 'prop-types'

import deepcopy from 'deepcopy'

export default function withSort (Component) {
  class withSort extends React.Component {
    constructor (props) {
      super(props)

      let initSort = []
      if (props.sort && props.sort.init) {
        initSort = [{p: props.sort.init, v: props.sort.fieldsSort[props.sort.init]}]
      }

      // INVIERTO LOS DEMAS QUE NO SON DEL INIT PARA QUE FUNCIONE EL ALGORITMO
      let sort = null
      if (props.sort && props.sort.fieldsSort) {
        sort = props.sort
        for (let prop in sort.fieldsSort) {
          if (props.sort.init && prop !== props.sort.init) {
            if (sort.fieldsSort[prop] === 'asc') {
              sort.fieldsSort[prop] = 'desc'
            } else {
              sort.fieldsSort[prop] = 'asc'
            }
          }
        }
      }

      this.state = {
        initSort,
        sort,
        cssClassName: {enabled: 'sorting', sorting: 'sorting_'}
      }
      this.handlerSortOnChange = this.handlerSortOnChange.bind(this)
    }

    componentDidMount () {
      this.props.setActiveSort(this.state.initSort, true)
    }

    handlerSortOnChange (key) {
      let sort = deepcopy(this.state.sort)
      let initAnterior = sort.init
      sort.init = key
      if (sort.init !== initAnterior) {
        sort.fieldsSort[initAnterior] = (this.props.sort.fieldsSort[initAnterior] === 'asc' ? 'desc' : 'asc')
      }
      sort.fieldsSort[sort.init] = (sort.fieldsSort[sort.init] === 'asc' ? 'desc' : 'asc')
      let activeSort = [{
        [this.props.outputDefault.p || 'p']: sort.init,
        [this.props.outputDefault.v || 'v']: this.props.outputDefault[sort.fieldsSort[sort.init]] || sort.fieldsSort[sort.init]
      }]

      this.setState({
        sort
      }, () => this.props.setActiveSort(activeSort))
    }

    render () {
      return (
        <Component
          handlerSortOnChange={this.handlerSortOnChange}
          cssClassName={this.state.cssClassName}
          {...this.props}
          sort={this.state.sort}
        />
      )
    }
  }

  withSort.defaultProps = {
    outputDefault: {}
  }

  withSort.propTypes = {
    outputDefault: PropTypes.object,
    sort: PropTypes.object,
    setActiveSort: PropTypes.func
  }

  return withSort
}
