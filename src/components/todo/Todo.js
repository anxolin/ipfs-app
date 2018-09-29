const React = require('react')
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
    const items = this.props.items.map((item, index) => (
      <li
        key={ index }
        className={ item.done ? 'checked' : '' }
        onClick={ event => this.onToggleItem(event, item) }
      >
        { item.value }
        <span className="close" onClick={ event => this.onDeleteItem(event, item) }>
          &times;
        </span>
      </li>
    ))

    return (
      <div className="todo">
        <div className="header">
          <h2>Decentralized todo list</h2>
          <input
            value={ this.state.newItem }
            onChange={ event => this.setState({ newItem: event.target.value }) }
            onKeyPress={ this.onKeyPressForInput }
            type="text" id="myInput" placeholder="Title..."
          />
          <span onClick={ this.onAddItem } className="btn addBtn">
            Add
          </span>
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