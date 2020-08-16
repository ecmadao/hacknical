
import { injectReducer } from '../../redux/reducer'
import reducer from './redux/reducers'
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default (store, options) => {
  const { login, device } = options

  const resumeComponent = {
    desktop: asyncComponent(
      () => System.import('./Components')
        .then((component) => {
          injectReducer(store, { key: 'resume', reducer })
          return component.default
        })
    ),
    mobile: asyncComponent(
      () => System.import('SHARED/components/Resume')
        .then(component => component.default)
    )
  }

  const ResumeComponent = resumeComponent[device]
  return {
    path: `/${login}/archive`,
    component: ResumeComponent
  }
}
