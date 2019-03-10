import React, { Component } from 'react';
import './Subject.scss';

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
    if(e.code === 'Enter') this.handleSubmit(e);
  }
  render() {
    const { subjects, onKeyControl } = this.props;
    return (
      <div className="subject-inner-container">
        <header>
          주제
        </header>
        <form className="subject-input" onSubmit={this.handleSubmit}>
          <input className="subject-input-text" type="text" placeholder="새로운 주제를 입력하세요." onChange={this.handleChange} value={this.state.input} onKeyPress={this.handleKeyPress} onFocus={() => onKeyControl(0)} onBlur={() => onKeyControl(1)}></input>
          <button className="subject-input-button" type="submit"><i className="fas fa-play"></i></button>
        </form>
        <main>
          {subjects}
        </main>
      </div>
    );
  }
}

export default Subject;