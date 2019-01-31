import React from 'react';

const AppTemplate = ({TimeManagerContainer, HistoryContainer}) => {
  return (
    <div>
      <TimeManagerContainer />
      <HistoryContainer />
    </div>
  );
};

export default AppTemplate;