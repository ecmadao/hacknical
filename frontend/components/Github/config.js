import CommitInfo from './CommitInfo';
import LanguageInfo from './LanguageInfo';
import RepositoryInfo from './RepositoryInfo';
import OrgInfo from './OrgInfo';
import UserInfo from './UserInfo';
import Hotmap from './Hotmap';
import CodeCourse from './CodeCourse';
import ContributedInfo from './ContributedInfo';
import Predictions from './Predictions';
import Statistic from './Statistic';

export default {
  hotmap: Hotmap,
  info: UserInfo,
  repos: RepositoryInfo,
  orgs: OrgInfo,
  languages: LanguageInfo,
  commits: CommitInfo,
  course: CodeCourse,
  contributed: ContributedInfo,
  predictions: Predictions,
  statistic: Statistic
};
