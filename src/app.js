/* eslint-disable func-names */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import dayjs from 'dayjs'
import MonthView from './components/monthPicker'
import TimeView from './components/timepicker'

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentDate: dayjs(),
    }
  }

  render() {
    return (
      <React.Fragment>
        <p>日期</p>
        <MonthView
          markType="circle"
          markDates={
            [
              { color: '#3873fa', date: '2022-6-8', markType: 'circle' },
            ]
          }
          onDateClick={date => this.setState({ currentDate: date.format('YYYY-MM-DD') })}
          currentDate={this.state.currentDate}
          onTouchEnd={(a, b) => console.log(a, b)}
        />
        <div className="tt-calendar">
          <TimeView />
        </div>

      </React.Fragment>
    )
  }
}
window.onload = function () {
  const style = document.createElement('style')

  style.type = 'text/css'
  style.innerHTML = `
  .tt-h5-calendar {
    box-sizing: border-box;
    width: 100vw;
    padding-bottom: 10px;
    overflow: hidden;
    font-size: 17px;
    background-color: #fff;
  }
  .tt-h5-calendar * {
    box-sizing: border-box;
    user-select: none;
  }
  .tt-h5-calendar .calendar-operate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding:0 10px;
  }
  .tt-h5-calendar .calendar-operate .arrow-wrap{
    display:flex;
  }
  .tt-h5-calendar .calendar-operate .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 30px;
  }
  .tt-h5-calendar .calendar-head {
    display: flex;
    flex-flow: row nowrap;
    background: #fff;
  }
  .tt-h5-calendar .calendar-head .head-cell {
    display: flex;
    flex-basis: 14.28571%;
    align-items: center;
    justify-content: center;
    height: 34px;
  }
  .tt-h5-calendar .calendar-head .head-cell .current-week{
    color: #3873fa;
  }
  .tt-h5-calendar .calendar-body {
    position: relative;
    height: 216px;
    transition: height 0.3s;
  }
  .tt-h5-calendar .calendar-body .month-cell {
    position: absolute;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    will-change: transform;
  }
  .tt-h5-calendar .calendar-body .month-cell .day-cell {
    display: flex;
    flex-basis: 14.28571%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 36px;
  }
  .tt-h5-calendar .calendar-body .month-cell .day-cell.is-other-month-day {
    color: #999;
  }
  .tt-h5-calendar .calendar-body .month-cell .day-cell .day-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }
  .tt-h5-calendar .calendar-body .month-cell .day-cell .current-day {
    color: #3873fa;
  }
  .tt-h5-calendar .calendar-body .month-cell .day-cell .circle-mark {
    background-color:#eee;
    color:#999;
    border-radius: 50%;
  }
  .tt-h5-calendar .calendar-body .month-cell .day-cell .dot-mark {
    width: 4px;
    height: 4px;
    background-color: #3873fa;
    border-radius: 50%;
  }
  .tt-h5-calendar .bottom-operate {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1px;
    background-color: #eee;
    margin-top:5px;
  }
  .tt-calendar .time_body {
    width: 100%;
  }
 
  .tt-calendar .time_group {
    width: 100%;
    display: flex;
    height: 176px;
    align-items: flex-start;
    justify-content: center;
    margin-top: 10px;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
  }
  .tt-calendar .time_content {
    touch-action: none;
    padding: 0 20px;
    -webkit-overflow-scrolling: touch;
  }
  .tt-calendar .time_item {
    padding: 11px 0;
    color: #898989;
  }
  .tt-calendar .time_item_show {
    color: #4c4c4c;
  }
  .tt-calendar .time_disabled {
    color: red;
  }
  
  `

  const head = document.getElementsByTagName('head')[0]

  head.appendChild(style)
}
ReactDOM.render(<App />, document.getElementById('container'))
