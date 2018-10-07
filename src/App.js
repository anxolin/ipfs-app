import React, { Component } from 'react'
import web3 from './util/web3'
import ethPooling from './util/ethPooling'

import todoApp from './api/todoApp'
import TodoList from './components/TodoList'
import update from 'immutability-helper'
import Loading from './components/Loading'
import EtherscanLink from './components/EtherscanLink'

import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataReady: false,
      saving: false,
      account: null,
      version: null,
      ipfsHash: null,
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
    let btnLabel
    if (this.state.saving) {
      btnLabel = 'Saving'
    } else if (this.state.ipfsHash) {
      btnLabel = 'Save changes'
    } else {
      btnLabel = 'Create todo list'
    }

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
        <TodoList
          items={ this.state.items }
          loading={ !this.state.dataReady }
          editable={ this.state.dataReady && !this.state.saving }
          onAddItem={ this.onAddItem }
          onDeleteItem={ this.onDeleteItem }
          onToggleItem={ this.onToggleItem }
        />
        { this.state.dataReady && (
          <div className="buttons">
            <button
              disabled={ !this.state.dataReady || !this.state.hasChanges || this.state.saving }
              onClick={ this.saveChanges }
              className="btn saveBtn">
                { btnLabel }
                { this.state.saving &&
                  <Loading />
                }            
            </button>
          </div>
        )}
      </div>
    );
  }

  async initializeApp () {
    console.log('[App:initializeApp] Loading data...')

    ethPooling.onNetworkChange(networkId => {
      // console.log('[App:onNetworkChange] Change to network %d', networkId)
      const account = this.state.account
      this.setState({
        networkId
      })
      // Only get data if we have both the account and the network
      if (account && this.state.networkId) {
        this
          .getData(account)
          .catch(this.handleLoadDataError)
      }
    })

    ethPooling.onAccountChange(account => {
      console.log('[App:onAccountChange] Change to account %s', account)
      this.setState({
        account
      })
      // Only get data if we have both the account and the network
      if (account && this.state.networkId) {
        this
          .getData(account)
          .catch(this.handleLoadDataError)
      }
    })
  }

  handleLoadDataError (error) {
    console.error(error)
    this.setState({
      dataReady: true,
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
        dataReady: true,
        items: appData.items || [],
        ipfsHash: appData.hash,
        version: appData.version
      })
    } else {
      this.setState({
        dataReady: true,
        statusMessage: {
          type: 'warning',
          value: 'The selected network is unknown. Please select Rinkeby or Kovan.',
          closable: false
        }
      })
    }
  }

  saveChanges () {
    this.setState({
      saving: true,
      statusMessage: {
        type: 'info',
        value: <Loading message='Saving file' />,
        closable: false
      }
    })
    this
      .saveData({
        items: this.state.items
      })
      .then(saveResult => {
        const transactionHash = saveResult.tx.transactionHash
        console.log('[saveHashEthereum] The transaction %s has been mined', transactionHash, saveResult.tx)
        this.setState({
          saving: false,
          statusMessage: {
            type: 'success',
            value: 'Nice! Your list has been saved :)'
          },
          ipfsHash: saveResult.hash,
          hasChanges: false,
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({
          saving: false,
          hasChanges: true,
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
          statusMessage: {
            type: 'info',
            value: (
              <div>                
                <Loading message='Saving file' />
                <div className="details">
                  The list was&nbsp;
                  <a
                    href={ 'https://ipfs.infura.io/ipfs/' + hash }
                    target="_blank"
                    rel="noopener noreferrer" >
                    uploaded to IPFS
                  </a>. Please, sign the transaction to continue.
                </div>
              </div>
            ),
            closable: false
          }
        })
      },

      onTransactionHash: transactionHash => {
        console.log('[App:saveChanges] Sent transaction: %s', transactionHash)
        // Optimistic update
        this.setState({
          statusMessage: {
            type: 'info',
            value: (
              <div>
                <Loading message="Saving list" /><br />
                <div className="details">
                  <EtherscanLink tx={ transactionHash } />                  
                </div>
              </div>
            ),
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
          version
        })
      }
    })

    return saveResult
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
