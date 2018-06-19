/* global $, moment */
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Calendar from 'material-ui-pickers/DatePicker/Calendar'
import withUtils from 'material-ui-pickers/_shared/WithUtils'
import moment from 'moment'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { schedulerLicenseKey } from '../schedulerLicenseKey.json'
import IconButton from '@material-ui/core/IconButton'
import PlusOne from '@material-ui/icons/PlusOne'
import NewEventModal from './NewEventModal'

// Une version qui marche, modifiée à partir de:
// https://github.com/vadym-vorobel/fullcalendar-react
import { FullCalendar } from '../fullcalendar-react/FullCalendar'

// Une fonction pour calculer le décalage par rapport à GMT (temps universel)
import { getOffsetHours, getOffsetString } from '../helpers/computeTimeOffset'

// DES VERSIONS QUE J'AI TESTEES ET QUI NE MARCHAIENT PAS
// import FullCalendar from './FullCalendar'
// import FullCalendar from 'fullcalendar-reactwrapper'

// const Calendar = withUtils()(CalendarBase)

const sports = [{ id: 1, name: 'Badminton' }, { id: 2, name: 'Indoor foot' }]

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

const eventify = ({ id, clubId, resourceId, sportId, first, last, timeStart, timeEnd, title }) => {
  const momentFirst = moment(first)
  const momentLast = moment(last)
  const daySpan = momentLast.diff(momentFirst, 'days')
  const events = []
  const offset = getOffsetString()
  for(let d = 0 ; d <= daySpan ; d += 7) {
    events.push({
      id, clubId, resourceId, sportId, title, allDay: false,
      start: `${momentFirst.format('YYYY-MM-DD')}T${timeStart}${offset}`,
      end: `${momentFirst.format('YYYY-MM-DD')}T${timeEnd}${offset}`
    })
    momentFirst.add(1, 'week')
  }
  console.log(events)
  return events
}

const eventifyTimeslots = timeslots => timeslots.reduce((carry, slot) => carry.concat(eventify(slot)), [])

class MyClub extends React.Component {
  state = {
    date: moment(),
    modalOpen: false,
    modalFields: {
      selectedDate: null,
      timeStart: '',
      timeEnd: ''
    },
    events: [
    ]
  }

  componentDidMount () {
    fetch('/api/timeslots?clubId=2')
    .then(res => res.json())
    .then(eventifyTimeslots)
    .then(timeslots => this.setState({
      events: timeslots
    }))
    // this.setState({
    //   events: [
    //     {"resourceId":1,"title":"Conference","start":"2018-06-21","end":"2018-06-18"},
    //     {"resourceId":2,"title":"Birthday Party","start":"2018-06-21T07:00:00+00:00"},
    //     {
    //       "allDay": false,
    //       "end": "2018-06-20T13:30:04+00:00",
    //       "resourceId": 2,
    //       "start": "2018-06-20T14:30:04+00:00",
    //       "title": "dynamic event 0"
    //     }
    //   ]
    // })
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ modalOpen: false })
  }
  // C'est ici qu'on crée un nouvel évènement, une fois que
  // le formulaire de la modale de NewEventModal a été soumis
  handleSubmitModal = ({ selectedDate, endDate, sportId, timeStart, timeEnd, resourceId }) => {
    const { events, date } = this.state
    console.log('handleSubmitModal', timeStart, timeEnd, selectedDate, endDate, sportId, resourceId)
    console.log(selectedDate.weekday())
    if(! timeStart || ! timeEnd) {
      return
    }

    const start = new Date()
    const [hoursStart, minutesStart] = timeStart.split(':')
    start.setHours(Number(hoursStart) + getOffsetHours())
    start.setMinutes(Number(minutesStart))
    const startMoment = moment(start)

    const end = new Date()
    const [hoursEnd, minutesEnd] = timeEnd.split(':')
    end.setHours(Number(hoursEnd) + getOffsetHours())
    end.setMinutes(Number(minutesEnd))
    const endMoment = moment(end)

    const offsetString = getOffsetString()

    const sport = sports.find(s => s.id === sportId)
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    const dayOfWeek = selectedDate.weekday()
    const dayName = weekdays[dayOfWeek]

    const newEvent = {
      title: `${sport.name} ${dayName} ${timeStart}`,
      resourceId: 'b',
      // start: startMoment.format(),
      // end: endMoment.format(),
      start: start.toISOString().substr(0, 19) + offsetString,
      end: end.toISOString().substr(0, 19) + offsetString,
      allDay: false
    }
    
    const eventPayload = {
      title: `${sport.name} ${dayName} ${timeStart}`,
      first: selectedDate.format('YYYY-MM-DD'),
      last: endDate.format('YYYY-MM-DD'),
      timeStart: timeStart + ':00',
      timeEnd: timeEnd + ':00',
      sportId,
      resourceId,
      clubId: 2
    }

    fetch('/api/timeslots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    })
    .then(r => r.json())
    .then(event => {
      console.log('event saved', event)

      this.setState({
        events: [].concat(events, newEvent),
        modalOpen: false
      })
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

    // Options du calendrier
    // Créer un schedulerLicenseKey.json en s'inspirant de schedulerLicenseKey.sample.json
    this.calendarOptions = {
      schedulerLicenseKey,
      defaultView: 'agendaFourDay',
      groupByDateAndResource: true,
      header: {
        left: 'prev,next',
        // center: 'title',
        center: 'addEventButton',
        right: 'agendaDay,agendaFourDay'
      },
      views: {
        agendaFourDay: {
          type: 'agenda',
          duration: { days: 4 }
        }
      },
      resources: [
        { id: 1, title: 'Room A' },
        { id: 2, title: 'Room B' }
      ],
      events: this.state.events,

      dayClick: (selectedDate, jsEvent, view, resource) => {
        // alert('clicked ' + date.format() + ' on resource ' + resource.id);
        const resourceId = resource.id
        const timeStart = selectedDate.format('HH:mm')
        const dateEnd = selectedDate.clone().add(90, 'm')
        const timeEnd = dateEnd.format('HH:mm')
        console.log(timeStart, timeEnd, this)
        this.setState({
          modalFields: { selectedDate, timeStart, timeEnd, resourceId },
          modalOpen: true
        })
      },

      customButtons: {
        // Une façon d'ajouter un évènement en passant directement
        // par l'API du fullCalendar... a priori pas la bonne façon
        // car "pas très React"
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
    const { date, modalOpen, modalFields, events } = this.state
    const { calendarOptions } = this
    const props = {...calendarOptions, events}
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} sm={4} md={3}>
          <NewEventModal {...modalFields} sports={sports} open={modalOpen} date={date} handleSubmit={this.handleSubmitModal} handleOpen={this.handleOpenModal} handleClose={this.handleCloseModal} />
          <Calendar utils={new MomentUtils()} date={date} {...calendarProps} onChange={this.onChange} />
          <IconButton>
            <PlusOne onClick={this.handleOpenModal} />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <FullCalendar options={{...props}} />
        </Grid>
      </Grid>
    )
  }
}

export default MyClub
