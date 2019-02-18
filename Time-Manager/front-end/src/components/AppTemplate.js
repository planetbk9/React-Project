import React from 'react';
import './AppTemplate.scss';

const AppTemplate = ({StopWatchContainer, HistoryContainer, SubjectContainer}) => {
  return (
    <div className="template-container">
      <div className="subject-container">
        <SubjectContainer />
      </div>
      <div className="time-history-container">
        <StopWatchContainer />
        <HistoryContainer />
      </div>
    </div>
  );
};

export default AppTemplate;