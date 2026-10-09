
import { injectReducer } from '../../redux/reducer'
import reducer from './redux/reducers'
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default (store, options) => {
  const { login, device } = options

  const isMobile = (device || '').toLowerCase() === 'mobile'
  const SettingComponent = asyncComponent(
    isMobile
      ? () => import('./Components/Mobile').then((component) => {
        injectReducer(store, { key: 'setting', reducer })
        return component.default
      })
      : () => import('./Components/Desktop').then((component) => {
        injectReducer(store, { key: 'setting', reducer })
        return component.default
      })
  )

  return {
    path: `/${login}/setting`,
    component: SettingComponent
  }
}
