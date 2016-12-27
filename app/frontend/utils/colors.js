// export const BLUE_COLORS = [
//   'rgba(41, 128, 185, 1)',
//   'rgba(41, 128, 185, 0.8)',
//   'rgba(41, 128, 185, 0.6)',
//   'rgba(41, 128, 185, 0.4)',
//   'rgba(41, 128, 185, 0.2)'
// ];

export const BLUE_COLORS = [
  'rgba(52, 143, 223, 1)',
  'rgba(52, 143, 223, 0.8)',
  'rgba(52, 143, 223, 0.6)',
  'rgba(52, 143, 223, 0.4)',
  'rgba(52, 143, 223, 0.2)'
];

export const GREEN_COLORS = [
  'rgba(68, 163, 64, 1)',
  'rgba(68, 163, 64, 0.8)',
  'rgba(68, 163, 64, 0.6)',
  'rgba(68, 163, 64, 0.4)',
  'rgba(68, 163, 64, 0.2)'
];

export const GITHUB_GREEN_COLORS = [
  '#1e6823',
  '#44a340',
  '#8cc665',
  '#d6e685',
  '#eee'
];

export const hex2Rgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error("Invaild Hex String");
  }
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

export const hex2Rgba = (hex) => (opacity) => {
  const rgb = hex2Rgb(hex);
  return `rgba(${rgb}, ${opacity})`;
};
