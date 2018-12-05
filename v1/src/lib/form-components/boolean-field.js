import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'helpers'

export default class BooleanField extends Component {
  /**
   * @type {object}
   * @property {String|Element} label - Input Label
   * @property {String} id - Input Id
   * @property {String} name - Input Name
   * @property {String} checked - Input is checked
   * @property {Function} toggle - Run on input change
   * @property {String} type - Input type
   */
  static propTypes = {
    topLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    toggle: PropTypes.func,
    type: PropTypes.string,
  }

  render(){
    const {
            name, toggle, type,
            label = '', topLabel = '', id = name, skipTopLabel = false,
            validator: _validator, checked = false,
            labelProps: lProps = {},
            topLabelProps: tlProps = {},
            reversed = false,
            className = '',
            ...props
          } = this.props,
          { className: labelClassName = '', ...labelProps } = lProps,
          { className: topLabelClassName = '', ...topLabelProps } = tlProps,
          debounceToggle = debounce(toggle, 100);

    return (
      <Fragment>
        {
          !skipTopLabel && (
            <label
              {...topLabelProps}
              key={`${id}.label`}
              htmlFor={id}
              className={`boolean-top-label ${topLabelClassName}`}
            >
              {topLabel}
            </label>
          )
        }
        <div
          className={`${className} input-group clickable`}
          key={`${id}.input`}
          onClick={() => debounceToggle()}
        >
          <div className="input-group-prepend">
            <input
              name={name}
              id={id}
              type='checkbox'
              value={1}
              checked={!!checked}
              className='indirect-box'
              onChange={() => debounceToggle()}
              {...props}
            />
            {
              (reversed ? !checked : checked) ? (
                <div className="input-group-text text-success">&#10004;</div>
              ) : (
                <div className="input-group-text text-danger">X</div>
              )
            }
          </div>
          <label
            {...labelProps}
            className={`form-control ${labelClassName}`}
            htmlFor={id}
          >
            {label}
          </label>
        </div>
      </Fragment>
    )
  }
}
