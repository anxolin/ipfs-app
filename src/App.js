import React, { Component } from 'react';
import Todo from './components/todo/Todo'
import ipfs from './api/ipfs'
import update from 'immutability-helper';
import { Buffer } from 'buffer'
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      ipfsHash: 'QmUSJ5bcfrau8uBA51eRpi4MmBxdHueo1fC7HNHVMDsuZQ',
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

  componentDidMount () {
    this.getIpfsInfo()
    this.loadData()
  }

  getIpfsInfo () {
    ipfs.getId()
      .then(ipfsInfo => {
        console.log('Ipfs info: ', ipfsInfo)
      })
      .catch(error => {
        console.error(error)
        this.setState({
          statusMessage: {
            type: 'error',
            value: 'Error getting info from IPFS: ' + error
          }
        })
      })
  }

  loadData () {
    const hash = this.state.ipfsHash
    ipfs.cat(hash)
      .then(file => {
        const appData = JSON.parse(file.toString('utf8'))
        this.setState({
          ready: true,
          items: appData.items
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({
          statusMessage: {
            type: 'error',
            value: `Error getting the content from IPFS (${hash}): ${error}`
          }
        })
      })
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
    const appData = {
      items: this.state.items
    }
    console.log(appData)
    const content = Buffer.from(JSON.stringify(appData))
    console.log(content)
    ipfs.add(content)
      .then(addResult => {
        console.log(addResult)
        const [{ hash }] = addResult
        this.setState({
          statusMessage: {
            type: 'success',
            value: 'Todo list was saved in IPFS with hash ' + hash
          },
          ipfsHash: hash,
          hasChanges: false
        })
      })
      .catch(error => {
        this.setState({
          statusMessage: {
            type: 'error',
            value: 'Error saving the list in IFFS: ' + error
          }
        })
        console.error(error)
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
          loading={ !this.state.ready }
          onAddItem={ this.onAddItem }
          onDeleteItem={ this.onDeleteItem }
          onToggleItem={ this.onToggleItem }
        />
        <div className="buttons">
          <button
            disabled={ !this.state.ready || !this.state.hasChanges }
            onClick={ this.saveChanges }
            className="btn saveBtn">
              { this.state.ipfsHash ? 'Save changes' : 'Publish todo list' }
          </button>
        </div>
      </div>
    );
  }
}

export default App
