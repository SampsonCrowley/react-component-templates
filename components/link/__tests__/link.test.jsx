import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import Link from '../link'

describe('Components - Link', () => {
  const div = document.createElement('div');

  const createLink = ({...props}) => {
    ReactDOM.render((
      <Router>
        <Link {...props} />
      </Router>
    ), div);
    return div.querySelector('a')
  }

  it('renders an anchor tag', () => {
    const rendered = createLink({
      to: '/',
      children: 'Test'
    })
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("A")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('requires a "to" prop', () => {
    global.console = {error: jest.fn()}
    expect(() => createLink({children: 'Test'})).toThrow()
    expect(console.error).toBeCalled()
    ReactDOM.unmountComponentAtNode(div);
  })

  it('sets the "href" prop to "to"', () => {
    expect(createLink({
      to: '/test',
      children: 'Test'
    }).href).toMatch(/http:\/{2}[A-Za-z09\.]+\/test$/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('requires children', () => {
    global.console = {error: jest.fn()}
    createLink({to: '/'})
    expect(console.error).toBeCalled()
    ReactDOM.unmountComponentAtNode(div);
  })

  it('renders children', () => {
    expect(createLink({
      to: '/',
      children: 'Test'
    }).innerHTML).toMatch(/^Test$/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('is snapshotable', () => {
    const tree = renderer
      .create(
        <Router>
          <Link to='/'>Test</Link>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
