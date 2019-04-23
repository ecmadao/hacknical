import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { Tipso } from 'light-ui'
import styles from '../../../styles/desktop.css'
import Icon from 'COMPONENTS/Icon'

const Tab = (props) => {
  const {
    tab,
    login,
    active,
    onChange
  } = props
  const { id, name, icon, enable, tipso } = tab

  const containerClass = cx(
    styles.tab_container,
    enable && styles.enable,
    active && styles.active
  )

  return (
    <Tipso
      position="bottom"
      wrapperClass={containerClass}
      tipsoStyle={{
        transform: 'translate(-50%, 13px)'
      }}
      theme="dark"
      tipsoContent={tipso ? (
        <span className={styles.tab_tipso}>{tipso}</span>
      ) : null}
    >
      <Link
        to={`/${login}/${id}`}
        className={styles.app_tab}
        onClick={e => onChange(e, id, enable)}
      >
        <Icon icon={icon} />
        &nbsp;
        {name}
      </Link>
    </Tipso>
  )
}

export default Tab
