import React from 'react'
import Header from './Header'
import TabBar from './TabBar'
import Notify from 'COMPONENTS/Notify'
import styles from '../../styles/desktop.css'

const Desktop = (props) => {
  const {
    routes,
    login,
    activeTab,
    tabBarActive,
    changeActiveTab
  } = props

  return (
    <div className={styles.app}>
      <div className={styles.app_top}>
        <Header />
        <TabBar
          login={login}
          activeTab={activeTab}
          tabBarActive={tabBarActive}
          changeActiveTab={changeActiveTab}
        />
        <Notify />
      </div>
      <div className={styles.app_content}>
        <div className={styles.content_container}>
          {routes}
        </div>
      </div>
    </div>
  )
}

export default Desktop
