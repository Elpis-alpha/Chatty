// Storage Controller
const StorageCtrl = (function () {

  const storeSessionList = (name, data) => {

    sessionStorage.setItem(name, JSON.stringify(data))

  }

  const getSessionList = (name) => {

    return JSON.parse(sessionStorage.getItem(name))

  }

  const appendSessionList = (name, data) => {

    let list = getSessionList(name)

    if (list === null) { list = [] }

    list.push(data)

    storeSessionList(name, list)

  }

  return {

    storeSessionList: (name, data) => storeSessionList(name, data),

    appendSessionList: (name, data) => appendSessionList(name, data),

    getSessionList: (name) => getSessionList(name),

  }
})()


// Time Controller
const TimeCtrl = (function () {

  const getNoDays = function (number, year) {

    switch (number) {
      case 1:
        if (year) {

          if (year % 4 === 0) {

            return 29

          } else {

            return 28

          }

        } else {

          return 28

        }
        break

      case 4:
      case 0:
      case 2:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31
        break;

      case 3:
      case 5:
      case 8:
      case 10:
        return 30
        break;

      default:
        break;
    }

  }

  const secondstoTimeStr = function (number, x) {

    let answer = number / 3600

    const hour = Math.floor(answer)

    answer = answer - hour

    answer = answer * 60

    const minute = Math.floor(answer)

    answer = answer - minute

    answer = answer * 60

    const second = Math.floor(answer)

    let stamp = hour >= 12 ? `pm` : `am`

    const newMinute = String(minute).length === 2 ? minute : `0${minute}`

    let newHour = hour > 12 ? (hour - 12) : hour

    newHour = hour === 0 ? 12 : newHour

    stamp = hour === 24 ? `am` : stamp

    return x === undefined ?
      `${newHour}:${newMinute}${stamp}` :
      `${newHour}:${newMinute}:${second}${stamp}`
  }

  const timeListToMilSeconds = function (theList) {

    theList.map((a) => {
      return isNaN(parseInt(a)) ? a : parseInt(a)
    })

    let milliSec = 0

    if (theList.length === 3) {

      milliSec += theList[0] * 60 * 60 * 1000

      milliSec += theList[1] * 60 * 1000

      milliSec += theList[2] * 1000

    } else {

      let hr

      if (theList[3] === 'am') {
        if (theList[0] === 12) {
          hr = 0
        } else {
          hr = theList[0]
        }
      } else {
        if (theList[0] === 12) {
          hr = 24
        } else {
          hr = theList[0] + 12
        }
      }

      milliSec += hr * 60 * 60 * 1000

      milliSec += theList[1] * 60 * 1000

      milliSec += theList[2] * 1000

    }

    const returnValue = milliSec

    return returnValue
  }

  const secondstoTimeList = function (number) {

    let answer = number / 3600

    const hour = Math.floor(answer)

    answer = answer - hour

    answer = answer * 60

    const minute = Math.floor(answer)

    answer = answer - minute

    answer = answer * 60

    const second = Math.floor(answer)

    return [hour, minute, second]
  }

  const timetoSeconds = function (theDate) {
    const dateArray = [
      theDate.getHours() * 3600,
      theDate.getMinutes() * 60,
      theDate.getSeconds()
    ]

    let answer = 0

    for (const item of dateArray) {
      answer += item
    }

    return answer
  }

  const getMonth = function (number) {

    switch (number) {
      case 0:
        return 'January'
        break;

      case 1:
        return 'February'
        break;

      case 2:
        return 'March'
        break;

      case 3:
        return 'April'
        break;

      case 4:
        return 'May'
        break;

      case 5:
        return 'June'
        break;

      case 6:
        return 'July'
        break;

      case 7:
        return 'August'
        break;

      case 8:
        return 'September'
        break;

      case 9:
        return 'October'
        break;

      case 10:
        return 'November'
        break;

      case 11:
        return 'December'
        break;

      default:
        break;
    }

  }

  const getMonthNumber = function (month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]

    return months.indexOf(month)
  }

  const makeCalender = function (date, monthE, yearE, bodyE) {

    const today = new Date()

    const year = date.getFullYear()

    const month = TimeCtrl.getMonth(date.getMonth())

    const noOfDays = TimeCtrl.getNoDays(date.getMonth(), date.getFullYear())

    let firstDay = new Date(year, date.getMonth(), 1)

    firstDay = firstDay.getDay()

    let prevMonth = new Date(year, date.getMonth() - 1, date.getDate())

    prevMonth = TimeCtrl.getNoDays(prevMonth.getMonth(), prevMonth.getFullYear())

    let countStarted = 0;

    let countEnded = 'No';

    let daysCount = 0;

    const makeCalende = function (date, datetr) {

      let calender = `
        <tr>
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
  
        <tr>
        `

      for (let j = 0; j < 7; j++) {

        const startCount = j >= firstDay ? 'yes' : 'no'

        if (j === firstDay) { countStarted = j }

        if (startCount === 'yes') {

          daysCount++

          if (daysCount === date) {

            calender += `
              <td class="active">${j + 1 - countStarted}</td>
              `

          } else if (daysCount === datetr) {

            calender += `
              <td class="xactive">${j + 1 - countStarted}</td>
              `

          } else {

            calender += `
              <td>${j + 1 - countStarted}</td>
              `

          }

        } else {
          calender += `
            <td class="clouded before">${prevMonth - firstDay + 1 + j}</td>
            `
        }

      }

      calender += `
        </tr>
  
        <tr>
        `

      for (let j = 0; j < 7; j++) {

        daysCount++

        if (daysCount === date) {

          calender += `
            <td class="active">${daysCount}</td>
            `

        } else if (daysCount === datetr) {

          calender += `
            <td class="xactive">${daysCount}</td>
            `

        } else {

          calender += `
            <td>${daysCount}</td>
            `

        }

      }

      calender += `
        </tr>
  
        <tr>
        `

      for (let j = 0; j < 7; j++) {

        daysCount++

        if (daysCount === date) {

          calender += `
            <td class="active">${daysCount}</td>
            `

        } else if (daysCount === datetr) {

          calender += `
            <td class="xactive">${daysCount}</td>
            `

        } else {

          calender += `
            <td>${daysCount}</td>
            `

        }
      }

      calender += `
        </tr>
  
        <tr>
        `


      for (let j = 0; j < 7; j++) {

        daysCount++

        if (daysCount > noOfDays) { countEnded = 'Yes' }

        if (countEnded === 'Yes') {
          calender += `
              <td class="clouded after">${daysCount - noOfDays}</td>
            `
        } else {

          if (daysCount === date) {

            calender += `
              <td class="active">${daysCount}</td>
              `

          } else if (daysCount === datetr) {

            calender += `
              <td class="xactive">${daysCount}</td>
              `

          } else {

            calender += `
              <td>${daysCount}</td>
              `

          }
        }
      }

      calender += `
        </tr>
        `

      if (daysCount < noOfDays) {

        calender += `
          <tr>
          `

        for (let j = 0; j < 7; j++) {

          daysCount++

          if (daysCount > noOfDays) { countEnded = 'Yes' }

          if (countEnded === 'Yes') {
            calender += `
              <td class="clouded after">${daysCount - noOfDays}</td>
            `
          } else {

            if (daysCount === date) {

              calender += `
                <td class="active">${daysCount}</td>
                `

            } else if (daysCount === datetr) {

              calender += `
                <td class="xactive">${daysCount}</td>
                `

            } else {

              calender += `
                <td>${daysCount}</td>
                `

            }
          }
        }

        calender += `
          </tr>`
      }

      if (daysCount < noOfDays) {

        calender += `
          <tr>
          `

        for (let j = 0; j < 7; j++) {

          daysCount++

          if (daysCount > noOfDays) { countEnded = 'Yes' }

          if (countEnded === 'Yes') {
            calender += `
              <td class="clouded after">${daysCount - noOfDays}</td>
            `
          } else {

            if (daysCount === date) {

              calender += `
              <td class="active">${daysCount}</td>
              `

            } else if (daysCount === datetr) {

              calender += `
              <td class="xactive">${daysCount}</td>
              `

            } else {

              calender += `
              <td>${daysCount}</td>
              `

            }
          }
        }

        calender += `
          </tr>`
      }

      return calender
    }

    monthE.innerText = month

    yearE.innerText = year

    if (
      `${date.getFullYear() + ' ' + date.getMonth()}`
      ===
      `${today.getFullYear() + ' ' + today.getMonth()}`
    ) {

      bodyE.innerHTML = makeCalende(today.getDate(), date.getDate())

    } else {

      bodyE.innerHTML = makeCalende(0, date.getDate())

    }

  }

  const addDateSuffix = function (dateX) {

    let date = dateX.toString()

    if (['11', '12', '13'].indexOf(date) !== -1) {
      date = date + 'th'
    } else if (date[date.length - 1] > '3') {
      date = date + 'th'
    } else if (date[date.length - 1] === '0') {
      date = date + 'th'
    } else if (date[date.length - 1] === '1') {
      date = date + 'st'
    } else if (date[date.length - 1] === '2') {
      date = date + 'nd'
    } else if (date[date.length - 1] === '3') {
      date = date + 'rd'
    }

    if (isNaN(parseInt(dateX))) { return dateX } else { return date }
  }

  const getDayNumber = function (day) {

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednessday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    return days.indexOf(day)

  }

  const getDay = function (number) {

    num = parseInt(number)

    const days = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednessday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    }

    return days[num]

  }

  const datetoTimeStr = function (theDate) {

    const acSeconds = timetoSeconds(theDate)

    const acTime = secondstoTimeStr(acSeconds)

    return acTime

  }

  const datetoFullTimeStr = function (theDate) {

    const acSeconds = timetoSeconds(theDate)

    const acTime = secondstoTimeStr(acSeconds, 3)

    return acTime

  }

  const getLeisureDate = function (date, theDate) {

    let returnValue

    if (date.getTime() === theDate.getTime()) {

      returnValue = 'Now'

    } else if (theDate.getTime() > date.getTime()) {

      const beginDate = (
        new Date(date.getTime() - (TimeCtrl.timetoSeconds(date) * 1000))
      ).getTime() - 1000

      if (theDate.getTime() < (beginDate + 86400000)) {

        returnValue = 'Today'

      } else if (
        theDate.getTime() > (beginDate + 86400000) &&
        theDate.getTime() < (beginDate + (86400000 * 2))
      ) {

        returnValue = 'Tommorow'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 2)) &&
        theDate.getTime() < (beginDate + (86400000 * 3))
      ) {

        returnValue = 'Two Days'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 3)) &&
        theDate.getTime() < (beginDate + (86400000 * 4))
      ) {

        returnValue = 'Three Days'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 4)) &&
        theDate.getTime() < (beginDate + (86400000 * 5))
      ) {

        returnValue = 'Four Days'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 5)) &&
        theDate.getTime() < (beginDate + (86400000 * 6))
      ) {

        returnValue = 'Five Days'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 6)) &&
        theDate.getTime() < (beginDate + (86400000 * 7))
      ) {

        returnValue = 'Six Days'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 7)) &&
        theDate.getTime() < (beginDate + (86400000 * 14))
      ) {

        returnValue = 'Two Weeks'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 14)) &&
        theDate.getTime() < (beginDate + (86400000 * 21))
      ) {

        returnValue = 'Three Weeks'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 21)) &&
        theDate.getTime() < (beginDate + (86400000 * 28))
      ) {

        returnValue = 'Four Weeks'

      } else if (
        theDate.getTime() > (beginDate + (86400000 * 28))
      ) {

        returnValue = `${addDateSuffix(theDate.getDate())} ${getMonth(theDate.getMonth())}`

      } else {
        returnValue = `${addDateSuffix(theDate.getDate())} ${getMonth(theDate.getMonth())}`
      }


    } else if (theDate.getTime() < date.getTime()) {

      const beginDate = (
        new Date(date.getTime() - (TimeCtrl.timetoSeconds(date) * 1000))
      ).getTime() - 1000

      if (
        theDate.getTime() < (beginDate + 86400000) &&
        theDate.getTime() > (beginDate)
      ) {

        returnValue = 'Today'

      } else if (
        theDate.getTime() < (beginDate) &&
        theDate.getTime() > (beginDate - 86400000)
      ) {

        returnValue = 'Yesterday'

      } else if (
        theDate.getTime() < (beginDate - 86400000) &&
        theDate.getTime() > (beginDate - (86400000 * 2))
      ) {

        returnValue = 'Two Days Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 2)) &&
        theDate.getTime() > (beginDate - (86400000 * 3))
      ) {

        returnValue = 'Three Days Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 3)) &&
        theDate.getTime() > (beginDate - (86400000 * 4))
      ) {

        returnValue = 'Four Days Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 4)) &&
        theDate.getTime() > (beginDate - (86400000 * 5))
      ) {

        returnValue = 'Five Days Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 5)) &&
        theDate.getTime() > (beginDate - (86400000 * 6))
      ) {

        returnValue = 'Six Days Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 6)) &&
        theDate.getTime() > (beginDate - (86400000 * 13))
      ) {

        returnValue = 'Two Weeks Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 13)) &&
        theDate.getTime() > (beginDate - (86400000 * 20))
      ) {

        returnValue = 'Three Weeks Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 20)) &&
        theDate.getTime() > (beginDate - (86400000 * 27))
      ) {

        returnValue = 'Four Weeks Ago'

      } else if (
        theDate.getTime() < (beginDate - (86400000 * 27))
      ) {

        returnValue = `${addDateSuffix(theDate.getDate())} ${getMonth(theDate.getMonth())}`

      } else {
        returnValue = `${addDateSuffix(theDate.getDate())} ${getMonth(theDate.getMonth())}`
      }


    } else {
      returnValue = `${addDateSuffix(theDate.getDate())} ${getMonth(theDate.getMonth())}`
    }

    return returnValue

  }

  const datetoDateStr = function (theDate) {

    return `${addDateSuffix(theDate.getDate())} of ${getMonth(theDate.getMonth())}, ${theDate.getFullYear()}`

  }

  const timeBetweenDatesW = function (date1, date2) {

    let returnValue

    const a = date1.getTime()

    const b = date2.getTime()

    const c = Math.abs(a - b)

    if (c <= 10000) {

      returnValue = ['Now', c]

    } else if (c > 10000 && c < 50000) {

      returnValue = [Math.floor(c / 1000) + 's', c]

    } else if (c >= 50000 && c <= 3540000) {

      returnValue = [Math.ceil(c / 60000) + 'm', c]

    } else if (c > 3540000 && c <= 82800000) {

      returnValue = [Math.ceil(c / 3600000) + 'h', c]

    } else if (c > 82800000 && c <= 604800000) {

      returnValue = [Math.ceil(c / 86400000) + 'd', c]

    } else {

      returnValue = [date2.toLocaleDateString(), c]

    }

    return returnValue

  }

  return {
    getNoDays: (number, year) => getNoDays(number, year),

    timeListToMilSeconds: (theList) => timeListToMilSeconds(theList),

    getDayNumber: (day) => getDayNumber(day),

    getLeisureDate: (date, theDate) => getLeisureDate(date, theDate),

    timeBetweenDatesW: (date1, date2) => timeBetweenDatesW(date1, date2),

    secondstoTimeStr: (number) => secondstoTimeStr(number),

    timetoSeconds: (theDate) => timetoSeconds(theDate),

    datetoTimeStr: (theDate) => datetoTimeStr(theDate),

    datetoFullTimeStr: (theDate) => datetoFullTimeStr(theDate),

    datetoDateStr: (theDate) => datetoDateStr(theDate),

    getMonth: (number) => getMonth(number),

    getDay: (number) => getDay(number),

    getMonthNumber: (month) => getMonthNumber(month),

    secondstoTimeList: (number) => secondstoTimeList(number),

    addDateSuffix: (dateX) => addDateSuffix(dateX),

    makeCalender: (date, monthE, yearE, bodyE) => makeCalender(date, monthE, yearE, bodyE)
  }

}())


