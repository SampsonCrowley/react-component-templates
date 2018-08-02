import React, { Component } from 'react'
import PropTypes from 'prop-types'

import JellyBox from 'load-awesome-react-components/dist/square/jelly-box'
import 'load-awesome-react-components/dist/square/jelly-box.css'

import Logo from 'assets/images/logo.png'

export default class LazyImage extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    useLoader: PropTypes.bool,
    loaderProps: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
    }
  }

  componentWillMount() {
    this.loadImg()
  }

  componentDidMount() {
    this.mounted = true
    if(this.loaded) this.swapSrc();
  }

  componentWillUnmount() {
    this.mounted = false
    this.loaded = false
  }

  loadImg = () => {
    const img = new Image(),
          src = this.props.src;

    img.onload = () => {
      img.onload = null
      this.loaded = true
      if(this.mounted) this.swapSrc()
    }

    console.log(img.src = src)
  }

  swapSrc = () => {
    console.log('loaded')
    this.setState({loaded: true})
  }

  render() {
    const { placeholder = Logo, src, useLoader, loaderProps = {}, alt = 'Lazy-Loaded image', ...props } = this.props || {}
    console.log(props)
    const {loaded} = this.state
    if(!loaded && useLoader) {
      return (
        <JellyBox
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '#00F',
            zIndex:0
          }}
          {...loaderProps}
        />
      )
    } else {
      return (<img src={loaded ? src : placeholder} alt={alt} {...props}/>)
    }
  }
}
