import React, {Component} from 'react';
import './TodoItem.css';

class TodoItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.checked !== nextProps.checked;
  }

  render() {
    const { id, text, checked, color, handleCheck, handleRemove } = this.props;
    return (
      <div className="todo-item-container">
        <div className="item-remove" onClick={() => handleRemove(id)}>&times;</div>
        <div className={`item-text ${checked && 'checked'}`} onClick={() => handleCheck(id)} style={{color: color}}>{text}</div>
        {checked && <div className="item-checked">&#10003;</div>}
      </div>
    );
  }
}

export default TodoItem;