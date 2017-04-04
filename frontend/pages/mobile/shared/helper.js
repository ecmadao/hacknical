export const initialSlick = (dom) => {
  $(dom).slick({
    accessibility: false,
    arrows: false,
    slidesToShow: 2,
    mobileFirst: true,
    swipeToSlide: true,
    infinite: false,
    slidesToScroll: 1,
    variableWidth: true
  });
};
