
import 'STYLES/fonts-hack.css'
import renderApp from 'PAGES/error'

$(() => {
  $(document).bind('contextmenu', () => false)

  renderApp('error', {
    wordLines: [
      '$ some terrible things happened',
      '$ cd /home/bed && sleep',
      '$ PS',
      '$ NOBODY EXISTS ON PURPOSE',
      '$ NOBODY BELONGS ANYWHERE',
      '$ EVERYBODY\'s GONNA DIE',
      '$ SO, WHAT WOULD U DO IF U WEREN\'T AFRAID?'
    ]
  })
})