//  Controller
const UserCtrl = (function () {

  return {

  }
})()


//  Controller
const WebSocketCtrl = (function () {

  const connect = (url) => {

    return new Promise(function (resolve, reject) {

      const server = new WebSocket(url)

      server.onopen = function () {

        resolve(server)

      }

      server.onclose = function (err) {

        reject(err)

      }

    })

  }

  const sendToUser = async (user, data) => {

    const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';

    const host = window.location.host

    const url = `${protocol}${host}/ws/chatty_user/${user}/`

    // console.log(url);

    try {

      const userSocket = await connect(url)

      userSocket.send(JSON.stringify({ text: data }))

      userSocket.close()

      return { msg: 'Successful' }

    } catch (error) {

      return { error: error }

    }

  }

  const sendToUserID = async (id, data) => {

    const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${id}/`

    const user = await APICtrl.getAPI_Json(url1)

    const newData = data

    newData.to = user.username

    await sendToUser(user.username, newData)

  }

  const sendToGroup = async (group, data) => {

    const groupData = data.to.group_members

    for (let id = 0; id < groupData.length; id++) {

      const item = groupData[id];

      await sendToUserID(item, data)

    }

  }


  return {

    sendToUser: (user, data) => sendToUser(user, data),

    sendToUserID: (id, data) => sendToUserID(id, data),

    sendToGroup: (group, data) => sendToGroup(group, data),

    connect: (url) => connect(url),

  }
})()


// Global Controller
const GlobalCtrl = (function () {

  let token

  if (document.querySelector('.sofilnxzcm-asdoidksmx')) {

    token = document.querySelector('.sofilnxzcm-asdoidksmx').innerText

    document.querySelector('.sofilnxzcm-asdoidksmx').remove()

  }

  const angleArrows = async (e) => {

    const dataUser = e.target.parentElement.dataset.user

    const dataType = e.target.parentElement.dataset.type

    const dataAcq = e.target.parentElement.dataset.acq

    const card = UICtrl.UIVars.preview

    let url;

    if (dataUser !== undefined) {

      if (dataType === 'dialogue') {

        url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataUser}/`

        const chattyUser = await APICtrl.getAPI_Json(url)

        let userImage, userDescription

        if (chattyUser.picture == null || chattyUser.picture == '') {

          const colors = ["#008000", "#4653a2", "#ce8a2c", "#ce2cb6", "#2ccecb", "#710875", "#86850c", "#21b9af", "#9acd32"]

          userImage = `
              <div class="preview-image">

                <span>

                  <span style="background-color: ${SpecialCtrl.chooseFrom(colors)};">

                    ${chattyUser.display_name[0]}

                  </span>

                </span>

              </div>
              `

        } else {

          userImage = `
                <div class="preview-image">

                  <div class="image-cont">

                    <img src="${chattyUser.picture}" alt="Profile Pic" onclick="GlobalCtrl.expandImage(event); return false">

                  </div>

                </div>
                `

        }

        let userName = `

              <div class="preview-name">

                <div class="label">Name:</div>

                <div>${chattyUser.display_name}</div>

              </div>

              `

        let userEmail = `

              <div class="preview-name">

                <div class="label">Email:</div>

                <div>${chattyUser.email}</div>

              </div>

              `

        let userLastSeen = `

              <div class="preview-created">

                <div class="label">Last Seen:</div>

                <div>${TimeCtrl.datetoDateStr(new Date(parseInt(chattyUser.last_seen)))} - ${TimeCtrl.datetoTimeStr(new Date(parseInt(chattyUser.last_seen)))}</div>

              </div>

              `

        let userAcq = `

              <div class="preview-name">

                <div class="label">Acquaintance:</div>

                <div class="capitalize">${dataAcq}</div>

              </div>

              `

        if (chattyUser.biography == null || chattyUser.biography == "") {

          userDescription = `

                <div class="preview-des">

                  <div class="label">Biography:</div>

                  <div><em>Not Provided</em></div>

                </div>
                `

        } else {

          userDescription = `

                <div class="preview-des">

                  <div class="label">Biography:</div>

                  <div>${chattyUser.biography}</div>

                </div>
                `

        }

        let userDateJoined = `

              <div class="preview-created">

                <div class="label">Date Joined:</div>

                <div>${TimeCtrl.datetoDateStr(new Date(parseInt(chattyUser.date_created)))} - ${TimeCtrl.datetoTimeStr(new Date(parseInt(chattyUser.date_created)))}</div>

              </div>
              `

        UICtrl.UIVars.preview.innerHTML = userImage + userName + userEmail + userLastSeen + userAcq + userDescription + userDateJoined

      } else if (dataType === 'group') {

        url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataUser}/`

        const chattyGroup = await APICtrl.getAPI_Json(url)

        let groupImage, groupDescription, membsStr = ''

        if (chattyGroup.group_image == null || chattyGroup.group_image == '') {

          const colors = ["#008000", "#4653a2", "#ce8a2c", "#ce2cb6", "#2ccecb", "#710875", "#86850c", "#21b9af", "#9acd32"]

          groupImage = `
              <div class="preview-image">

                <span>

                  <span style="background-color: ${SpecialCtrl.chooseFrom(colors)};">

                    ${chattyGroup.group_name[0]}

                  </span>

                </span>

              </div>
              `

        } else {

          groupImage = `
                <div class="preview-image">

                  <div class="image-cont">

                    <img src="${chattyGroup.group_image}" alt="Profile Pic" onclick="GlobalCtrl.expandImage(event); return false">

                  </div>

                </div>
                `

        }

        let groupName = `

              <div class="preview-name">

                <div class="label">Name:</div>

                <div>${chattyGroup.group_name}</div>

              </div>

              `

        let groupMembers = `<div class="preview-membs"></div>`

        if (chattyGroup.group_description == null || chattyGroup.group_description == "") {

          groupDescription = `

                <div class="preview-des">

                  <div class="label">Description:</div>

                  <div><em>Not Provided</em></div>

                </div>
                `

        } else {

          groupDescription = `

                <div class="preview-des">

                  <div class="label">Description:</div>

                  <div>${chattyGroup.group_description}</div>

                </div>
                `

        }


        let groupDateCreated = `

              <div class="preview-created">

                <div class="label">Date Created:</div>

                <div>${TimeCtrl.datetoDateStr(new Date(parseInt(chattyGroup.date_created)))} - ${TimeCtrl.datetoTimeStr(new Date(parseInt(chattyGroup.date_created)))}</div>

              </div>
              `

        UICtrl.UIVars.preview.innerHTML = groupImage + groupName + groupMembers + groupDescription + groupDateCreated

        for (const member of chattyGroup.group_members) {

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${member}/`

          const isAdmin = chattyGroup.group_admin.includes(member) ? 'admin' : 'not-admin'

          const memberData = await APICtrl.getAPI_Json(url)

          membsStr += `<a href="/dialogue/${memberData.username}" class="${isAdmin}">${memberData.display_name}</a>, `

        }

        membsStr = membsStr.slice(0, membsStr.length - 2)

        groupMembers = `<div class="label">Members:</div><div>${membsStr}</div>`

        UICtrl.findElement('.preview-membs').innerHTML = groupMembers
      }

    }

  }

  const expandImage = async (e) => {

    UICtrl.addClass(UICtrl.UIVars.specialOverflow, 'show')

    UICtrl.addClass(UICtrl.UIVars.expandImage, 'show')

    UICtrl.UIVars.expandImage.firstElementChild.src = e.target.src

  }

  const showEllipses = async (e) => {

    let item

    if (e.target.classList.contains('cover-all')) { item = e.target } else { item = e.target.parentElement }

    if (item.classList.contains('cover-all')) {

      // -----------------------------------------------------------------------------------------

      const type = item.dataset.type

      const groupName = item.dataset.name

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-group-settings/get-or-post/`

      const data = await APICtrl.postAPI_Json(url, {
        token: token,
        name: groupName
      })

      let pinstatus

      if (data.setting.pinned === false) {

        pinstatus = 'Pin'

      } else {

        pinstatus = 'Unpin'

      }

      // -----------------------------------------------------------------------------------------

      if (type == 'dialogue') {

        item.innerHTML = `
      <div class="elipses-content">

          <ul>

            <li data-group="${groupName}" onclick="GlobalCtrl.pinGroup(event); return false">${pinstatus}</li>

            <li data-group="${groupName}" onclick="GlobalCtrl.deleteDialogue(event); return false">Delete</li>

          </ul>

        </div>
      `

      } else {

        item.innerHTML = `
      <div class="elipses-content">

          <ul>

            <li data-group="${groupName}" onclick="GlobalCtrl.pinGroup(event); return false">${pinstatus}</li>

            <li data-group="${groupName}" onclick="GlobalCtrl.leaveGroup(event); return false">Leave Group</li>

          </ul>

        </div>
      `

      }

      item.parentElement.style.zIndex = '10'

      setTimeout(() => {

        const removeText = () => {

          item.innerHTML = '<span></span>'

          document.removeEventListener('click', removeText)

          item.parentElement.style.zIndex = ''

        }

        document.addEventListener('click', removeText)

      }, 1000);

    }

  }

  const showChatEllipses = async (e) => {

    let item = e.target

    item.innerHTML = `
        <div class="elipses-content">

        <ul>

          <li onclick="GlobalCtrl.replyMessage(event)">Reply</li>

          <li onclick="GlobalCtrl.copyMessage(event)">Copy</li>

          <li onclick="GlobalCtrl.deleteMessage(event)">Delete</li>

        </ul>

      </div>
    `

    setTimeout(() => {

      const removeText = () => {

        item.innerHTML = ''

        document.removeEventListener('click', removeText)

      }

      document.addEventListener('click', removeText)

    }, 100);

  }

  const showGroupEllipses = async (e) => {

    let item = e.target

    item.innerHTML = `
        <div class="elipses-content">

        <ul>

          <li onclick="GlobalCtrl.replyMessage(event)">Reply</li>

          <li onclick="GlobalCtrl.copyMessage(event)">Copy</li>

          <li onclick="GlobalCtrl.deleteGroupMessage(event)">Delete</li>

        </ul>

      </div>
    `

    setTimeout(() => {

      const removeText = () => {

        item.innerHTML = ''

        document.removeEventListener('click', removeText)

      }

      document.addEventListener('click', removeText)

    }, 100);

  }

  const replyMessage = async (e) => {

    const id = parseInt(e.target.parentElement.parentElement.parentElement.dataset.messageId)

    const newID = `mess-ref-${id}`

    const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${id}/`

    const message = await APICtrl.postAPI_Json(urlx, { token: token })

    const display = document.querySelector('.reffered-to')

    display.innerText = `Message: ${message.message.slice(0, 10)}...`

    display.setAttribute('data-ref', newID)

  }

  const copyMessage = async (e) => {

    const id = parseInt(e.target.parentElement.parentElement.parentElement.dataset.messageId)

    const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${id}/`

    const message = await APICtrl.postAPI_Json(urlx, { token: token })

    const textArea = document.createElement('textarea')

    textArea.style.position = 'fixed'

    textArea.style.top = '0'

    textArea.style.bottom = '0'

    textArea.style.width = '2rem'

    textArea.style.height = '2rem'

    textArea.style.padding = '0'

    textArea.style.border = 'none'

    textArea.style.outline = 'none'

    textArea.style.boxShadow = 'none'

    textArea.style.background = 'transparent'

    textArea.value = message.message

    document.body.appendChild(textArea)

    textArea.focus()

    textArea.select()

    document.execCommand('copy')

  }

  const deleteMessage = async (e) => {

    const id = parseInt(e.target.parentElement.parentElement.parentElement.dataset.messageId)

    const dataSet = document.querySelector('.right-side').dataset

    const url = window.location.protocol + '//' + window.location.host + `/api/is-dialogue/${dataSet.user}/${dataSet.other}/`

    const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

    const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.other}/`

    const groupName = await APICtrl.getAPI_Json(url)

    const chattyUser = await APICtrl.getAPI_Json(url1)

    const otherUser = await APICtrl.getAPI_Json(url2)

    const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${id}/`

    console.log(1);
    const message = await APICtrl.putAPI_Json(urlx, { token: token, type: 'delete' })
    console.log(12);

    await WebSocketCtrl.sendToUser(otherUser.username, {
      to: otherUser.username,
      toGroup: groupName.name,
      from: chattyUser.username,
      type: 'delete-message',
      id: message.messageID
    })

    await WebSocketCtrl.sendToUser(chattyUser.username, {
      to: chattyUser.username,
      toGroup: groupName.name,
      from: chattyUser.username,
      type: 'delete-message',
      id: message.messageID
    })

  }

  const deleteGroupMessage = async (e) => {

    const id = parseInt(e.target.parentElement.parentElement.parentElement.dataset.messageId)

    const dataSet = document.querySelector('.right-side').dataset

    const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

    const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

    const chattyUser = await APICtrl.getAPI_Json(url1)

    const group = await APICtrl.getAPI_Json(url2)

    const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${id}/`

    const message = await APICtrl.putAPI_Json(urlx, { token: token, type: 'delete' })

    await WebSocketCtrl.sendToGroup(group.name, {
      to: group,
      toGroup: group.name,
      from: chattyUser.username,
      type: 'delete-message',
      id: message.messageID
    })

  }

  const leaveGroup = async (e) => {

    const dataSet = e.target.dataset

    const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/leave-group/`

    const leave = await APICtrl.postAPI_Json(url, {
      token: token,
      group: dataSet.group
    })

  }

  const deleteDialogue = async (e) => {

    const dataSet = e.target.dataset

    const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/delete-dialogue/`

    const leave = await APICtrl.postAPI_Json(url, {
      token: token,
      group: dataSet.group
    })

  }

  const pinGroup = async (e) => {

    const ldataSet = UICtrl.UIVars.leftSide.dataset

    const dataSet = e.target.dataset

    const url = window.location.protocol + '//' + window.location.host + `/api/chatty-group-settings/get-or-post/`

    const data = await APICtrl.postAPI_Json(url, {
      token: token,
      name: dataSet.group
    })

    let pin

    if (data.setting.pinned === false) {

      pin = true

    } else {

      pin = false

    }

    const datax = await APICtrl.putAPI_Json(url, {
      token: token,
      name: dataSet.group,
      muted: data.setting.muted,
      pinned: pin
    })

    await WebSocketCtrl.sendToUser(ldataSet.user, {
      to: ldataSet.user,
      from: ldataSet.user,
      type: 'add-message',
    })

  }


  return {

    angleArrows: (e) => angleArrows(e),

    expandImage: (e) => expandImage(e),

    showEllipses: (e) => showEllipses(e),

    showChatEllipses: (e) => showChatEllipses(e),

    showGroupEllipses: (e) => showGroupEllipses(e),

    replyMessage: (e) => replyMessage(e),

    copyMessage: (e) => copyMessage(e),

    deleteMessage: (e) => deleteMessage(e),

    deleteGroupMessage: (e) => deleteGroupMessage(e),

    deleteDialogue: (e) => deleteDialogue(e),

    leaveGroup: (e) => leaveGroup(e),

    pinGroup: (e) => pinGroup(e),

  }

})()


