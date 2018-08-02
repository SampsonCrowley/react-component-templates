import React, { Component } from 'react';
import JellyBox from 'load-awesome-react-components/dist/square/jelly-box'
import 'load-awesome-react-components/dist/square/jelly-box.css'

import Link from 'components/link';

import './not-found.css'

class NotFoundPage extends Component {
  render() {
    return (
      <section className="not-found-page">
        <header>
          <h1>
            Page Not Found!
          </h1>
        </header>
        <main>
          <p>
            Sorry, we couldn't locate the page you are looking for.
          </p>
          <p>
            <Link to="/">Click Here to Return to the Home Page</Link>
          </p>
          <div className="clearfix form-group"></div>
          <JellyBox />
        </main>
      </section>
    );
  }
}

export default NotFoundPage;
