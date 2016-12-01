export const hex2Rgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error("Invaild Hex String");
  }
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    // return result ? {
    //     r: parseInt(result[1], 16),
    //     g: parseInt(result[2], 16),
    //     b: parseInt(result[3], 16)
    // } : null;

  // let newHex;
  // if (/^#/.test(hex)) {
  //   newHex = hex.slice(1);
  // } else {
  //   newHex = hex;
  // }
  // if (newHex.length !== 3 && newHex.length !== 6) {
  //   throw new Error("Invaild newHex String");
  // }
  // let digit = newHex.split("");
  // if (digit.length === 3) {
  //   digit = [digit[0], digit[0], digit[1], digit[1], digit[2], digit[2]];
  // }
  // const r = parseInt([digit[0], digit[1]].join(""), 16);
  // const g = parseInt([digit[4], digit[5]].join(""), 16);
  // const b = parseInt([digit[2], digit[3]].join(""), 16);
  // return `${r}, ${g}, ${b}`;
};

export const hex2Rgba = (hex) => (opacity) => {
  const rgb = hex2Rgb(hex);
  return `rgba(${rgb}, ${opacity})`;
};
