
import 'SRC/vendor/500.css'
import 'STYLES/fonts-hack.css'
import Rock from 'PAGES/initial/rock'

$(() => {
  const $content = $('.content-wrapper')
  const rock = new Rock($content, 50)
  rock
    .roll({ chars: '$ some terrible things happened.. ' })
    .then(instance => instance.roll({ chars: '$ cd /home/bed && sleep' }))
    .then(instance => instance.loading())
    .then(instance => instance.wait(3000))
    .then(instance => instance.roll({ chars: 'PS:' }))
    .then(instance => instance.roll({ chars: 'NOBODY EXISTS ON PURPOSE' }))
    .then(instance => instance.roll({ chars: 'NOBODY BELONGS ANYWHERE' }))
    .then(instance => instance.roll({ chars: 'EVERYBODY\'s GONNA DIE' }))
    .then(instance => instance.roll({ chars: 'SO' }))
    .then(instance => instance.loading())
    .then(instance => instance.wait(2000))
    .then(instance => instance.roll({ chars: 'WHAT WOULD U DO IF U WEREN\'T AFRAID?' }))
})