// API Controller
const APICtrl = (function () {

  const getRandomApi = async function (url) {

    const response = await fetch(url)

    const responseJson = await response.json()

    return responseJson
  }

  async function getAPI_Json(url) {

    let ment = await fetch(url)

    let cent = await ment.json()

    return cent

  }

  async function postAPI_JsonWithFile(url, data) {

    const formData = new FormData();

    for (const name in data) {

      formData.append(name, data[name]);

    }

    let ment = await fetch(url, {
      method: 'POST',
      headers: {
        "X-CSRFToken": SpecialCtrl.getCookie('csrftoken')
      },
      body: formData
    })

    let cent = await ment.json()

    return cent

  }

  async function postAPI_Json(url, data) {

    let ment = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        "X-CSRFToken": SpecialCtrl.getCookie('csrftoken')
      },
      body: JSON.stringify(data)
    })

    let cent = await ment.json()

    return cent

  }

  async function putAPI_Json(url, data) {

    let ment = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        "X-CSRFToken": SpecialCtrl.getCookie('csrftoken')
      },
      body: JSON.stringify(data)
    })

    let cent = await ment.json()

    return cent

  }

  async function putAPI_JsonWithFile(url, data) {

    const formData = new FormData();

    for (const name in data) {

      formData.append(name, data[name]);

    }

    let ment = await fetch(url, {
      method: 'PUT',
      headers: {
        "X-CSRFToken": SpecialCtrl.getCookie('csrftoken')
      },
      body: formData
    })

    let cent = await ment.json()

    return cent

  }

  async function deleteAPI_Json(url) {

    let ment = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        "X-CSRFToken": SpecialCtrl.getCookie('csrftoken')
      },
    })

    let cent = await 'Deleted Successfully...'

    return cent

  }


  return {

    getRandomApi: (url) => getRandomApi(url),

    getAPI_Json: (url) => getAPI_Json(url),

    postAPI_Json: (url, data) => postAPI_Json(url, data),

    postAPI_JsonWithFile: (url, data) => postAPI_JsonWithFile(url, data),

    putAPI_Json: (url, data) => putAPI_Json(url, data),

    putAPI_JsonWithFile: (url, data) => putAPI_JsonWithFile(url, data),

    deleteAPI_Json: (url) => deleteAPI_Json(url),

  }
})();


