import config from 'config';
import CDN from './cdn';

const vendorPath = (vendorName) => {
  return `${CDN.URL}/vendor/${vendorName}`;
};

export default vendorPath;
