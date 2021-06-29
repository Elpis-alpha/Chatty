// App Controller
const NotificationCtrl = (function (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl) {

  const token = UICtrl.findElement('.sofilnxzcm-asdoidkxm').innerText

  UICtrl.findElement('.sofilnxzcm-asdoidkxm').remove()

  const loadEventListeners = function () {

  }

  const firstInit = function () {

  }

  const loadInit = async function () {

    const constructNotification = (href, type, time, header, message, id) => {

      const holder = document.createElement('a')

      UICtrl.addClass(holder, 'notification-holder')

      holder.href = href

      holder.id = `Notification-loaded-${id}`

      const notiTop = document.createElement('div')

      UICtrl.addClass(notiTop, 'noti-top')


      const notiTopSVG = document.createElement('div')

      UICtrl.addClass(notiTopSVG, 'noti-top-svg')

      notiTopSVG.innerHTML = `<i class="js-message"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path></svg></i>`


      const notiTopMessage = document.createElement('div')

      UICtrl.addClass(notiTopMessage, 'noti-top-message')

      notiTopMessage.appendChild(document.createTextNode(type))


      const notiTopTime = document.createElement('div')

      UICtrl.addClass(notiTopTime, 'time-sent')

      notiTopTime.appendChild(document.createTextNode(time))


      notiTop.appendChild(notiTopSVG)

      notiTop.appendChild(notiTopMessage)

      notiTop.appendChild(notiTopTime)


      const notiHead = document.createElement('div')

      UICtrl.addClass(notiHead, 'noti-head')

      notiHead.appendChild(document.createTextNode(header))


      const notiBody = document.createElement('div')

      UICtrl.addClass(notiBody, 'noti-body')

      notiBody.appendChild(document.createTextNode(message))


      holder.appendChild(notiTop)

      holder.appendChild(notiHead)

      holder.appendChild(notiBody)

      return holder

    }

    const showNotification = (holder) => {

      UICtrl.UIVars.newNotification.innerHTML = ''

      UICtrl.UIVars.newNotification.appendChild(holder)

      let list = StorageCtrl.getSessionList('Notification List')

      if (list === null) { list = [] }

      if (list.includes(holder.id)) {

      } else {

        StorageCtrl.appendSessionList('Notification List', holder.id)

        UICtrl.addClass(UICtrl.UIVars.newNotification, 'show')

        setTimeout(() => {

          UICtrl.removeClass(UICtrl.UIVars.newNotification, 'show')

          holder.remove()

        }, 2000);

      }

    }

    const loadNotifications = async (number) => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.theSideBar.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url)

      const notiURL = window.location.protocol + '//' + window.location.host + `/api/notifications/by-start-and-stop/`

      const notifications = await APICtrl.postAPI_Json(notiURL, {
        token: token,
        start: 0,
        stop: 50
      })

      for (let index = 0; index < notifications.length; index++) {

        const notification = notifications[index];

        const time = TimeCtrl.timeBetweenDatesW(new Date(), new Date(notification.date_sent))

        const type = notification.detail

        let href = ''

        if (type === 'Nil') {

          href = ''

        } else {

          if (type.split(':')[0] === 'Dialogue') {

            href = '/dialogue/' + type.split(':')[1]

          } else if (type.split(':')[0] === 'Group') {

            href = '/group/' + type.split(':')[1]

          }

        }

        const holder = constructNotification(href, notification.name, time[0], notification.header, notification.content, notification.id)

        UIVars.theSideBar.appendChild(holder)

        if (0 === index) {

          showNotification(constructNotification(href, notification.name, time[0], notification.header, notification.content, notification.id))

        }

      }

    }

    const webSocketsHandler = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.theSideBar.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url)

      var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';

      let chatSocket = await WebSocketCtrl.connect(protocol + window.location.host + '/ws/chatty_user/' + chattyUser.username + '/');

      chatSocket.onmessage = async (msg) => {

        let data = JSON.parse(msg.data).message

        if (data.to == chattyUser.username) {

          loadNotifications(50)

        } else {

          console.log(data)

        }

      }

      chatSocket.onclose = async () => {

        console.log('Websocket Closed Unexpectedly');

        const x = setInterval(async () => {

          console.log('Trying to reconnect to Server...');

          try {

            chatSocket = null;

            const sock = await webSocketsHandler()

            console.log(sock.readyState);

            if (sock.readyState !== WebSocket.OPEN) { const err = new Error(Failed); throw err }

            clearInterval(x)

          } catch (error) {

            console.error(`Connection Failed due to: ${error.message}`);

          }


        }, 5000);

      }

      return chatSocket

    }

    loadNotifications(50)

    await webSocketsHandler()

  }

  return {
    init: () => {

      loadEventListeners()

      firstInit()

      loadInit()

      console.log('Notification application is successfully running...')

    }
  }
})
  (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', NotificationCtrl.init)
