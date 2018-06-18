import React from 'react'
/* eslint-disable import/no-unresolved */
import PropTypes from 'prop-types'
// import deepEqual from 'deep-equal'
import $ from 'jquery'
import 'fullcalendar'
import 'fullcalendar-scheduler'
import 'fullcalendar/dist/fullcalendar.min.css'
import 'fullcalendar-scheduler/dist/scheduler.min.css'

import { isOption } from './utils'

class FullCalendar extends React.Component {
  constructor (props) {
    super(props)
    this.calendarRef = React.createRef();
  }
  componentDidMount () {
    const { options, onDateChanged } = this.props

    this.extendCalendarOptions = (calendarOptions) => {
      const defaultOptions = {
        viewRender (view) {
          const { intervalStart, intervalEnd } = view
          const toDate = (momentDate) => momentDate.toDate()
          if (onDateChanged && typeof onDateChanged === 'function') {
            onDateChanged(toDate(intervalStart), toDate(intervalEnd))
          }
        }
      }

      return Object.assign({}, defaultOptions, calendarOptions)
    }

    this.calendar = $(this.calendarRef.current)

    const calendarOptions = this.extendCalendarOptions(options)

    this.calendar.fullCalendar(calendarOptions)
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    const { options: newOptions } = newProps
    const { options } = this.props

    console.log(options.events, newOptions.events)
    Object.keys(newOptions).forEach(optionName => {
      // update options dynamically
      if (isOption(optionName) && newOptions[optionName] !== options[optionName]) {
      // if (isOption(optionName) && !deepEqual(newOptions[optionName], options[optionName])) {
        this.calendar.fullCalendar('option', optionName, newOptions[optionName])
      }
      if(optionName === 'events') {
        this.calendar.fullCalendar('option', 'events', newOptions.events)
      }
    })

    this.calendar.fullCalendar('destroy')
    this.calendar.fullCalendar(newOptions)
  }

  render () {
    return (
      <div ref={this.calendarRef}></div>
    )
  }
}

FullCalendar.propTypes = {
  options: PropTypes.object,
  onDateChanged: PropTypes.func
}

export {
  FullCalendar
}