// Special Functions
const SpecialCtrl = (function () {

  const randomAmong = (num1, num2) => {

    return (Math.floor(Math.random() * (num2 - num1 + 1))) + num1

  }

  const chooseFrom = (arr) => {

    return arr[randomAmong(0, (arr.length - 1))]

  }

  const shuffle = (arr) => {

    let array = arr.slice()

    for (let i = array.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];

    }

    return array

  }

  const heightAspect = (element, ratio) => {

    window.addEventListener('resize', () => {

      element.style.height = (element.offsetWidth * ratio) + 'px'

    })

  }

  const OHeightAspect = (element, ratio) => {

    element.style.height = (element.offsetWidth * ratio) + 'px'

  }

  const addNumbers = (from, to, element, interval) => {

    element.innerHTML = from

    const add = from < to

    let inx = setInterval(() => {

      let newNumb

      if (parseInt(element.innerHTML) === to) { clearInterval(inx); newNumb = '`.-x-`.' }

      if (newNumb === '`.-x-`.') {

      } else if (add === true) {

        newNumb = parseInt(element.innerHTML) + 1

        element.innerHTML = newNumb

      } else {

        newNumb = parseInt(element.innerHTML) - 1

        element.innerHTML = newNumb

      }

    }, interval);

  }

  const addLetters = (phrase, element, interval, toNfro, end) => {

    element.innerHTML = ''

    let theText = element.innerHTML

    end = end === undefined ? '' : end

    let full = false

    const nphrase = phrase

    let number = 0

    let inx = setInterval(() => {

      let newPhrase

      if (element.innerHTML == (phrase + end)) { newPhrase = '`.-x-`.' }


      // Checks if the phrase has once been completed
      if (full === true) {

        full = true

      } else {

        if (newPhrase === '`.-x-`.') { full = true }

      }



      // Checks if another same operation is running and terminates older one
      let otherText = element.innerHTML; let over = false;

      if (full === false) {

        if (theText !== element.innerHTML) { clearInterval(inx); over = true; }

      }


      // Checks if dev wants it to go to and fro and if completed
      if (full === true && toNfro === 0) {

        clearInterval(inx);

      } else {

        // Check if first stage has completed
        if (full === false) {

          element.innerHTML = nphrase.slice(0, number) + end;

          number++

        } else {

          if (number > 0) {

            // Set timeout for second stage based on toNfro
            setTimeout(() => {

              number--

              if (number >= 0) {

                if (theText !== element.innerHTML) { clearInterval(inx); over = true; }

                otherText = element.innerHTML

                element.innerHTML = nphrase.slice(0, number) + end

                if (over === true) { element.innerHTML = otherText; }

                theText = element.innerHTML;

              }


            }, toNfro);

          } else {

            clearInterval(inx)

          }

        }

      }

      if (full === false) {

        if (over === true) { element.innerHTML = otherText; }

        theText = element.innerHTML;

      }

    }, interval);

  }

  const togglePassword = (passwordInput, toggler, state) => {

    if (state === "hover") {

      toggler.addEventListener('mouseover', () => {

        passwordInput.type = 'text'

      })

      toggler.addEventListener('mouseout', () => {

        passwordInput.type = 'password'

      })


    } else if (state === "click") {

      toggler.addEventListener("click", () => {

        if (passwordInput.type === "password") {

          passwordInput.type = 'text'

        } else {

          passwordInput.type = 'password'

        }


      })

    }

  }

  const getCookie = (name) => {

    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {

      const cookies = document.cookie.split(';');

      for (const i = 0; i < cookies.length; i++) {

        const cookie = cookies[i].trim();

        // Does this cookie string begin with the name we want?

        if (cookie.substring(0, name.length + 1) === (name + '=')) {

          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

          break;

        }

      }

    }

    return cookieValue;

  }

  const urlify = (text) => {

    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig

    return text.replace(urlRegex, function (url) {

      return '<a target="_blank" href="' + url + '">' + url + '</a>';

    })

  }

  const replaceAsync = async (str, regex, asyncFn) => {

    const promises = [];

    str.replace(regex, (match, ...args) => {

      const promise = asyncFn(match, ...args);

      promises.push(promise);

    });

    const data = await Promise.all(promises);

    return str.replace(regex, () => data.shift());

  }

  const getUsername = async (text) => {

    var urlRegex = /___ ([a-z0-9]){3,} ___/ig;

    const returnValue = await replaceAsync(text, urlRegex, async function (item) {

      const username = item.slice(4, item.length - 4)

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${username}/`

      const chattyUser = await APICtrl.getAPI_Json(url)

      if (chattyUser.username == '') {

        return item

      } else {

        const url = window.location.protocol + '//' + window.location.host + `/dialogue/${username}`

        return `<a target="_blank" href="${url}">${username}</a>`;

      }


    })

    return returnValue

  }

  const copyText = (text) => {

    const textArea = document.createElement('textarea')

    textArea.style.position = 'fixed'

    textArea.style.top = '0'

    textArea.style.bottom = '0'

    textArea.style.width = '2rem'

    textArea.style.height = '2rem'

    textArea.style.padding = '0'

    textArea.style.border = 'none'

    textArea.style.outline = 'none'

    textArea.style.boxShadow = 'none'

    textArea.style.background = 'transparent'

    textArea.value = text

    document.body.appendChild(textArea)

    textArea.focus()

    textArea.select()

    document.execCommand('copy')

  }


  return {
    randomAmong: (num1, num2) => randomAmong(num1, num2),

    chooseFrom: (arr) => chooseFrom(arr),

    shuffle: (arr) => shuffle(arr),

    getCookie: (name) => getCookie(name),

    urlify: (text) => urlify(text),

    copyText: (text) => copyText(text),

    getUsername: (text) => getUsername(text),

    replaceAsync: (str, regex, asyncFn) => (str, regex, asyncFn),

    heightAspect: (element, ratio) => heightAspect(element, ratio),

    OHeightAspect: (element, ratio) => OHeightAspect(element, ratio),

    addNumbers: (from, to, element, interval) => addNumbers(from, to, element, interval),

    addLetters: (phrase, element, interval, toNfro, end) => addLetters(phrase, element, interval, toNfro, end),

    togglePassword: (passwordInput, toggler, state) => togglePassword(passwordInput, toggler, state),
  }

})()


// UI Controller
const UICtrl = (function () {

  const findElement = function (tag) {

    return document.querySelector(tag)

  }

  const findElements = function (tag) {

    return document.querySelectorAll(tag)

  }

  const findBy = function (element, tag) {

    return element.querySelector(tag)

  }

  const findsBy = function (element, tag) {

    return element.querySelectorAll(tag)

  }

  const addClass = function (element, clas) {
    element.classList.add(clas)
  }

  const toggleClass = function (element, clas) {

    if (element.classList.contains(clas)) {
      removeClass(element, clas)
    } else {
      addClass(element, clas)
    }

  }

  const toggleWithDocument = function (clicker, element, clas) {

    clicker.addEventListener('click', (e) => {

      const theFunc = function () {

        removeClass(element, clas)

        document.removeEventListener('click', theFunc)

      }

      if (element.classList.contains(clas)) {

        theFunc()

      } else {

        addClass(element, clas)

        setTimeout(() => {

          document.addEventListener('click', theFunc)

        }, 10);

      }

    })

  }

  const removeClass = function (element, clas) {
    element.classList.remove(clas)
  }

  const transitionSroll = function (item, clicker, seconds) {

    clicker.addEventListener('click', () => {

      const normHeight = item.scrollHeight

      const actualHeight = item.clientHeight

      item.style.overflow = `hidden`

      if (actualHeight === 0) {

        item.style.transition = `height ${seconds}s`

        item.style.height = `${normHeight}px`

        setTimeout(() => {

          item.style.height = `auto`

        }, seconds * 1000);

      } else {

        item.style.height = `${normHeight}px`

        setTimeout(() => {

          item.style.transition = `height ${seconds}s`

          item.style.height = `0px`

        }, 10);

      }

    })

  }

  const tabilize = function (tabHolder, elemHolder, tabName, elemName) {

    const tabChildren = tabHolder.children

    const elementChildren = elemHolder.children

    tabHolder.addEventListener('click', (e) => {

      if (e.target.classList.contains(tabName)) {

        const caughtNum = `${elemName}-${e.target.id.split('-')[1]}`

        for (let i = 0; i < tabChildren.length; i++) {
          const element = tabChildren[i];

          removeClass(element, 'active')

        }

        addClass(e.target, 'active')

        for (let i = 0; i < elementChildren.length; i++) {
          const element = elementChildren[i];

          removeClass(element, 'show')

          if (element.id === caughtNum) {
            addClass(element, 'show')
          }
        }
      }

    })

  }

  const insertSVG = function (element) {

    if (element === undefined) {

      return [
        findElements('.js-circle-check'),

        findElements('.js-question'),

        findElements('.js-arrow-left'),

        findElements('.js-elipses'),

        findElements('.js-arrow-right'),

        findElements('.js-angle-right'),

        findElements('.js-angle-left'),

        findElements('.js-calender'),

        findElements('.js-circle-check'),

        findElements('.js-dark-message'),

        findElements('.js-message'),

        findElements('.js-whatsapp'),

        findElements('.js-linkedin'),

        findElements('.js-twitter'),

        findElements('.js-instagram'),

        findElements('.js-phone'),

        findElements('.js-logout'),

        findElements('.js-home'),

        findElements('.js-graph'),

        findElements('.js-summary'),

        findElements('.js-dollar'),

        findElements('.js-check'),

        findElements('.js-crossx'),

        findElements('.js-eyeliner'),

        findElements('.js-lock'),

        findElements('.js-user'),

        findElements('.js-users'),

        findElements('.js-paper-plane'),
      ]

    } else {

      if (element.classList.contains('js-question')) {
        const elementa = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-arrow-left')) {
        const elementa = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path xmlns="http://www.w3.org/2000/svg" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/>
        </svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-elipses')) {
        const elementa = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
        <path
          d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z" />
        </svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-arrow-right')) {
        const elementa = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path xmlns="http://www.w3.org/2000/svg" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/>
        </svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-calender')) {
        const elementa = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/>
        </svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-circle-check')) {
        const elementa = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-dark-message')) {
        const elementa = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-message')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-whatsapp')) {
        const elementa = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-linkedin')) {
        const elementa = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-twitter')) {
        const elementa = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-instagram')) {
        const elementa = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-phone')) {
        const elementa = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"/></svg>
        `;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-logout')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-home')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-graph')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-summary')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-dollar')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512"><path d="M209.2 233.4l-108-31.6C88.7 198.2 80 186.5 80 173.5c0-16.3 13.2-29.5 29.5-29.5h66.3c12.2 0 24.2 3.7 34.2 10.5 6.1 4.1 14.3 3.1 19.5-2l34.8-34c7.1-6.9 6.1-18.4-1.8-24.5C238 74.8 207.4 64.1 176 64V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48h-2.5C45.8 64-5.4 118.7.5 183.6c4.2 46.1 39.4 83.6 83.8 96.6l102.5 30c12.5 3.7 21.2 15.3 21.2 28.3 0 16.3-13.2 29.5-29.5 29.5h-66.3C100 368 88 364.3 78 357.5c-6.1-4.1-14.3-3.1-19.5 2l-34.8 34c-7.1 6.9-6.1 18.4 1.8 24.5 24.5 19.2 55.1 29.9 86.5 30v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48.2c46.6-.9 90.3-28.6 105.7-72.7 21.5-61.6-14.6-124.8-72.5-141.7z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-check')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-crossx')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-eyeliner')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-lock')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-angle-right')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-angle-left')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-user')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-users')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/></svg>`;
        element.innerHTML = elementa
      }
      else if (element.classList.contains('js-paper-plane')) {
        const elementa = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"/></svg>`;
        element.innerHTML = elementa
      }
    }

  }


  const UIVars = {

    // Rest Elements
    body: findElement('body'),

    html: findElement('html'),

    // Side Bar Button
    fullHolder: findElement('.full-holder'),

    sideButton: findElement('#bp-ssb'),

    theSideBar: findElement('.the-sidebar'),

    // Bar
    rightSide: findElement('.right-side'),

    rightSideInner: findElement('.right-side .inner'),

    leftSide: findElement('.left-side'),

    leftSideInner: findElement('.left-side .inner'),

    newNotification: findElement('.new-notification'),

    searchBar: findElement('.find-bar'),

    writeDate: findElement('#write-date'),


    // Chat Form
    chatForm: findElement('#chat-form'),

    chatMessage: findElement('#message-text'),

    chatRefer: findElement('.reffered-to'),

    chatFileField: findElement('#file-field'),

    chatFileCover: findElement('.file-cover'),

    chatAddUsername: findElement('.add-username'),

    formDeleteUser: findElement('#form-felete-chatty-user'),


    // Settings Form
    imageContainer: findElement('.image-container'),

    nameField: findElement('#name-field'),

    nameFieldSave: findElement('#name-field-save'),

    numberField: findElement('#number-field'),

    numberFieldSave: findElement('#number-field-save'),

    descriptionField: findElement('#description-field'),

    descriptionFieldSave: findElement('#description-field-save'),

    pinned: findElement('#pinned'),

    muted: findElement('#muted'),

    adminLink: findElement('#admin-link'),

    adminLinkGenerate: findElement('#admin-link-generate'),

    adminLinkCopy: findElement('#admin-link-copy'),

    joinLink: findElement('#join-link'),

    joinLinkGenerate: findElement('#join-link-generate'),

    joinLinkCopy: findElement('#join-link-copy'),

    passwordInput: findElement('#passwordField'),

    passwordInput2: findElement('#passwordField2'),

    passwordSave: findElement('#password-field-save'),

    passwordSVG: findElement('#the-end-svg'),

    passwordSVG2: findElement('#the-end-svg2'),


    // Preview
    preview: findElement('#preview-card'),

    specialOverflow: findElement('.special-overflow'),

    expandImage: findElement('.expand-image'),
  }

  return {

    UIVars: UIVars,

    findElement: (tag) => findElement(tag),

    findBy: (element, tag) => findBy(element, tag),

    findsBy: (element, tag) => findsBy(element, tag),

    findElements: (tag) => findElements(tag),

    insertSVG: (element) => insertSVG(element),

    addClass: (element, clas) => addClass(element, clas),

    toggleClass: (element, clas) => toggleClass(element, clas),

    removeClass: (element, clas) => removeClass(element, clas),

    toggleWithDocument: (clicker, element, clas) =>
      toggleWithDocument(clicker, element, clas),

    tabilize: (tabHolder, elemHolder, tabName, elemName) =>
      tabilize(tabHolder, elemHolder, tabName, elemName),

    transitionSroll: (item, clicker, seconds) =>
      transitionSroll(item, clicker, seconds)

  }
})()


