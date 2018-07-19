import React from 'react';
import cx from 'classnames';
import github from 'UTILS/github';
import dateHelper from 'UTILS/date';
import SocialInfo from 'COMPONENTS/GitHub/SocialInfo';
import styles from '../styles/info_card.css';
import locales from 'LOCALES';

const githubTexts = locales('github.sections.baseInfo');

const UserInfo = (props) => {
  const { user, className } = props;
  if (!user) return <div />;
  return (
    <div className={cx(styles.info_card, className)}>
      <div className={styles.info_header}>
        <div className={styles.info_avator}>
          <img src={user.avatar_url} role="presentation" />
        </div>
        <div className={styles.info_user}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${github.baseUrl}/${user.login}`}
          >
            {user.name || user.login}
          </a>
          <span>
            {githubTexts.joinedAt}{dateHelper.validator.fullDate(user.created_at)}
          </span>
          {user.bio ? <blockquote>{user.bio}</blockquote> : null}
        </div>
      </div>
      <SocialInfo user={user} />
    </div>
  );
};

UserInfo.defaultProps = {
  className: ''
};

export default UserInfo;
