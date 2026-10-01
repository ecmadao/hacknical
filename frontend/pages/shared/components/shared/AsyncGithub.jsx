
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default asyncComponent(
  () => import('SHARED/components/GitHub/Desktop')
    .then(component => component.default)
)
