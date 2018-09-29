import React, { Component } from 'react';
import Todo from './components/todo/Todo'
import update from 'immutability-helper';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ipfsReady: false,
      statusMessage: {
        type: null, // info, error, warning, success
        value: null // status message
      },
      hasChanges: false,
      items: []
    }
    this.clearStatusMessage = this.clearStatusMessage.bind(this)
    this.onAddItem = this.onAddItem.bind(this)
    this.onDeleteItem = this.onDeleteItem.bind(this)
    this.onToggleItem = this.onToggleItem.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }

  clearStatusMessage () {
    this.setState({
      statusMessage: {
        type: null,
        value: null
      }
    })
  }

  onAddItem (value) {    
    var items = update(this.state.items, {
      $push: [{
        value,
        done: false
      }]
    })
    this.setState({
      items,
      hasChanges: true
    })
  }

  onDeleteItem (item) {
    const items = this.state.items.filter(i => i !== item)
    this.setState({
      items,
      hasChanges: true
    })
  }

  onToggleItem (item) {
    const index = this.state.items.findIndex(i => i === item)

    if (index !== -1) {
      var items = update(this.state.items, {
        [index]: {
          done: done => !done
        }
      })
      this.setState({
        items,
        hasChanges: true
      })
    }
  }

  saveChanges () {
    console.log({
      items: this.state.items
    })
  }

  render() {
    return (
      <div className="App">
        { this.state.statusMessage.value && (
          <div className={ 'alert ' + this.state.statusMessage.type }>
            <span onClick={ this.clearStatusMessage } className="close">&times;</span>
            { this.state.statusMessage.value }
          </div>
        )}
        <Todo
          items={ this.state.items }
          onAddItem={ this.onAddItem }
          onDeleteItem={ this.onDeleteItem }
          onToggleItem={ this.onToggleItem }
        />
        <div className="buttons">
          <button
            disabled={ !this.state.hasChanges }
            onClick={ this.saveChanges }
            className="btn saveBtn">
              Save changes
          </button>
        </div>
      </div>
    );
  }
}

export default App
