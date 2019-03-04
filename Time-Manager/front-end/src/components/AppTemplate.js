import React from 'react';
import './AppTemplate.scss';

const AppTemplate = ({StopWatchContainer, HistoryContainer, SubjectContainer}) => {
  return (
    <div className="template-container">
      <header className="template-header">
        <div className="template-header-subject"><i class="far fa-clock"></i> 타임매니저</div>
        <nav className="template-header-nav">
          <ul>
            <li>Home</li>
            <li>Report</li>
            <li>Login</li>
          </ul>
        </nav>
      </header>
      <div className="content-container">
        <div className="subject-container">
          <SubjectContainer />
        </div>
        <div className="time-history-container">
          <StopWatchContainer />
          <HistoryContainer />
        </div>
      </div>
      <footer>
        <div>Reference:&nbsp;<strong><a href="https://github.com/planetbk9/React-Project/tree/master/Time-Manager">github</a></strong></div>
        <div className="footer-item-right">Contact:&nbsp;<strong>planetbk9@gmail.com</strong></div>
      </footer>
    </div>
  );
};

export default AppTemplate;