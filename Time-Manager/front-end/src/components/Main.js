import React, { Component } from 'react';
import './Main.scss';
import main1 from 'resource/main1.jpg';
import main2 from 'resource/main2.jpg';
import main3 from 'resource/main3.jpg';
import main4 from 'resource/main4.jpg';
import main5 from 'resource/main5.jpg';

class Main extends Component {
  imgObj = {
    1: main1,
    2: main2,
    3: main3,
    4: main4,
    5: main5
  }
  adjOpacity = () => {
    document.getElementById('main-container').style.opacity = (1000-window.scrollY)/1000;
  }
  componentDidMount() {
    window.addEventListener('scroll', this.adjOpacity);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.adjOpacity);
  }
  render() {
    const num = Math.floor((Math.random()*5)+1);

    return (
      <div id="main-container" className="main-container">
        <img src={this.imgObj[num]} alt="main" align="middle"/>
      </div>
    );
  }
}

export default Main;