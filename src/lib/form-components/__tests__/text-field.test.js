import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import TextField from 'form-components/text-field'

describe('Form Components - TextField', () => {
  const div = document.createElement('div');
  const defaultProps = {
    id: 'testId',
    name: 'testName',
    label: 'test label',
    value: 'test value',
    feedback: 'test feedback'
  }

  const createTextField = ({...props}) => {
    ReactDOM.render((
      <Router>
        <TextField {...props} />
      </Router>
    ), div);
    return div
  }

  const getTextFieldInput = ({...props}) => createTextField(props).querySelector('input')
  const getTextFieldLabel = ({...props}) => createTextField(props).querySelector('label')
  const getTextFieldFeedback = ({...props}) => createTextField(props).querySelector('small')

  it('renders an input tag', () => {
    const rendered = getTextFieldInput(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("INPUT")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders an label tag', () => {
    const rendered = getTextFieldLabel(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("LABEL")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders a feedback tag', () => {
    const rendered = getTextFieldFeedback(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("SMALL")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders only an input if skipExtras is passed', () => {
    const feedback = getTextFieldFeedback({...defaultProps, skipExtras: true})
    const label = getTextFieldLabel({...defaultProps, skipExtras: true})
    const input = getTextFieldInput({...defaultProps, skipExtras: true})
    expect(feedback).toBe(null)
    expect(label).toBe(null)
    expect(input).toBeTruthy()
    expect(input.tagName).toBe('INPUT')
    ReactDOM.unmountComponentAtNode(div);
  })

  it('is snapshotable', () => {
    const tree = renderer
      .create(
        <Router>
          <TextField {...defaultProps}/>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
