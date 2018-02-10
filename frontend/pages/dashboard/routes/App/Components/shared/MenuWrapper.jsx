import React from 'react';
import Api from 'API';

class MenuWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      zen: '',
      languages: [],
    };
  }

  componentDidMount() {
    this.getZen();
    this.getLanguages();
  }

  async getZen() {
    const zen = await Api.github.zen();
    this.setState({ zen });
  }

  async getLanguages() {
    const languages = await Api.home.languages();
    this.setState({ languages });
  }
}

export default MenuWrapper;
