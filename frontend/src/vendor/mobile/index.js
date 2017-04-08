import './mobile.css';

$(() => {
  const pathname = window.location.pathname;
  $('.menu').each((index, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    if (
      href === pathname
      || (href === '/dashboard' && new RegExp('github').test(pathname))
      || (href === '/resume/sharePage' && new RegExp('resume').test(pathname))
    ) {
      $el.addClass('active');
    }
  });

  const $menuIcon = $('.mobile_menu_icon');
  const $menuWrapper = $('.mobile_menu_wrapper');

  const changeOverflow = (overflow) => {
    $('body').css('overflow-y', overflow);
  };

  const changeMenuIcon = (iconClass) => {
    const $icon = $menuIcon.find('i');
    $icon.removeClass().addClass(`fa fa-${iconClass}`);
  };

  $menuIcon.on('click', () => {
    changeMenuIcon('close');
    $menuWrapper.addClass('active');
    changeOverflow('hidden');
  });

  $menuWrapper.on('click', () => {
    changeMenuIcon('navicon');
    $menuWrapper.removeClass('active');
    changeOverflow('auto');
  });
});
