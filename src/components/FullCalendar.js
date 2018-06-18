/* global $ */
import React from 'react'

class FullCalendar extends React.Component {
  componentDidMount () {
    this.calendar = $('#calendar')
    this.calendar.fullCalendar(this.props.options)
  }

  componentWillReceiveProps (nextProps) {
    const { events } = nextProps
    console.log(nextProps, events)
    this.calendar.fullCalendar({
      events
    })
    this.calendar.fullCalendar('render')
  }

  render() {
    return <div id='calendar'></div>
  }
}

export default FullCalendar
