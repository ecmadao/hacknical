
import React from 'react'
import API from 'API'
import NotifyContent from './NotifyContent'

class Notify extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
    this.onClose = this.onClose.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      API.user.getNotifies().then((messages) => {
        this.setState({ messages })
      })
    }, 2500)
  }

  onClose() {
    const { messages } = this.state
    this.setState({ messages: [] })
    const ids = messages.map(message => message.id)
    API.user.markNotifies(ids)
  }

  render() {
    const { messages } = this.state
    if (!messages || !messages.length) return null
    return (
      <NotifyContent
        messages={messages}
        onClose={this.onClose}
      />
    )
  }
}

export default Notify
