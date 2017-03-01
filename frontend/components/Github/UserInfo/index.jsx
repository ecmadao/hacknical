import React from 'react';
import cx from 'classnames';
import github from 'UTILS/github';
import dateHelper from 'UTILS/date';
import SocialInfo from 'COMPONENTS/Github/SocialInfo';
import styles from '../styles/info_card.css';
import locales from 'LOCALES';

const githubTexts = locales('github').sections.baseInfo;

const UserInfo = (props) => {
  const { user, className } = props;
  if (!user) { return (<div></div>) }
  return (
    <div className={cx(styles["info_card"], className)}>
      <div className={styles["info_header"]}>
        <div className={styles["info_avator"]}>
          <img src={user['avatar_url']} />
        </div>
        <div className={styles["info_user"]}>
          <a href={`${github.baseUrl}/${user.login}`} target="_blank">{user.name || user.login}</a>
          <span>{githubTexts.joinedAt}{dateHelper.validator.fullDate(user['created_at'])}</span>
          {user.bio ? <blockquote>{user.bio}</blockquote> : ''}
        </div>
      </div>
      <SocialInfo user={user} />
    </div>
  )
};

UserInfo.defaultProps = {
  className: ''
};

export default UserInfo;
