import React from 'react'
import Loading from './Loading'

class Todo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      newItem: ''
    }

    this.onAddItem = this.onAddItem.bind(this)
    this.onDeleteItem = this.onDeleteItem.bind(this)
    this.onToggleItem = this.onToggleItem.bind(this)
    this.onKeyPressForInput = this.onKeyPressForInput.bind(this)
  }

  onAddItem (event) {
    event.stopPropagation()
    this.props.onAddItem(this.state.newItem)
    this.setState({
      newItem: ''
    })
  }

  onDeleteItem (event, item) {
    event.stopPropagation()
    this.props.onDeleteItem(item)
  }

  onToggleItem (event, item) {
    event.stopPropagation()
    this.props.onToggleItem(item)
  }

  onKeyPressForInput (event) {
    if (event.key === 'Enter') {
      this.onAddItem(event)
    }
  }

  render () {
    let items
    if (this.props.loading) {
      items = (
        <li><Loading message="Loading" /></li>
      )
    } else {
      items = this.props.items.map((item, index) => (
        <li
          key={ index }
          className={ item.done ? 'checked' : '' }
          onClick={ event => {
            if (this.props.editable){
              this.onToggleItem(event, item)
            }
          }}
        >
          { item.value }
          { this.props.editable && (
            <span className="close" onClick={ event => this.onDeleteItem(event, item) }>
              &times;
            </span>
          )}
        </li>
      ))
    }

    return (
      <div className="todo">
        <div className="header">        
          <h2>
            <span role="img" aria-label="">✔️</span>&nbsp;
            Decentralized <strong>To Do</strong> list</h2>
          <input          
            value={ this.state.newItem }
            onChange={ event => this.setState({ newItem: event.target.value }) }
            onKeyPress={ this.onKeyPressForInput }
            disabled={ !this.props.editable }
            type="text" id="myInput" placeholder="Title..."
          />
          <button
            onClick={ this.onAddItem }
            disabled={ !this.props.editable }
            className="btn addBtn">
            Add
          </button>
        </div>

        <ul>
          { items }
        </ul>
        <div>
          <input
             type="text"
            
          />
        </div>
      </div>
    )
  }
}

export default Todo