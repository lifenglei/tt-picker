/* eslint-disable react/sort-comp */
/*
 * @Description:
 * @Autor: lifenglei
 * @Date: 2022-06-06 18:18:03
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { throttle, formatMonthData } from './utils'
// import {Icon as Ticon } from 'antd'

const head = ['一', '二', '三', '四', '五', '六', '日']

function getMonthDates() {
  const dayjsDate = dayjs()
  return formatMonthData(dayjsDate).monthDates
}

function getCurrentMonthFirstDay() {
  const dayjsDate = dayjs()
  return formatMonthData(dayjsDate).currentMonthFirstDay
}


class MonthView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentMonthFirstDay: getCurrentMonthFirstDay(),
      monthDates: getMonthDates(), // 月日历需要展示的日期 包括前一月 当月 下一月
      currentDate: new Date().getDate(),
      touch: { x: 0, y: 0 },
      translateIndex: 0,
      calendarY: 0, // 于Y轴的位置
      showType: 'month',
    }
    this.isTouching = false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { currentDate } = nextProps
    if (currentDate !== prevState.currentDate) {
      const dayjsDate = dayjs(currentDate)
      return {
        ...formatMonthData(dayjsDate),
        currentDate,
      }
    }
    return null
  }

  /**
   *移动端触摸移动开始
   *
   * @memberof MonthView
   */
  handleTouchMove = throttle(e => {
    console.log('%c [ handleTouchMove ]-53', 'font-size:13px; background:pink; color:#bf2c9f;')
    e.stopPropagation()
    const moveX = e.touches[0].clientX - this.touchStartPositionX
    const moveY = e.touches[0].clientY - this.touchStartPositionY
    const calendarWidth = this.calendarRef.offsetWidth
    if (Math.abs(moveX) > Math.abs(moveY)) {
      // 左右滑动
      this.setState({ touch: { x: moveX / calendarWidth, y: 0 } })
    }
    this.props.onTouchMove(e)
  }, 25)

  /**
 * 触摸开始
 * @param {*} e
 */
  handleTouchStart = e => {
    e.stopPropagation()
    this.touchStartPositionX = e.touches[0].clientX
    this.touchStartPositionY = e.touches[0].clientY
    this.isTouching = true
    this.props.onTouchStart(e)
  }
  /**
   * 触摸结束
   * @param {*} e
   */

  handleTouchEnd = e => {
    e.stopPropagation()
    const { showType } = this.state
    const calendarHeight = this.calendarRef.offsetHeight
    const { touch, translateIndex, currentMonthFirstDay } = this.state
    this.f = false
    this.isTouching = false
    const absTouchX = Math.abs(touch.x)
    const absTouchY = Math.abs(touch.y)
    if (absTouchX > absTouchY && absTouchX > 0.15) {
      const newTranslateIndex = touch.x > 0 ? translateIndex + 1 : translateIndex - 1
      const nextMonthFirstDay = currentMonthFirstDay[touch.x > 0 ? 'subtract' : 'add'](1, 'month')
      const nextMonthStartDay = nextMonthFirstDay.startOf('week')
      const nextMonthEndDay = nextMonthStartDay.add(42, 'day')
      this.setState(
        {
          translateIndex: newTranslateIndex,
          ...formatMonthData(nextMonthFirstDay),
        },
        this.props.onTouchEnd(nextMonthStartDay.valueOf(), nextMonthEndDay.valueOf()),
      )
    }
    this.setState({ touch: { x: 0, y: 0 } })
  }

  handleMonthToggle = type => {
    const { currentMonthFirstDay } = this.state
    const isPrev = type === 'prev'
    const operateDate = currentMonthFirstDay
    const updateStateData = formatMonthData(
      operateDate[isPrev ? 'subtract' : 'add'](1, 'month'),
    )
    this.setState(updateStateData, () => {
      const dataArray = updateStateData.weekDates[1]
      this.props.onTouchEnd(
        dataArray[0].valueOf(),
        dataArray[dataArray.length - 1].add(1, 'day').valueOf(),
      )
    })
  }

  handleDayClick = date => {
    this.props.onDateClick(date)
  }

  handleBottomOperate() {}

  render() {
    const {
      monthDates,
      touch,
      translateIndex,
      calendarY,
      currentMonthFirstDay,
    } = this.state
    const {
      currentDate, transitionDuration, markDates, markType,
    } = this.props
    const isMonthView = true
    console.log(monthDates)
    return (
      <div className="tt-h5-calendar">
        <div className="calendar-operate">
          <div style={{ fontWeight: 'bold' }}>{(currentMonthFirstDay).format('YYYY.MM')}</div>
          <div className="arrow-wrap">
            <div className="icon left-icon" onClick={() => this.handleMonthToggle('prev')}>
              <img src={require('./img/left.png')} style={{ width: '30px' }} />
            </div>
            <div className="icon right-icon" onClick={() => this.handleMonthToggle('next')}>
              <img src={require('./img/right.png')} style={{ width: '30px' }} />
            </div>
          </div>

        </div>
        <div className="calendar-head">
          {
            head.map((i, index) => {
              const isCurrentWeek = dayjs().day()
              return (
                <div className="head-cell" key={i}>
                  <div className={`week-cell ${isCurrentWeek === index + 1 ? 'current-week' : ''}`}>
                    {i}
                  </div>

                </div>
              )
            })
          }
        </div>

        <div
          className={`calendar-body ${isMonthView ? '' : 'week-mode'}`}
          ref={e => { this.calendarRef = e }}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          <div
            style={{
              transform: `translate3d(${-translateIndex * 100}%, 0, 0)`,
            }}
          >
            {monthDates.map((item, index) => (
              <div
                className="month-cell"
                data-index={`month-cell-${index}`}
                key={`month-cell-${index}`}
                style={{
                  transform: `translate3d(${
                    (index - 1 + translateIndex + (this.isTouching ? touch.x : 0)) * 100
                  }%, ${calendarY}px, 0)`,
                  transitionDuration: `${this.isTouching ? 0 : transitionDuration}s`,
                }}
              >
                {item.map((date, itemIndex) => {
                  const isCurrentDay = date.isSame(currentDate, 'day')
                  const isOtherMonthDay = !date.isSame(currentMonthFirstDay, 'month')
                  const isMarkDate = markDates && markDates.find(i => date.isSame(i.date, 'day'))
                  const resetMarkType = (isMarkDate && isMarkDate.markType) || markType
                  const showDotMark = isCurrentDay ? false : isMarkDate && resetMarkType === 'dot'
                  const showCircleMark = isCurrentDay
                    ? false
                    : isMarkDate && resetMarkType === 'circle'
                  return (
                    <div
                      key={itemIndex}
                      className={`day-cell ${isOtherMonthDay ? 'is-other-month-day' : ''}`}
                      onClick={this.handleDayClick.bind(this, date)}
                    >
                      <div
                        className={`day-text ${isCurrentDay ? 'current-day' : ''} ${
                          showCircleMark ? 'circle-mark' : ''
                        }`}
                        style={
                          showCircleMark ? { borderColor: isMarkDate.color || '#4378be' } : null
                        }
                      >
                        {date.format('D')}
                      </div>
                      {showDotMark && (
                        <div
                          className={isMarkDate ? 'dot-mark' : ''}
                          style={{ background: isMarkDate.color || '#4378be' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="bottom-operate" />
      </div>
    )
  }
}

MonthView.propTypes = {
  currentDate: PropTypes.string,
  transitionDuration: PropTypes.number,
  onDateClick: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onToggleShowType: PropTypes.func,
  markType: PropTypes.oneOf(['dot', 'circle']),
}

MonthView.defaultProps = {
  currentDate: dayjs().format('YYYY-MM-DD'),
  transitionDuration: 0.3,
  onDateClick: () => {},
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  onToggleShowType: () => {},
  markType: 'circle',
}

export default MonthView
