import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import NotFound from './not-found';

describe('Pages - NotFound', () => {
  const div = document.createElement('div');

  const createNotFound = ({...props}) => {
    ReactDOM.render((
      <Router>
        <NotFound {...props} />
      </Router>
    ), div);
    return div.querySelector('section')
  }

  it('renders a not found section', () => {
    const rendered = createNotFound()
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("SECTION")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('contains a "Not Found" header message', () => {
    const rendered = createNotFound()
    const header = rendered.querySelector('header > h1')
    expect(header).toBeTruthy()
    expect(header.innerHTML).toBe("Page Not Found!")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('appologises for their mistake', () => {
    const rendered = createNotFound()
    const paragraph = rendered.querySelector('header + p')
    expect(paragraph).toBeTruthy()
    expect(paragraph.innerHTML)
      .toBe("Sorry, we couldn't locate the page you are looking for.")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('has a link back to to home page', () => {
    const rendered = createNotFound()
    const homeLink = rendered.querySelector('a')
    expect(homeLink).toBeTruthy()
    expect(homeLink.href).toMatch(/http:\/{2}[A-Za-z09\.]+\/?$/)
    expect(homeLink.innerHTML)
      .toBe("Click Here to Return to the Home Page")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('is snapshotable', () => {
    const tree = renderer
      .create(
        <Router>
          <NotFound />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
