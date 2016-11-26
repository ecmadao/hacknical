import React from 'react';
import GitHubCalendar from 'github-calendar';
import 'github-calendar/dist/github-calendar.css';
import '../styles/github.css';
import Loading from 'COMPONENTS/Loading';

class Github extends React.Component {
  componentDidMount() {
    GitHubCalendar(".calendar", "ecmadao");
  }

  render() {
    return (
      <div className="github_info_container">
        <div className="calendar github_calendar">
          <Loading />
        </div>
      </div>
    )
  }
}

export default Github;
