const getOwnPropertySymbols = Object.getOwnPropertySymbols;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;

const toObject = (val) => {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
};

const objectAssign = (...args) => {
  const to = toObject(args[0]);

  args.slice(1).forEach((arg) => {
    const from = Object(arg);

    Object.keys(from).forEach((key) => {
      to[key] = from[key];
    });

    if (getOwnPropertySymbols) {
      const symbols = getOwnPropertySymbols(from);
      symbols.forEach((symbol) => {
        if (propIsEnumerable.call(from, symbol)) {
          to[symbol] = from[symbol];
        }
      });
    }
  });

  return to;
};

export default objectAssign;
