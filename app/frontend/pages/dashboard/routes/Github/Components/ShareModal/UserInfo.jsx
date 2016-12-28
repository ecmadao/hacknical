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
        style={{
          color: '#adb5bd',
          border: `1px solid #adb5bd`
        }}
      />
    </div>
  )
};

export default UserInfo;
