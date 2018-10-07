import React, { Component } from 'react';
import web3 from './util/web3'
import ethNetworkUtils from './util/ethNetworkUtils'

import todoApp from './api/todoApp'
import Todo from './components/todo/Todo'
import update from 'immutability-helper'

import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      account: null,
      version: null,
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
    this.handleLoadDataError = this.handleLoadDataError.bind(this)
  }

  componentDidMount () {
    this.initializeApp()
  }

  render() {
    return (
      <div className="App">
        { this.state.statusMessage.value && (
          <div className={ 'alert ' + this.state.statusMessage.type }>
            { this.state.statusMessage.closable !== false && (
              <span onClick={ this.clearStatusMessage } className="close">&times;</span>
            )}
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

  async initializeApp () {
    console.log('[App:initializeApp] Loading data...')

    ethNetworkUtils.onNetworkChange(networkId => {
      // console.log('[App:onNetworkChange] Change to network %d', networkId)
      const account = this.state.account
      if (account) {
        this
          .getData(account)
          .catch(this.handleLoadDataError)
      }
    })

    this
      // Load Ethereum account
      .loadAccount()

      // Load data for user
      .then(async account => {
        this.setState({
          account
        })

        const networkId = ethNetworkUtils.getNetworkId()
        if (networkId) {
          this.getData(account)
        }
      })
      // Handle data error
      .catch(this.handleLoadDataError)
  }

  handleLoadDataError (error) {
    console.error(error)
    this.setState({
      ready: true,
      statusMessage: {
        type: 'error',
        value: 'Error Loading the data: ' + error
      }
    })
  }

  async getData (account) {
    console.log('[App:getData] Get data for accont %s', account)

    if (todoApp.isSupportedNetwork()) {
      const appData = await todoApp.getData({
        account
      })
      console.log('[App:initializeApp] Data is ready', appData)
      this.setState({
        ready: true,
        items: appData.items || [],
        hash: appData.hash,
        version: appData.version
      })
    } else {
      this.setState({
        ready: true,
        statusMessage: {
          type: 'warning',
          value: 'The selected network is unknown. Please select Rinkeby or Kovan.',
          closable: false
        }
      })
    }
  }

  saveChanges () {
    this
      .saveData({
        items: this.state.items
      })
      .catch(error => {
        console.error(error)
        this.setState({
          statusMessage: {
            type: 'error',
            value: 'Error saving data: ' + error
          }
        })
      })
  }
  
  async saveData (appData) {
    console.log('[App:saveChanges] Save items', appData)
    const previousIpfsHash = this.state.ipfsHash
    const version = this.state.version

    // Save data and subscribe to some callbacks
    const saveResult = await todoApp.saveData({
      account: this.state.account,
      data: appData,
      version,

      onUploadedIpfs: hash => {
        this.setState({
          ipfsHash: hash,
        })
      },

      onTransactionHash: transactionHash => {
        console.log('[App:saveChanges] Sent transaction: %s', transactionHash)
        // Optimistic update
        this.setState({
          statusMessage: {
            type: 'info',
            value: 'Saving list. Transaction: ' + transactionHash,
            closable: false
          },          
          version: version + 1,
          hasChanges: false
        })
      },

      onError: error => {
        // Revert the state (cause we used a optimistic update)
        console.error('[saveHashEthereum] Error saving. Reverting previous hash', error)
        this.setState({
          ipfsHash: previousIpfsHash,
          version,
          hasChanges: false
        })
      }
    })

    const transactionHash = saveResult.tx.transactionHash
    console.log('[saveHashEthereum] The transaction %s has been mined', transactionHash, saveResult.tx)
    this.setState({
      statusMessage: {
        type: 'success',
        value: 'Todo list was saved in IPFS with hash ' + saveResult.hash
      },
      ipfsHash: saveResult.hash,
      hasChanges: false
    })
  }

  async loadAccount () {
    console.log('[App:loadAccount] Load account...')
    const [ account ] = await web3.eth.getAccounts()
    console.log('[App:loadAccount] Selected account: ', account)    

    return account
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
}

export default App
