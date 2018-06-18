import React, { Component } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Layout from './components/Layout'
import MyClub from './components/MyClub'

class App extends Component {
  render () {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Layout exact path="/" component={MyClub} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
