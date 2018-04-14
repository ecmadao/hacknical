
export const wrapMsg = ({ message, type, url }) => {
  const msg = {
    data: message,
    channel: {
      url,
      type,
    },
  };
  return JSON.stringify(msg);
};
