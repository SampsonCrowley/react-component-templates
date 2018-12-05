import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import SelectField from 'form-components/select-field'

describe('Form Components - SelectField', () => {
  const div = document.createElement('div');
  const defaultProps = {
    id: 'testId',
    name: 'testName',
    label: 'test label',
    value: 'test value',
    feedback: 'test feedback'
  }

  const createSelectField = ({...props}) => {
    ReactDOM.render((
      <Router>
        <SelectField {...props} />
      </Router>
    ), div);
    return div
  }

  const getSelectFieldInput = ({...props}) => createSelectField(props).querySelector('input')
  const getSelectFieldLabel = ({...props}) => createSelectField(props).querySelector('label')
  const getSelectFieldFeedback = ({...props}) => createSelectField(props).querySelector('small')

  it('renders an input tag', () => {
    const rendered = getSelectFieldInput(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("INPUT")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders an label tag', () => {
    const rendered = getSelectFieldLabel(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("LABEL")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders a feedback tag', () => {
    const rendered = getSelectFieldFeedback(defaultProps)
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("SMALL")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders a only an input if skipExtras is passed', () => {
    const feedback = getSelectFieldFeedback({...defaultProps, skipExtras: true})
    const label = getSelectFieldLabel({...defaultProps, skipExtras: true})
    const input = getSelectFieldInput({...defaultProps, skipExtras: true})
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
          <SelectField {...defaultProps}/>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
