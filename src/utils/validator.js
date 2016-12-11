import validator from 'validator';

const email = value => validator.isEmail(value);

const phone = value => validator.isMobilePhone(value, 'zh-CN');

const empty = value => validator.isEmpty(value);

const number = value => validator.isInt(value, {
  min: 1000,
  max: 99999
});

const url = value => validator.isURL(value);

const string = value => validator.isByteLength(value, {
  min: 1,
  max: 300
});

export default {
  email,
  phone,
  url,
  string,
  number
}
