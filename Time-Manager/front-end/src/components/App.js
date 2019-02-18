import React, { Component } from 'react';
import './App.scss';
import AppTemplate from './AppTemplate';
import StopWatchContainer from 'containers/StopWatchContainer';
import HistoryContainer from 'containers/HistoryContainer';
import SubjectContainer from 'containers/SubjectContainer';
import store from 'store';
import { Provider } from 'react-redux';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppTemplate 
        StopWatchContainer={StopWatchContainer}
          HistoryContainer={HistoryContainer}
          SubjectContainer={SubjectContainer}/>
      </Provider>
    );
  }
}

export default App;