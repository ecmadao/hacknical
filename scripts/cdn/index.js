import qiniu from 'qiniu';
import config from 'config';
import klawSync from 'klaw-sync';
import PATH from '../path.js';
import CONFIG_PATH from '../../config/path';

const BucketName = config.get('qiniu.BucketName');
const AccessKey = config.get('qiniu.AccessKey');
const SecretKey = config.get('qiniu.SecretKey');

qiniu.conf.ACCESS_KEY = AccessKey;
qiniu.conf.SECRET_KEY = SecretKey;

const getFiles = () => {
  const files = klawSync(PATH.PUBLIC_PATH, { nodir: true })
    .map(item => item.path)
    .filter(path => path.split('/').slice(-1)[0][0] !== '.')
    .filter(path => !/\/downloads\//.test(path));
  return files;
};

const uptoken = (bucket, key) => {
  const putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${key}`);
  return putPolicy.token();
};

const fileUploader = async (token, key, localFile) => {
  for (let i = 0; i < 3; i += 1) {
    try {
      await uploadFile(token, key, localFile);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
  throw new Error('Upload error');
};

const uploadFile = (token, key, localFile) => {
  const extra = new qiniu.io.PutExtra();
  return new Promise((resolve, reject) => {
    qiniu.io.putFile(token, key, localFile, extra, (err, ret) => {
      if (!err) {
        // 上传成功， 处理返回值
        console.log('Upload success!', ret.hash, ret.key);
        resolve(true);
      } else {
        // 上传失败， 处理返回代码
        console.log('Upload Error!', err);
        reject(false);
      }
    });
  });
}

const pushToCDN = async () => {
  const files = getFiles();
  for (let i = 0; i < files.length; i += 1) {
    const fullpath = files[i];
    const file = fullpath.replace(PATH.PUBLIC_PATH, '');
    const key = `${CONFIG_PATH.CDN_URI}${file}`;
    const token = uptoken(BucketName, key);

    try {
      await fileUploader(token, key, fullpath);
    } catch (e) {
      console.log('PushToCDN Error!', e);
      return false;
    }
  }
  return true;
};

const deployCdn = async (times = 3) => {
  let result = true;
  for (let i = 0; i < times; i += 1) {
    console.log(`[DEPLOY TO CDN][TYRING ${i + 1} TIMES]`);
    result = await pushToCDN();
    if (result) break;
  }
  if (!result) {
    console.log('[DEPLOY TO CDN][ERROR:PLEASE RETRY LATER]');
  }
};

deployCdn();
