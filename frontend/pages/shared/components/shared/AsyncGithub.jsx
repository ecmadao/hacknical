
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default asyncComponent(
  () => System.import('SHARED/components/GitHub/Desktop')
    .then(component => component.default)
)
