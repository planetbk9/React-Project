import React, {Component} from 'react';
import TodoItem from './TodoItem';

class TodoItemList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.todos !== nextProps.todos;
  }
  render() {
    const { todos, handleCheck, handleRemove } = this.props;

    const todoItems = todos.map((todo) => 
      <TodoItem key={todo.id} id={todo.id} text={todo.text} checked={todo.checked} color={todo.color} handleCheck={handleCheck} handleRemove={handleRemove}/>
    );

    return (
      <div>
        {todoItems}
      </div>
    );
  }
}

export default TodoItemList;