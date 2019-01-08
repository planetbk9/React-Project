import React, { Component } from 'react';
import ViewerTemplate from './components/ViewerTemplate';
import Viewer from './components/Viewer';
import SpaceNavigator from './components/SpaceNavigator';
import moment from 'moment';

import * as api from './lib/api.js';

class App extends Component {
  state={
    maxDate: null,
    date: '2019-01-08',
    url: '',
    mediaType: '',
    loading: false
  }

  getAPOD = async (date) => {
    if(this.state.loading) return;

    this.setState({
      loading: true
    });

    try {
      const response = await api.getAPOD(date);
      const { date: retrievedDate, url, media_type: mediaType} = response.data;

      if(!this.state.maxDate) {
        this.setState({
          maxDate: retrievedDate
        });
      }

      this.setState({
        date: retrievedDate,
        url,
        mediaType
      });
    } catch(e) {
      console.warn(e);
      return;
    }
    
    this.setState({
      loading: false
    });
  };
  
  componentDidMount() {
    this.getAPOD();
  }
  
  handlePrev = () => {
    const { date } = this.state;
    const newDate = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
    console.log(newDate);
    this.getAPOD(newDate);
  }

  handleNext = () => {
    const { date, maxDate } = this.state;
    if(date === maxDate) return;
    const newDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
    console.log(newDate);
    this.getAPOD(newDate);
  }

  render() {
    const { handlePrev, handleNext } = this;
    return (
      <div>
        <ViewerTemplate 
          viewer={<Viewer data={this.state}/>}
          spaceNavigator={<SpaceNavigator onPrev={handlePrev} onNext={handleNext}/>} />
      </div>
    );
  }
}

export default App;
