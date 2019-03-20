import React, { Component } from 'react';
import './Subject.scss';
import Enter from 'resource/enter-arrow.png';

class Subject extends Component {
  state = {
    input: ''
  }
  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    
    this.props.onInsert(this.state.input);
    this.setState({
      input: ''
    });
  }
  handleKeyPress = (e) => {
    if(e.keyCode === 13) this.handleSubmit(e);
  }
  render() {
    const { subjects, onKeyControl } = this.props;
    return (
      <div className="subject-container">
        <h2 className="subject-mention">
          활동을 선정하세요!
        </h2>
        <form className="subject-input" onSubmit={this.handleSubmit}>
          <input className="subject-input-text" type="text" placeholder="새로운 주제를 입력하세요." onChange={this.handleChange} value={this.state.input} onKeyPress={this.handleKeyPress} onFocus={() => onKeyControl(0)} onBlur={() => onKeyControl(1)}></input>
          <button className="subject-input-button" type="submit"><img src={Enter} alt="Enter"/></button>
        </form>
        <div className="subject-item-container">
          {subjects}
        </div>
      </div>
    );
  }
}

export default Subject;