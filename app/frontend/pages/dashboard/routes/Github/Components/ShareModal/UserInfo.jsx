import React from 'react';
import { GREEN_COLORS } from 'UTILS/colors';
import SocialInfo from '../shared/SocialInfo';

const UserInfo = (props) => {
  const { user } = props;
  return (
    <div className="share_info_section share_user_info">
      <img src={user['avatar_url']} /><br/>
      <span>{user.name}, 加入于 {user['created_at'].split('T')[0]}</span>
      {user.bio ? <blockquote>{user.bio}</blockquote> : ''}
      <SocialInfo
        user={user}
        showLink={false}
        style={{
          border: '1px solid #adb5bd',
          margin: '15px 15px'
        }}
        mainTextStyle={{
          color: '#495057',
          fontSize: '2em'
        }}
        sideTextStyle={{
          color: '#adb5bd',
          fontSize: '16px'
        }}
      />
    </div>
  )
};

export default UserInfo;
