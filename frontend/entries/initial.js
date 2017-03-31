import renderChars from 'SRC/vendor/initial';

$(() => {
  $(document).bind("contextmenu", (e) => {
    return false;
  });

  const $section = $('.content-section').last();
  renderChars(
    'contextmenucontextmenucontextmenucontextmenu',
    {
      $info: $section.find('.content-info'),
      $cursor: $section.find('.content-cursor')
    }
  );
});
