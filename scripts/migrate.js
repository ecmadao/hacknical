require('babel-core/register')();
require('babel-polyfill');

// TODO:
// migrate share-analysis, use type instead of url
// require('./migrate/resumeHash');
require('./migrate/share');
