import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'helpers'

export default class BooleanField extends Component {
  /**
   * @type {object}
   * @property {String} checked - Input is checked
   * @property {String} id - Input Id
   * @property {String|Element} label - Input Label
   * @property {Object} labelProps - Props for Input label
   * @property {String} name - Input Name
   * @property {Function} toggle - Run on input change
   * @property {String|Element} topLabel - Top Label above input
   * @property {Object} topLabelProps - Props for Top label
   * @property {String} type - Input type
   */
  static propTypes = {
    checked: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    labelProps: PropTypes.object,
    name: PropTypes.string.isRequired,
    skipTopLabel: PropTypes.bool,
    toggle: PropTypes.func,
    topLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    topLabelProps: PropTypes.object,
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
