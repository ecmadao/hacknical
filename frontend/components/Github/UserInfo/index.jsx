import React from 'react';
import cx from 'classnames';
import github from 'UTILS/github';
import SocialInfo from 'COMPONENTS/Github/SocialInfo';
import styles from '../styles/info_card.css';

const UserInfo = (props) => {
  const { user } = props;
  if (!user) { return (<div></div>) }
  return (
    <div className={styles["info_card_container"]}>
      <p><i aria-hidden="true" className="fa fa-vcard-o"></i>&nbsp;&nbsp;基本信息</p>
      <div className={styles["info_card"]}>
        <div className={styles["info_header"]}>
          <div className={styles["info_avator"]}>
            <img src={user['avatar_url']} />
          </div>
          <div className={styles["info_user"]}>
            <a href={`${github.baseUrl}/${user.login}`} target="_blank">{user.name || user.login}</a>
            <span>加入时间：{user['created_at'].split('T')[0]}</span>
            {user.bio ? <blockquote>{user.bio}</blockquote> : ''}
          </div>
        </div>
        <SocialInfo user={user} />
      </div>
    </div>
  )
};

export default UserInfo;
