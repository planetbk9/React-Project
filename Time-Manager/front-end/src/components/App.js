import React, { Component } from 'react';
import './App.scss';
import AppTemplate from './AppTemplate';
import TimeManagerContainer from 'containers/TimeManagerContainer';
import HistoryContainer from 'containers/HistoryContainer'
import store from 'store';
import { Provider } from 'react-redux';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppTemplate 
          TimeManagerContainer={TimeManagerContainer}
          HistoryContainer={HistoryContainer}/>
      </Provider>
    );
  }
}

export default App;