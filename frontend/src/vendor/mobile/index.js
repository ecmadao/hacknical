import './mobile.css';

$(() => {

  const pathname = window.location.pathname;
  $('.menu').each((index, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    if (href === pathname || (href === '/user/dashboard' && new RegExp('github').test(pathname))) {
      $el.addClass('active');
    }
  });

  const changeOverflow = (overflow) => {
    $('body').css('overflow-y', overflow);
  };

  const $menuIcon = $('.mobile_menu_icon');
  const $menuWrapper = $('.mobile_menu_wrapper');

  $menuIcon.on('click', () => {
    $menuWrapper.addClass('active');
  });

  $menuWrapper.on('click', () => {
    $menuWrapper.removeClass('active');
  });
});
