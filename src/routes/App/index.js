import React, { PropTypes } from 'react';
import TabBar from './Components/TabBar/index';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <TabBar />
      </div>
    )
  }
}

export default App;
