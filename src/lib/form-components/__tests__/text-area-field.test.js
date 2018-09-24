import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import TextAreaField from 'form-components/text-area-field'

describe('Form Components - TextAreaField', () => {
  const div = document.createElement('div');
  const defaultProps = {
    id: 'testId',
    name: 'testName',
    label: 'test label',
    value: 'test value',
    feedback: 'test feedback'
  }

  const createTextAreaField = ({...props}) => {
    ReactDOM.render((
      <Router>
        <TextAreaField {...props} />
      </Router>
    ), div);
    return div
  }

  const getTextAreaFieldInput = ({...props}) => createTextAreaField(props).querySelector('textarea')
  const getTextAreaFieldLabel = ({...props}) => createTextAreaField(props).querySelector('label')
  const getTextAreaFieldFeedback = ({...props}) => createTextAreaField(props).querySelector('small')

  it('renders a textarea tag', () => {
    const rendered = getTextAreaFieldInput(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("TEXTAREA")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders an label tag', () => {
    const rendered = getTextAreaFieldLabel(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("LABEL")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders a feedback tag', () => {
    const rendered = getTextAreaFieldFeedback(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("SMALL")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders only an textarea if skipExtras is passed', () => {
    const feedback = getTextAreaFieldFeedback({...defaultProps, skipExtras: true})
    const label = getTextAreaFieldLabel({...defaultProps, skipExtras: true})
    const input = getTextAreaFieldInput({...defaultProps, skipExtras: true})
    expect(feedback).toBe(null)
    expect(label).toBe(null)
    expect(input).toBeTruthy()
    expect(input.tagName).toBe('TEXTAREA')
    ReactDOM.unmountComponentAtNode(div);
  })

  it('is snapshotable', () => {
    const tree = renderer
      .create(
        <Router>
          <TextAreaField {...defaultProps}/>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
