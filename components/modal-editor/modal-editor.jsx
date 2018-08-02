import React, {Component} from 'react'
import PropTypes from 'prop-types'

import DisplayOrLoading from 'components/display-or-loading'

import './modal-editor.css'

export default class ModalEditor extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    changed: PropTypes.bool,
    heading: PropTypes.any,
    loading: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }

  constructor(props){
    super(props)
    this.state = {
      active: false
    }
  }

  componentDidMount(){
    !(this.state.active) && setTimeout(() => this.setState({active: true}), 1)
  }

  /**
   * Render Pop-Up Form
   *
   * @returns {ReactElement} markup
   */
  render() {
    const { onClose, changed = false, heading = 'Down Under Sports', loading = false, children } = this.props;
    console.log(children)
    return (
      <div className={`modal-editor ${this.state.active ? 'open' : 'closed'}`}>
        <section className='container-fluid package-wrapper'>
          <header className='row'>
            <div className="col">
              <h2 style={{borderBottom: '1px solid #ccc', paddingBottom: '1rem'}}>
                {heading}
                <button type="button" className="close" aria-label="Close" onClick={(e)=>{
                  this.setState({active: false})
                  if(changed){
                    window.location.reload()
                  } else {
                    onClose(e)
                  }
                }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </h2>
            </div>
          </header>
          <DisplayOrLoading
            display={!(loading)}
            className='row'
            style={{height: '100%'}}>
            <div
              className="col"
              style={{height: '100%'}}>
              <div
                className="row overflow-y"
                style={{height: '100%'}}>
                <div className="col">
                  {children}
                </div>
              </div>
            </div>
          </DisplayOrLoading>
        </section>
      </div>
    )
  }
}
