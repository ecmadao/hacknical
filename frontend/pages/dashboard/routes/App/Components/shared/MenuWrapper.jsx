
import React from 'react'
import API from 'API'

class MenuWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
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
    // const tmp = await API.github
    // console.log(' ====================== tmp ====================== ')
    // console.log(tmp)
    const zen = await API.github.zen()
    this.setState({ zen })
  }

  async getLanguages() {
    const languages = await API.home.languages()
    this.setState({ languages })
  }
}

export default MenuWrapper
