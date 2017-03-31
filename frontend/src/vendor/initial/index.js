import Api from 'API';
import './styles/index.css';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const renderChars = async (chars, doms = {}) => {
  const $info = doms.$info || null;
  const $cursor = doms.$cursor || null;
  const setChar = async (char) => await $info.html(char);

  $cursor.removeClass('cursor-animation');
  for (let i = 0; i <= chars.length; i++) {
    const char = chars.slice(0, i);
    await wait(100);
    await setChar(char);
  }
  $cursor.addClass('cursor-animation');
};

const appendLoading = (target) => {

};

export default renderChars;
