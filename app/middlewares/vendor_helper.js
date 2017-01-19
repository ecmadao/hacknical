import config from 'config';

const CDN = config.get('cdn');
const vendorPath = (vendorName) => {
  return `${CDN}/vendor/${vendorName}`;
};
