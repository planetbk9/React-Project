import React, { Component } from 'react';
import './Main.scss';

class Main extends Component {
  adjOpacity = () => {
    document.getElementById('main-container').style.opacity = (1000-window.scrollY)/1000;
  }
  componentDidMount() {
    window.addEventListener('scroll', this.adjOpacity);
    this.imgObj = {
      1: require('resource/main1.jpg'),
      2: require('resource/main2.jpg'),
      3: require('resource/main3.jpg'),
      4: require('resource/main4.jpg'),
      5: require('resource/main5.jpg')
    };
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.adjOpacity);
  }
  render() {
    const num = Math.floor((Math.random()*5)+1);
    const img = !this.imgObj ? require(`resource/main${num}.jpg`) : this.imgObj[num];

    return (
      <div id="main-container" className="main-container">
        <img src={img} alt="main" align="middle"/>
      </div>
    );
  }
}

export default Main;