
export const observer = (action, options = {}) => {
  let timeout = null;
  const { interval = 3000 } = options;

  return (dispatch, ...args) => {
    if (timeout) return;
    dispatch(action(...args));
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      timeout = null;
    }, interval);
  };
};
