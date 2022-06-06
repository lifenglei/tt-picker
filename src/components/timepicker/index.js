/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
/*
 * @Description:
 * @Autor: lifenglei
 * @Date: 2022-06-06 18:18:03
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { checkPlatform } from './utils/util'


class TimePicker extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hashID: [''],
      hashClass: 'hash-calendar',
      timeRange: [''],
      timeOptions: {
        minHours: 24,
        minMinutes: 59,
        maxHours: 0,
        maxMinutes: 0,
      },
      checkedDate: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
      },
      timeHeight: 0,
      timeStartY: 0,
      timeStartUp: 0,
      timeArray: [],
    }
  }

  componentDidMount() {
    const { defaultTime, timeChangeCallback } = this.props
    const { checkedDate } = this.state

    this.setState({
      hashID: [
        `time${Math.floor(Math.random() * 10000)}`,
        `time${Math.floor(Math.random() * 10000)}`,
      ],
      hashClass: `time_item_${Math.floor(Math.random() * 10000)}`,
    })

    if (defaultTime) {
      const _checkedDate = {
        ...checkedDate,
        hours: defaultTime.getHours(),
        minutes: defaultTime.getMinutes(),
      }
      this.setState({ checkedDate: _checkedDate })

      timeChangeCallback && timeChangeCallback(_checkedDate)
    }
  }

  componentDidUpdate(prevProps) {
    const { show: showPrev } = prevProps
    // const { show } = this.props

    if (showPrev) {
      setTimeout(() => {
        this.initTimeArray()
      })
    }
  }

  initTimeArray = () => {
    const { minuteStep } = this.props
    const { checkedDate, hashClass, hashID } = this.state
    const checkHours = checkedDate.hours
    const checkMinutes = checkedDate.minutes
    const timeEle = document.querySelector(`.${hashClass}`)
    const hourEle = document.getElementById(`#${hashID[0]}`)
    const minuteEle = document.getElementById(`#${hashID[1]}`)
    // 生成对应的timeArray
    const hours = []
    const timeArray = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
    }
    const minutes = []
    for (let i = 0; i < 60; i++) {
      if (i % minuteStep === 0) {
        minutes.push(i)
      }
    }
    timeArray.push(hours, minutes)
    this.setState({ timeArray })
    if (!timeEle) {
      return false
    }
    // 获取每次滚动的距离 也就是一个time的高度
    const timeItemHeightPx = parseFloat(getComputedStyle(timeEle).height)
    const timeItemPaddingPx = parseFloat(getComputedStyle(timeEle).paddingTop) * 2
    const timeItemHeight = timeItemHeightPx + timeItemPaddingPx
    const timeHeight = timeItemHeight
    this.setState({ timeHeight })
    const hoursUp = (2 - checkHours) * timeHeight
    if (!hourEle || !minuteEle) {
      return false
    }
    const minutesUp = (2 - checkMinutes / minuteStep) * timeHeight
    hourEle.style.webkitTransform = `translate3d(0px,${hoursUp}px,0px)`
    minuteEle.style.webkitTransform = `translate3d(0px,${minutesUp}px,0px)`
  }

  timeTouchStart = e => {
    e.preventDefault()
    const timeStartY = e.changedTouches[0].pageY
    this.setState({ timeStartY })

    const eventEl = e.currentTarget
    const transform = eventEl.style.webkitTransform
    if (transform) {
      const timeStartUp = parseFloat(transform.split(' ')[1].split('px')[0])
      this.setState({ timeStartUp })
    }
  }

  timeTouchMove = (e, index) => {
    const { timeStartY, timeStartUp } = this.state

    const moveEndY = e.changedTouches[0].pageY
    const Y = moveEndY - timeStartY

    const eventEl = e.currentTarget
    eventEl.style.webkitTransform = `translate3d(0px,${Y + timeStartUp}px,0px)`

    if (checkPlatform() === '2') {
      this.timeTouchEnd(e, index)
      return false
    }
  }

  timeTouchEnd = (e, index) => {
    const { minuteStep, timeChangeCallback } = this.props
    const {
      checkedDate, timeStartUp, timeHeight, timeArray,
    } = this.state

    const eventEl = e.currentTarget
    const transform = eventEl.style.webkitTransform
    let endUp = timeStartUp
    if (transform) {
      endUp = parseFloat(
        eventEl.style.webkitTransform.split(' ')[1].split('px')[0],
      )
    }

    const distance = Math.abs(endUp - timeStartUp)
    const upCount = Math.floor(distance / timeHeight) || 1
    const halfWinWith = timeHeight / 2
    let upDistance = timeStartUp

    if (endUp <= timeStartUp) {
      console.log('上')
      // 向上滑动 未过临界值
      if (distance <= halfWinWith) {
        upDistance = timeStartUp
      } else {
        upDistance = timeStartUp - timeHeight * upCount

        if (timeArray && upDistance < -(timeArray[index].length - 3) * timeHeight) {
          upDistance = -(timeArray[index].length - 3) * timeHeight
        }
      }
    } else {
      console.log('下')
      // 向下滑动 未过临界值
      if (distance <= halfWinWith) {
        upDistance = timeStartUp
      } else {
        upDistance = timeStartUp + timeHeight * upCount
        if (upDistance > timeHeight * 2) {
          upDistance = timeHeight * 2
        }
      }
    }

    let _checkedDate
    if (index === 0) {
      const hours = 2 - Math.round(upDistance / timeHeight)
      _checkedDate = { ...checkedDate, hours }
    } else {
      const minute = 2 - Math.round(upDistance / timeHeight)
      _checkedDate = { ...checkedDate, minutes: minute * minuteStep }
    }
    this.setState({ checkedDate: _checkedDate })
    timeChangeCallback && timeChangeCallback(_checkedDate)
    eventEl.style.webkitTransition = 'transform 300ms'
    eventEl.style.webkitTransform = `translate3d(0px,${upDistance}px,0px)`
  }

  isBeSelectedTime = (time, index) => {
    // 是否为当前选中的时间
    const { checkedDate } = this.state

    return (
      (index === 0 && time === checkedDate.hours)
      || (index === 1 && time === checkedDate.minutes)
    )
  }

  // 小于10，在前面补0
  fillNumber = val => (val > 9 ? val : `0${val}`)

  render() {
    const { show } = this.props
    const { timeArray, hashID, hashClass } = this.state
    const timeItemNode = (
      timeArr,
      parentIndex,
    ) => timeArr.map(time => (
      <div
        className={classNames(
          'time_item',
          { time_item_show: this.isBeSelectedTime(time, parentIndex) },
          hashClass,
        )}
        key={time}
      >
        {this.fillNumber(time)}
      </div>
    ))
    const timeContentNode = timeArrays => (
      timeArrays
        && timeArrays.map((item, index) => (
          <div
            className="time_content"
            id={hashID[index]}
            key={item}
            data-index={index}
            onTouchStart={this.timeTouchStart}
            onTouchMove={event => {
              this.timeTouchMove(event, index)
            }}
            onTouchEnd={event => {
              this.timeTouchEnd(event, index)
            }}
          >
            {timeItemNode(item, index)}
          </div>
        ))
    )
    return show ? (
      <div className="time_body">
        <div className="time_group">{timeContentNode(timeArray)}</div>
      </div>
    ) : null
  }
}

TimePicker.propTypes = {
  show: PropTypes.bool,
  defaultTime: PropTypes.func,
  minuteStep: PropTypes.number,
  timeChangeCallback: PropTypes.func,
}

TimePicker.defaultProps = {
  defaultTime: new Date(),
  show: true,
  minuteStep: 1,
  timeChangeCallback: () => {},
}


export default TimePicker
