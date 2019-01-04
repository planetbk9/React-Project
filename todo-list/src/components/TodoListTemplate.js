import React, { Component } from 'react';
import './TodoListTemplate.css';
import Palette from './Palette';

class TodoListTemplate extends Component {
  render() {
    const { value, colors, curColor, children, handleCreate, handleChange, handleKeyPress, handleColor } = this.props;
    return (
      <main className="todo-container">
        <section className="todo-header">
          <h1>Todo-List</h1>
        </section>
        <Palette colors={colors} curColor={curColor} handleColor={handleColor}/>
        <section className="todo-form">
          <input className="todo-input" value={value} onChange={handleChange} onKeyPress={handleKeyPress} style={{color: curColor}}/>
          <button onClick={handleCreate}>Enter</button>
        </section>
        <section className="todo-item-wrapper">
          {children}
        </section>
      </main>
    );
  }
}

export default TodoListTemplate;