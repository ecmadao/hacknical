import initUser from './init-user';

const init = async () => {
  await initUser();
  process.exit();
};

init();