// App Controller
const App = (function (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl) {

  const loadEventListeners = function () {
    const UIVars = UICtrl.UIVars

    if (UIVars.sideButton !== null) {

      UIVars.sideButton.addEventListener('click', (e) => {

        if (UIVars.fullHolder.classList.contains('side-out')) {

          UICtrl.addClass(UIVars.fullHolder, 'side-in')

          UICtrl.removeClass(UIVars.fullHolder, 'side-out')

          UICtrl.addClass(UIVars.fullHolder, 'moving')

          setTimeout(() => {

            UICtrl.removeClass(UIVars.fullHolder, 'moving')

          }, 1000);

          UIVars.sideButton.innerHTML = `<i class="pin-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/></svg></i>
                        <i class="pin-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/></svg></i>`

        } else {

          UICtrl.addClass(UIVars.fullHolder, 'side-out')

          UICtrl.removeClass(UIVars.fullHolder, 'side-in')

          UICtrl.addClass(UIVars.fullHolder, 'moving')

          setTimeout(() => {

            UICtrl.removeClass(UIVars.fullHolder, 'moving')

          }, 1000);

          UIVars.sideButton.innerHTML = `
                        <i class="pin-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg></i>
                        <i class="pin-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg></i>`

        }

      })

    }

  }

  const firstInit = function () {

  }

  const loadInit = function () {

    // Insert all SVG
    UICtrl.insertSVG().forEach((nodlist) => {

      nodlist.forEach((elemen) => {

        UICtrl.insertSVG(elemen)

      })

    })

  }

  return {
    init: () => {

      loadEventListeners()

      firstInit()

      loadInit()

      console.log('Application is successfully running...')

    }
  }
})
  (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', App.init)
