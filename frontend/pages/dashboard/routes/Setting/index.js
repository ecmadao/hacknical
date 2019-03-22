
import { injectReducer } from '../../redux/reducer'
import reducer from './redux/reducers'
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default (store, options) => {
  const { login, device } = options

  const SettingComponent = asyncComponent(
    () => System.import(`./Components/${device[0].toUpperCase()}${device.slice(1).toLowerCase()}`)
      .then((component) => {
        injectReducer(store, { key: 'setting', reducer })
        return component.default
      })
  )

  return {
    path: `/${login}/setting`,
    component: SettingComponent
  }
}
