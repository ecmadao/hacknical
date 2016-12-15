import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Tipso from 'COMPONENTS/Tipso';
import Input from 'COMPONENTS/Input';
import validator from 'UTILS/validator';

class SocialLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    this.onActive = this.onActive.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onActive() {
    this.setState({ active: true });
  }

  componentDidMount() {
    if (document.addEventListener) {
      document.addEventListener('mousedown', this.onOutsideClick, true);
    } else {
      document.attachEvent('onmousedown', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    if (document.removeEventListener) {
      document.removeEventListener('mousedown', this.onOutsideClick, true);
    } else {
      document.detachEvent('onmousedown', this.onOutsideClick);
    }
  }

  onOutsideClick(e) {
    e = e || window.event;
    const mouseTarget = (typeof e.which !== "undefined") ? e.which : e.button;
    const isDescendantOfRoot = ReactDOM.findDOMNode(this.socialLink).contains(e.target);
    if (!isDescendantOfRoot && mouseTarget === 1) {
      this.setState({ active: false });
    }
  }

  render() {
    const { onChange, social } = this.props;
    const { active } = this.state;
    const { icon, name, url } = social;

    return (
      <div
        onClick={this.onActive}
        ref={ref => this.socialLink = ref}
        className={`resume_link ${validator.url(url) ? 'active' : ''}`}>
        <img src={require(`IMAGES/${icon}`)} alt={name}/>
        <Tipso show={active}>
          <div className="project_link_wrapper">
            <i className="fa fa-link" aria-hidden="true"></i>
            &nbsp;&nbsp;
            <Input
              value={url}
              type="url"
              style="borderless underline"
              placeholder="填写链接地址"
              onChange={onChange}
            />
          </div>
        </Tipso>
      </div>
    )
  }
}

export default SocialLink
