
import React from 'react';
import cx from 'classnames';
import { AnimationComponent } from 'light-ui';
import locales from 'LOCALES';
import API from 'API';
import styles from './notify.css';
import dateHelper from 'UTILS/date';
import { URLS, EMOJI } from 'UTILS/constant';
import { random, observer } from 'UTILS/helper';

const getEmoji = () => {
  const keys = Object.keys(EMOJI);
  const key = random(keys);
  return EMOJI[key];
};

const emoji = getEmoji();
const notifyLocales = locales('datas.notify');
const getFullDate = dateHelper.validator.fullDate;
const upvote = observer(API.user.upvote);
const downvote = observer(API.user.downvote);

const getHeadline = date =>
  notifyLocales.headline.replace('%s', getFullDate(date));

const renderSections = text =>
  text.split(/(?:\r\n|\r|\n)/g).map((section, index) => (
    <span key={index}>
      {section}
      <br/>
    </span>
  ));

const _NotifyContent = (props) => {
  const {
    status,
    onClose,
    messages,
    onTransitionEnd
  } = props;

  const message = messages[0];
  return (
    <div
      className={cx(
        styles.notify,
        styles[`notify-${status}`]
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={styles.close} onClick={onClose}>
        <i
          className="fa fa-close"
          aria-hidden="true"
        />
      </div>
      <div className={styles.header}>
        {emoji}&nbsp;{message.headline || getHeadline(message.date)}
      </div>
      <div className={styles.content}>
        {renderSections(message.content)}
      </div>
      <div className={styles.bottom}>
        <div className={styles.operations}>
          <i
            className="fa fa-thumbs-o-up"
            onClick={() => upvote(message.id)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <i
            className="fa fa-thumbs-o-down"
            onClick={() => downvote(message.id)}
          />
        </div>
        <div className={styles.bottomLink}>
          <a
            target="_blank"
            className={styles.link}
            rel="noopener noreferrer"
            href={`${URLS.ISSUE}/new`}
          >
            {notifyLocales.feedback}
          </a>
        </div>
      </div>
    </div>
  );
};

const NotifyContent = props => (
  <AnimationComponent>
    <_NotifyContent {...props} />
  </AnimationComponent>
);

export default NotifyContent;
