import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

function Root() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <App />
    </MuiPickersUtilsProvider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
