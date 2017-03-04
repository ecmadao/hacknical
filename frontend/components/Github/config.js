import CommitInfo from './CommitInfo';
import LanguageInfo from './LanguageInfo';
import RepositoryInfo from './RepositoryInfo';
import OrgInfo from './OrgInfo';
import UserInfo from './UserInfo';
import Hotmap from './Hotmap';

export default {
  hotmap: Hotmap,
  info: UserInfo,
  repos: RepositoryInfo,
  orgs: OrgInfo,
  languages: LanguageInfo,
  commits: CommitInfo
};
