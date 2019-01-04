import React, { Component } from 'react';
import TodoListTemplate from './components/TodoListTemplate';
import TodoItemList from './components/TodoItemList';

const colors = ['#c92a2a', '#862e9c', '#1864ab', '#0b7285'];

class App extends Component {
  id = 2;
  state = {
    input: '',
    todos: [
      {
        id: 0,
        text: "Hello React",
        checked: false,
        color: colors[0]
      },
      {
        id: 1,
        text: "Making todo-list",
        checked: true,
        color: colors[0]
      }
    ],
    color: colors[0]
  };
  
  handleCreate = () => {
    const { input, todos, color } = this.state;
    this.setState({
      input: '',
      todos: todos.concat({
        id: this.id++,
        text: input,
        checked: false,
        color: color
      })
    });
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') this.handleCreate();
  }

  handleCheck = (id) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.map((todo) => {
        if(todo.id === id) {
          return {...todo, checked: !todo.checked};
        } else {
          return todo;
        }
      })
    });
  }

  handleRemove = (id) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter((todo) => {
        if(todo.id !== id) return true;
      })
    });
  }

  handleColor = (color) => {
    this.setState({
      color: color
    });
  }

  render() {
    const { input, todos, color } = this.state;
    const { handleCreate, handleChange, handleKeyPress, handleCheck, handleRemove, handleColor } = this; 
    return (
      <TodoListTemplate value={input} colors={colors} curColor={color} handleCreate={handleCreate} handleChange={handleChange} handleKeyPress={handleKeyPress} handleColor={handleColor}>
        <TodoItemList todos={todos} handleCheck={handleCheck} handleRemove={handleRemove}/>
      </TodoListTemplate>
    );
  }
}

export default App;
