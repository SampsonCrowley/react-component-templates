import React, {Component, Fragment} from 'react'
import { string, node, func, oneOfType, bool, number, arrayOf, shape } from 'prop-types'

import filterKeys from 'helpers/filter-keys'

export default class InlineRadioField extends Component {
  /**
   * @type {object}
   * @property {String|Element} label - Input Label
   * @property {String} id - Input Id
   * @property {String} name - Input Name
   * @property {Function} onChange - Run on input change
   * @property {String} type - Input type
   * @property {String|Element} feedback - Feedback to show on Input focus
   * @property {String|Boolean|Number} value - Input value
   * @property {(RegExp|Function)} validator - Validate input aginst regex or function
   */
  static propTypes = {
    label: oneOfType([
      string,
      node,
    ]),
    id: string.isRequired,
    name: string.isRequired,
    onChange: func,
    feedback: oneOfType([
      string,
      node
    ]),
    value: oneOfType([
      string,
      bool,
      number,
    ]),
    options: arrayOf(
      shape({
        value: oneOfType([
          string,
          number,
          bool,
        ]),
        label: oneOfType([
          string,
          node,
        ]),
        className: string,
      })
    )
  }

  onChange(ev){
    console.log(ev)
  }

  render(){
    const {
            label = '', name, id = name,
            feedback = '', options = [],
            value: selectedVal,
            labelProps: lProps = {},
            onChange = (()=>{}),
            ...props
          } = filterKeys(this.props, ['validator', 'caretIgnore']),
          { className: labelClassName = '', ...labelProps } = lProps

    return (
      <Fragment>
        <label key={id + '.label'} htmlFor={name}>{label}</label>
        <div
          key={id + '.input'}
          id={id}
          className="row form-group"
        >
          {
            options.map(
              ({className = '', value, label = value}, i) => (
                <div className='col'>
                  <div
                    className="input-group clickable"
                    key={id + '.input'}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onChange(value)
                    }}
                  >
                    <div className="input-group-prepend">
                      <input
                        name={name}
                        id={`${id}_input_${i}`}
                        type='radio'
                        value={value}
                        checked={selectedVal === value}
                        className='indirect-box'
                        {...props}
                      />
                      <div
                        className="input-group-text text-success"
                        dangerouslySetInnerHTML={{__html: (selectedVal === value) ? '&#10004;' : '&nbsp;&nbsp;&nbsp;'}}
                      />
                    </div>
                    <label
                      {...labelProps}
                      className={`form-control ${labelClassName}`}
                      htmlFor={`${id}_input_${i}`}
                    >
                      {label}
                    </label>
                  </div>
                </div>
              )
            )
          }
        </div>
        <small key={id + '.feedback'} className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}
