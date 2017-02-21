
import Orgs from './schema';

/**
 * private
 */
const getOrgInfo = (orgInfo) => {
  const {
    login,
    name,
    avatar_url,
    company,
    blog,
    location,
    email,
    description,
    created_at,
    updated_at,
    public_repos,
    public_gists,
    followers,
    following
  } = orgInfo;
  const newOrgInfo = {
    login,
    name,
    avatar_url,
    company,
    blog,
    location,
    email,
    bio,
    created_at,
    updated_at,
    public_repos,
    public_gists,
    followers,
    following
  };
  return newOrgInfo;
};

const findOrgByLogin = async (login) => {
  return await Orgs.findOne({ 'orgInfo.login': login });
};

const createOrg = async (orgInfo) => {
  const newOrgInfo = getOrgInfo(orgInfo);
  const { login } = userInfo;

  const findOrg = await findOrgByLogin(login);
  if (findOrg) {
    findOrg.orgInfo = Object.assign({}, findOrg.orgInfo, newOrgInfo);
    await findOrg.save();
    return Promise.resolve({
      success: true,
      result: findOrg
    });
  }

  const newOrg = await User.create({
    orgInfo: newOrgInfo
  });

  return Promise.resolve({
    success: true,
    result: newOrg || null
  });
}

export default {
  find: findOrgByLogin
}
