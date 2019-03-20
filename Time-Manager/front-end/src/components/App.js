import React, { Component } from 'react';
import './App.scss';
import AppTemplate from './AppTemplate';
import HeaderContainer from 'containers/HeaderContainer';
import StopWatchContainer from 'containers/StopWatchContainer';
import HistoryContainer from 'containers/HistoryContainer';
import SubjectContainer from 'containers/SubjectContainer';
import ReportContainer from 'containers/ReportContainer';
import Main from 'components/Main';
import Footer from 'components/Footer';
import store from 'store';
import { Provider } from 'react-redux';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppTemplate 
          HeaderContainer={HeaderContainer}
          Main={Main}
          StopWatchContainer={StopWatchContainer}
          HistoryContainer={HistoryContainer}
          SubjectContainer={SubjectContainer}
          ReportContainer={ReportContainer}
          Footer={Footer}/>
      </Provider>
    );
  }
}

export default App;