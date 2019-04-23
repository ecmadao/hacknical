
import React from 'react'
import API from 'API'

class MenuWrapper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      zen: '',
      languages: []
    }
  }

  componentDidMount() {
    this.getZen()
    this.getLanguages()
  }

  async getZen() {
    const zen = await API.github.zen()
    this.setState({ zen })
  }

  async getLanguages() {
    const languages = await API.home.languages()
    this.setState({ languages })
  }
}

export default MenuWrapper
