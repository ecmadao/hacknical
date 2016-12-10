import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import actions from '../../redux/actions';
import WritableList from 'COMPONENTS/WritableList';
import Labels from 'COMPONENTS/Labels';
import Input from 'COMPONENTS/Input';
import FormatInput from 'COMPONENTS/FormatInput';

class Others extends React.Component {
  constructor(props) {
    super(props);
    this.addSupplement = this.addSupplement.bind(this);
    this.deleteSupplement = this.deleteSupplement.bind(this);
    this.changeSupplement = this.changeSupplement.bind(this);
    this.handleOthersChange = this.handleOthersChange.bind(this);
  }

  handleOthersChange(key) {
    const { actions } = this.props;
    return (value) => {
      actions.handleOthersInfoChange({[key]: value})
    }
  }

  addSupplement(value) {
    this.props.actions.addSupplement(value);
  }

  deleteSupplement(index) {
    this.props.actions.deleteSupplement(index);
  }

  changeSupplement(value, index) {
    this.props.actions.changeSupplement(value, index);
  }

  render() {
    const {
      dream,
      expectSalary,
      expectPosition,
      supplements,
      expectLocation
    } = this.props;

    return (
      <div>
        <div className="resume_piece_container">
          <div className="resume_title">
            其他补充
          </div>
          <div className="resume_wrapper">
            <FormatInput
              value={expectSalary}
              placeholder="期望薪资"
              formatType="number"
              style="flat"
              className="input-expect-salary"
              onChange={this.handleOthersChange('expectSalary')}
            />
            <Input
              value={expectPosition}
              placeholder="期望职位"
              style="flat"
              onChange={this.handleOthersChange('expectPosition')}
            />
            <Input
              value={expectLocation}
              placeholder="期望城市"
              style="flat"
              onChange={this.handleOthersChange('expectLocation')}
            />
          </div>
          <div className="resume_wrapper">
            <Input
              value={dream}
              placeholder="你的梦想？"
              style="flat"
              onChange={this.handleOthersChange('dream')}
            />
          </div>
          <WritableList
            items={supplements}
            onAdd={this.addSupplement}
            onDelete={this.deleteSupplement}
            onChange={this.changeSupplement}
            placeholder="新增个人介绍"
          />
        </div>
        <div className="resume_piece_container">
          <div className="resume_title">
            链接其他账号
          </div>
          <div className="resume_wrapper">
            <div className="resume_link github">
              <img src={require('IMAGES/github.png')}/>
            </div>
          </div>
        </div>
        <div/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {others} = state.resume;
  return {...others}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Others);
