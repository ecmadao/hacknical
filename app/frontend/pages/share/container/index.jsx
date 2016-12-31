import React from 'react';
import Api from 'API/index';

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const { login } = this.props;
    Api.github.getShareInfo(login).then((result) => {
      console.log(result);
    })
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default Share;
