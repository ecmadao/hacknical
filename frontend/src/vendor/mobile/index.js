import './mobile.css';

$(() => {
  const { pathname } = window.location;
  $('.menu').each((index, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    if (
      href === pathname
      || (new RegExp('github').test(href) && new RegExp('github').test(pathname))
      || (new RegExp('resume').test(href) && new RegExp('resume').test(pathname))
    ) {
      $el.addClass('active');
    }
  });

  const $menuIcon = $('.mobile_menu_icon');
  const $closeIcon = $('.mobile_menu_close');
  const $menuWrapper = $('.mobile_menu_wrapper');

  const changeOverflow = (overflow) => {
    $('body').css('overflow-y', overflow);
  };

  $menuIcon.on('click', () => {
    $menuWrapper.addClass('active');
    changeOverflow('hidden');
  });

  $closeIcon.on('click', () => {
    $menuWrapper.removeClass('active');
    changeOverflow('auto');
  });
});
