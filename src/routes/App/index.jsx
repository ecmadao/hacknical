import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TabBar from './Components/TabBar/index';
import Header from './Components/Header/index';
import './styles/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;
    return (
      <div className="app">
        <div className="app_top">
          <Header />
          <TabBar />
        </div>
        <div className="app_content">
          <div className="content_container">
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(App);
