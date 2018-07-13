
import { MD_COLORS } from './constant';

export const hex2Rgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    console.error('Invaild Hex String');
    return '0, 0, 0';
  }
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

export const hex2Rgba = hex =>
  opacity => `rgba(${hex2Rgb(hex)}, ${opacity})`;

export const randomColor = () => {
  const map = new Map();
  let colors = [...MD_COLORS];

  const getRamdomColor = (key) => {
    if (map.has(key)) return map.get(key);
    if (!colors.length) colors = [...MD_COLORS];

    const index = Math.floor(Math.random() * colors.length);
    const color = colors[index];
    colors = [...colors.slice(0, index), ...colors.slice(index + 1)];

    map.set(key, color);
    return color;
  };

  return getRamdomColor;
};
