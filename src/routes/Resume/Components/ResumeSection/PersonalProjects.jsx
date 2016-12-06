import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import Textarea from 'COMPONENTS/Textarea';
import Button from 'COMPONENTS/Button';

import actions from '../../redux/actions';

class PersonalProjects extends React.Component {
  render() {
    return (
      <div>
        <div>
          <div className="resume_piece_container">
            <div className="resume_wrapper">
              <Textarea />
            </div>
          </div>
        </div>
        <Button
          style="flat"
          value="添加个人项目"
          leftIcon={(
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
          )}
          onClick={() => {}}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {personalProjects} = state.resume;
  return {...personalProjects}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProjects);
