/* global $, moment */
import React from 'react'
import Grid from '@material-ui/core/Grid'
import CalendarBase from 'material-ui-pickers/DatePicker/Calendar'
import withUtils from 'material-ui-pickers/_shared/WithUtils'
// import moment from 'moment'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { schedulerLicenseKey } from '../schedulerLicenseKey.json'
import IconButton from '@material-ui/core/IconButton'
import PlusOne from '@material-ui/icons/PlusOne'
import NewEventModal from './NewEventModal'
import FullCalendar from './FullCalendar'
const Calendar = withUtils()(CalendarBase)

const calendarProps = {
  minDate: '1900-01-01',
  maxDate: '2100-01-01',
  disablePast: false,
  disableFuture: false,
  allowKeyboardControl: false,
  animateYearScrolling: undefined,
  openToYearSelection: false,
  children: null,
  leftArrowIcon: undefined,
  rightArrowIcon: undefined,
  renderDay: undefined,
  shouldDisableDate: undefined
}
let i = 1

class MyClub extends React.Component {
  state = {
    date: moment(),
    modalOpen: false,
    events: [{"resourceId":"a","title":"Conference","start":"2018-06-16","end":"2018-06-18"},{"resourceId":"b","title":"Birthday Party","start":"2018-06-18T07:00:00+00:00"}]
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ modalOpen: false })
  }
  handleSubmitModal = ({ timeStart, timeEnd }) => {
    const { events, date } = this.state
    console.log('handleSubmitModal', timeStart, timeEnd)
    if(! timeStart || ! timeEnd) {
      return
    }

    const start = new Date()
    const [hoursStart, minutesStart] = timeStart.split(':')
    start.setHours(hoursStart)
    start.setMinutes(minutesStart)

    const end = new Date()
    const [hoursEnd, minutesEnd] = timeEnd.split(':')
    end.setHours(hoursEnd)
    end.setMinutes(minutesEnd)
    const newEvent = {
      title: 'dynamic event ' + i++,
      resourceId: 'b',
      // start: moment(start),
      start: start.toISOString(),
      end: end.toISOString(),
      // end: moment(end),
      allDay: false
    }
    this.setState({
      events: [...events, newEvent]
    })
  }

  onChange = date => {
    this.setState({ date })
    if(this.calendar) {
      this.calendar.fullCalendar('changeView', 'agendaDay', date.format('YYYY-MM-DD'))
    }
  }
  constructor (props) {
    super(props)
    this.calendarOptions = {
      schedulerLicenseKey,
      defaultView: 'agendaFourDay',
      groupByResource: true,
      header: {
        left: 'prev,next',
        center: 'title',
        // center: 'addEventButton',
        right: 'agendaDay,agendaFourDay'
      },
      views: {
        agendaFourDay: {
          type: 'agenda',
          duration: { days: 4 }
        }
      },
      resources: [
        { id: 'a', title: 'Room A' },
        { id: 'b', title: 'Room B' }
      ],
      events: this.state.events,

      customButtons: {
        addEventButton: {
          text: 'add event...',
          click: () => {
            const { date } = this.state

            if (date.isValid()) {
              $('#calendar').fullCalendar('renderEvent', {
                title: 'dynamic event',
                resourceId: 'b',
                start: date,
                allDay: true
              })
              // alert('Great. Now, update your database...');
            } else {
              alert('Invalid date.')
            }
          }
        }
      }
    }
  }
  render () {
    const { date, modalOpen } = this.state
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={4} md={3}>
          <NewEventModal open={modalOpen} date={date} handleSubmit={this.handleSubmitModal} handleOpen={this.handleOpenModal} handleClose={this.handleCloseModal} />
          <Calendar utils={new MomentUtils()} date={date} {...calendarProps} onChange={this.onChange} />
          <IconButton>
            <PlusOne onClick={this.handleOpenModal} />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <FullCalendar options={this.calendarOptions} events={this.state.events} />
        </Grid>
      </Grid>
    )
  }
}

export default MyClub
