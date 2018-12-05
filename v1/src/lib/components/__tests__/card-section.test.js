import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import CardSection from '../card-section'

describe('Components - CardSection', () => {
  const div = document.createElement('div');

  const createCardSection = ({...props}) => {
    ReactDOM.render((
      <Router>
        <CardSection {...props} />
      </Router>
    ), div);
    return div.querySelector('section')
  }

  it('renders an section tag', () => {
    const rendered = createCardSection()
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("SECTION")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders header and main tags', () => {
    const rendered = createCardSection()
    expect(rendered.querySelector('header')).toBeTruthy()
    expect(rendered.querySelector('main')).toBeTruthy()
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders an H3 tag in the header', () => {
    const rendered = createCardSection()
    expect(rendered.querySelector('header h3')).toBeTruthy()
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders children', () => {
    expect(createCardSection({
      children: 'Test'
    }).querySelector('main').innerHTML).toMatch(/^Test$/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('is snapshotable', () => {
    const tree = renderer
      .create(
        <Router>
          <CardSection to='/'>Test</CardSection>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
