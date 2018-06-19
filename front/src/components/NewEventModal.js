/* global moment */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import Collapse from '@material-ui/core/Collapse'
import PlusOne from '@material-ui/icons/PlusOne'
import Timer from '@material-ui/icons/Timer'
import { TimePicker, DatePicker } from 'material-ui-pickers'
import withUtils from 'material-ui-pickers/_shared/WithUtils'
import FnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import moment from 'moment'
// const TimePicker = withUtils(new FnsUtils())(TimePickerBase)
// const DatePicker = withUtils()(DatePickerBase)

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: '40%', // theme.spacing.unit * 50,
    left: '30%',
    top: '20%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing.unit * 4,
    textAlign: 'center'
  },
  input: {
    width: '100%'
  },
  logo: {
    paddingRight: theme.spacing.unit
  },
  half: {
    width: '48%',
    marginBottom: theme.spacing.unit * 4
  },
  full: {
    width: '100%',
    marginBottom: theme.spacing.unit * 4
  }
})

class NewEventModal extends React.Component {
  state = {
    selectedDate: moment(),
    endDate: moment(),
    timeStart: '',
    timeEnd: '',
    resourceId: 0,
    sportId: 0
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { timeStart, timeEnd } = this.state
    console.log('submit modal form', this.state)
    this.props.handleSubmit(this.state)
  }
  handleDateChange = (date) => {
    console.log(date)
    this.setState({ selectedDate: date });
  }
  handleEndDateChange = (date) => {
    console.log(date)
    this.setState({ endDate: date });
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps)
    const { selectedDate, timeStart, timeEnd, resourceId } = nextProps
    this.setState({ selectedDate, timeStart, timeEnd, resourceId })
  }
  render () {
    const { classes, handleOpen, handleClose, handleSubmit, open, date, sports } = this.props
    const { endDate, timeStart, timeEnd } = this.state
    let selectedDate = this.state.selectedDate || moment()
    const dayOfWeek = selectedDate.weekday()
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <div className={classes.paper}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant="title" id="modal-title" className={classes.mb}>
                  Nouvel évènement
                </Typography>
                <Typography variant="body1" id="modal-title" className={classes.mb}>
                  {selectedDate !== null ? selectedDate.format('YYYY-MM-DD HH:mm') : 'N/A'}
                </Typography>
                {/*<TimePicker
                  utils={new FnsUtils()}
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={moment()}
                  onChange={this.handleDateChange} />*/}

                <FormControl className={classes.half}>
                  <InputLabel htmlFor="timeStart">Heure de début</InputLabel>
                  <Input
                    className={classes.input}
                    id="timeStart"
                    type="text"
                    name="timeStart"
                    value={timeStart}
                    onChange={this.handleInputChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <Timer />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl className={classes.half}>
                  <InputLabel htmlFor="timeEnd">Heure de fin</InputLabel>
                  <Input
                    className={classes.input}
                    id="timeEnd"
                    type="text"
                    name="timeEnd"
                    value={timeEnd}
                    onChange={this.handleInputChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <Timer />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl className={classes.full}>
                  <DatePicker
                    label="Date de fin"
                    disablePast={true}
                    value={endDate}
                    onChange={this.handleEndDateChange}
                    shouldDisableDate={d => d.weekday() !== dayOfWeek}
                    animateYearScrolling={false}
                  />
                </FormControl>
                <FormControl className={classes.full}>
                  <InputLabel htmlFor="sport">Sport</InputLabel>
                  <Select
                    value={this.state.sportId}
                    onChange={this.handleInputChange}
                    inputProps={{
                      name: 'sportId',
                      id: 'sport',
                    }}
                  >
                    <MenuItem value={0}>
                      <em>None</em>
                    </MenuItem>
                    {sports.map(
                      ({id, name}) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.mb}
                  onClick={this.handleSubmit}>
                  <PlusOne className={classes.logo} onClick={handleSubmit} /> Créer
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
    )
  }
}

NewEventModal.propTypes = {
  classes: PropTypes.object.isRequired
}

// We need an intermediary variable for handling the recursive nesting.
const NewEventModalWrapped = withStyles(styles)(NewEventModal)

export default NewEventModalWrapped
