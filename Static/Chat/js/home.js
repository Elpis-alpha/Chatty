// App Controller
const Application = (function (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl) {

  const token = UICtrl.findElement('.sofilnxzcm-asdoidksm').innerText

  UICtrl.findElement('.sofilnxzcm-asdoidksm').remove()

  const loadEventListeners = function () {

    UICtrl.UIVars.expandImage.addEventListener('click', () => {

      UICtrl.removeClass(UICtrl.UIVars.specialOverflow, 'show')

      UICtrl.removeClass(UICtrl.UIVars.expandImage, 'show')

    })

  }

  const firstInit = function () {

  }

  const loadInit = async function () {

    const constructEndBorder = () => {

      const holder = document.createElement('span')

      UICtrl.addClass(holder, 'bottom-chat-border')

      const holderSpan001 = document.createElement('span')

      UICtrl.addClass(holderSpan001, 'bottom-chat-border001')

      const holderSpan002 = document.createElement('span')

      UICtrl.addClass(holderSpan002, 'bottom-chat-border002')

      holder.appendChild(holderSpan001)

      holder.appendChild(holderSpan002)

      return holder

    }

    const constructChatFunctions = (type, name, user) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'chat-functions')

      const holderElpises = document.createElement('div')

      UICtrl.addClass(holderElpises, 'chat-elipses')

      holderElpises.innerHTML = `<i class="js-elipses"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></i>`

      holderElpises.innerHTML += `<span class="cover-all" data-user="${user}" data-name="${name}" data-type="${type}" onclick="GlobalCtrl.showEllipses(event); return false"><span></span></span>`

      const holderNext = document.createElement('div')

      UICtrl.addClass(holderNext, 'chat-next')

      switch (type) {

        case "group":

          holderNext.innerHTML = `<a href="/group-detail/${name}" class="chat-next-arrow-link"></a>`

          break;

        case "dialogue":

          holderNext.innerHTML = `<a href="/user-detail/${user}" class="chat-next-arrow-link"></a>`

          break;

        default:

          holderNext.innerHTML = ``

          break;
      }

      holderNext.innerHTML += `<i class="js-angle-right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg></i>`

      holderNext.innerHTML += `<span class="cover-all" data-user="${user}" data-name="${name}" data-type="${type}" onclick="GlobalCtrl.angleArrows(event); return false"><span></span></span>`

      holder.appendChild(holderElpises)

      holder.appendChild(holderNext)

      return holder

    }

    const constructChatDetails = (name, typeSVG, date, sent, message, messageNumber) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'chat-details')


      const holderTop = document.createElement('div')

      UICtrl.addClass(holderTop, 'chat-details-top')


      const holderTopName = document.createElement('div')

      UICtrl.addClass(holderTopName, 'chat-name')

      holderTopName.appendChild(document.createTextNode(name))


      const holderTopSVG = document.createElement('div')

      UICtrl.addClass(holderTopSVG, 'chat-svg')

      switch (typeSVG) {

        case "acq":

          UICtrl.addClass(holderTopSVG, 'acq')

        case "dia":

          holderTopSVG.innerHTML = `<i class="js-user" title="Normal User"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></i>`

          break;

        case "group":

          holderTopSVG.innerHTML = `<i class="js-users" title="Group"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg></i>`

          break;

        default:
          break;
      }


      const holderTopMessage = document.createElement('div')

      UICtrl.addClass(holderTopMessage, 'message-sent-date')

      holderTopMessage.appendChild(document.createTextNode(date))


      holderTop.appendChild(holderTopName)

      holderTop.appendChild(holderTopSVG)

      if (parseInt(messageNumber) > 0) {

        const holderTopMessageNumber = document.createElement('div')

        UICtrl.addClass(holderTopMessageNumber, 'message-number')

        holderTopMessageNumber.innerText = messageNumber

        holderTop.appendChild(holderTopMessageNumber)

      }

      holderTop.appendChild(holderTopMessage)


      const holderBottom = document.createElement('div')

      UICtrl.addClass(holderBottom, 'chat-details-bottom')


      const holderBottomStatus = document.createElement('div')

      UICtrl.addClass(holderBottomStatus, 'message-status')

      if (sent === true) {

        holderBottomStatus.innerHTML = `✓✓`

      } else if (sent === false) {

        holderBottomStatus.innerHTML = `✓`

      } else {

        holderBottomStatus.innerHTML = ``

      }


      const holderBottomMessage = document.createElement('div')

      UICtrl.addClass(holderBottomMessage, 'chat-last-message')

      holderBottomMessage.appendChild(document.createTextNode(message.message))

      if (parseInt(messageNumber) > 0) {

        UICtrl.addClass(holderBottomMessage, 'unread-message')

      }

      holderBottom.appendChild(holderBottomStatus)

      holderBottom.appendChild(holderBottomMessage)


      holder.appendChild(holderTop)

      holder.appendChild(holderBottom)

      return holder

    }

    const constructChatImage = (type, image, letter, col) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'chat-image')

      let holderInside

      let color = ["#008000", "#4653a2", "#ce8a2c", "#ce2cb6", "#2ccecb", "#710875", "#86850c", "#21b9af", "#9acd32"]

      if (col) { color = [col] }

      if (type === 'text') {

        holderInside = document.createElement('span')

        UICtrl.addClass(holderInside, 'replace-image')

        holderInside.style.backgroundColor = SpecialCtrl.chooseFrom(color)

        const holderSpan = document.createElement('span')

        holderSpan.appendChild(document.createTextNode(letter))

        holderInside.appendChild(holderSpan)

      } else {

        holderInside = document.createElement('div')

        UICtrl.addClass(holderInside, 'image-cont')


        const holderInsideImage = document.createElement('div')

        UICtrl.addClass(holderInsideImage, 'image-inside')


        const holderImage = document.createElement('img')

        holderImage.setAttribute('src', image)

        holderImage.setAttribute('alt', 'Pic')

        holderImage.onclick = (e) => { GlobalCtrl.expandImage(e); return false }


        holderInsideImage.appendChild(holderImage)

        holderInside.appendChild(holderInsideImage)

      }

      holder.appendChild(holderInside)

      return holder

    }

    const positionGroup = async (data) => {

      const target = UICtrl.findElement(`#Group-${data.toGroup}`)

      if (target == null) {

        loadGroups()

      } else {

        target.remove()

        UICtrl.UIVars.leftSide.children[0].prepend(target)

        updateGroup(data)

      }

    }

    const updateGroup = async (data) => {

      const target = UICtrl.findElement(`#Group-${data.toGroup}`)

      if (target == null) {

        loadGroups()

      } else {

        const UIVars = UICtrl.UIVars

        const dataSet = UIVars.leftSide.dataset

        const groupSet = target.dataset

        let color = ["#008000", "#4653a2", "#ce8a2c", "#ce2cb6", "#2ccecb", "#710875", "#86850c", "#21b9af", "#9acd32"]

        const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

        const chattyUser = await APICtrl.getAPI_Json(url)

        const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${groupSet.group}/`

        const group = await APICtrl.getAPI_Json(url1)

        const url2 = window.location.protocol + '//' + window.location.host + `/api/messages/by-group-last/`

        const message = await APICtrl.postAPI_Json(url2, { token: token, name: group.name })

        const url3 = window.location.protocol + '//' + window.location.host + `/api/chatty-group-settings/get-or-post/`

        const gpSetting = await APICtrl.postAPI_Json(url3, { token: token, name: group.name })

        if (gpSetting.setting.pinned) {

          target.style.order = '1'

        } else {

          target.style.order = '3'

        }

        if (group.is_dialogue === true) {

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${groupSet.user}/`

          const otherUser = await APICtrl.getAPI_Json(url)

          const url1 = window.location.protocol + '//' + window.location.host + `/api/is-acquaintance/${dataSet.user}/${groupSet.user}/`

          const isAcquaintance = await APICtrl.getAPI_Json(url1)

          if (UICtrl.findBy(target, '.replace-image') === null) {

            color = SpecialCtrl.chooseFrom(color)

          } else {

            color = UICtrl.findBy(target, '.replace-image').style.backgroundColor

          }

          const chatCard = document.createElement('div')

          UICtrl.addClass(chatCard, 'chat-card')

          if (otherUser.picture == '' || otherUser.picture == null) {

            chatCard.appendChild(constructChatImage('text', null, otherUser.display_name[0], color))

          } else {

            chatCard.appendChild(constructChatImage('image', otherUser.picture))

          }

          let sent

          if (message.date_received) {

            if (message.date_received == '') {

              sent = false

            } else {

              sent = true

            }

          } else {

            sent = false

          }

          let msgSvg

          if (isAcquaintance.msg) { msgSvg = 'acq'; otherUser.display_name = isAcquaintance.name } else { msgSvg = 'dia' }

          if (message.sender_id == chattyUser.id) {

            chatCard.appendChild(constructChatDetails(otherUser.display_name, msgSvg, TimeCtrl.datetoTimeStr(new Date(message.date_created)), sent, message, message.count))

          } else {

            chatCard.appendChild(constructChatDetails(otherUser.display_name, msgSvg, TimeCtrl.datetoTimeStr(new Date(message.date_created)), '', message, message.count))

          }

          chatCard.appendChild(constructChatFunctions('dialogue', group.name, otherUser.username))

          target.children[0].remove()

          target.prepend(chatCard)

        } else {

          if (UICtrl.findBy(target, '.replace-image') === null) {

            color = SpecialCtrl.chooseFrom(color)

          } else {

            color = UICtrl.findBy(target, '.replace-image').style.backgroundColor

          }

          const chatCard = document.createElement('div')

          UICtrl.addClass(chatCard, 'chat-card')

          if (group.group_image == '' || group.group_image == null) {

            chatCard.appendChild(constructChatImage('text', null, group.group_name[0]))

          } else {

            chatCard.appendChild(constructChatImage('image', group.group_image))

          }

          let sent

          if (message.date_received) {

            if (message.date_received == '') {

              sent = false

            } else {

              sent = true

            }

          } else {

            sent = false

          }

          if (message.sender_id == chattyUser.id) {

            chatCard.appendChild(constructChatDetails(group.group_name, 'group', TimeCtrl.datetoTimeStr(new Date(message.date_created)), sent, message, message.count))

          } else {

            chatCard.appendChild(constructChatDetails(group.group_name, 'group', TimeCtrl.datetoTimeStr(new Date(message.date_created)), '', message, message.count))

          }

          chatCard.appendChild(constructChatFunctions('group', group.name, group.name))

          target.children[0].remove()

          target.prepend(chatCard)

        }

      }

    }

    const loadGroups = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.leftSide.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url)


      const groupsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/get-all-groups-by/`

      const chattyGroup = await APICtrl.postAPI_Json(groupsURL, { token: token })


      if (chattyGroup.msg == 'Successful') {

        const chattyGroups = chattyGroup.groups

        const holder = document.createElement('div')

        UICtrl.addClass(holder, 'inner')

        for (let index = 0; index < chattyGroups.length; index++) {

          const group = chattyGroups[index];

          const allHolder = document.createElement('a')

          allHolder.setAttribute('id', 'Group-' + group.name)

          if (group.is_dialogue) {

            allHolder.setAttribute('data-group', group.name)

            allHolder.setAttribute('data-user', group.other_user)

            allHolder.setAttribute('href', `/dialogue/${group.other_user}`)


            const chatCard = document.createElement('div')

            UICtrl.addClass(chatCard, 'chat-card')

            if (group.other_user_picture == '' || group.other_user_picture == null) {

              chatCard.appendChild(constructChatImage('text', null, group.other_user_name[0]))

            } else {

              chatCard.appendChild(constructChatImage('image', `/media/${group.other_user_picture}`))

            }

            let sent

            if (group.last_message.date_received) {

              if (group.last_message.date_received == '') {

                sent = false

              } else {

                sent = true

              }

            } else {

              sent = false

            }

            const msgSvg = group.is_acq ? 'acq' : 'dia'

            if (group.last_message.sender_id == chattyUser.id) {

              chatCard.appendChild(constructChatDetails(group.other_user_name, msgSvg, TimeCtrl.datetoTimeStr(new Date(group.last_message.date_created)), sent, group.last_message, group.count))

            } else {

              chatCard.appendChild(constructChatDetails(group.other_user_name, msgSvg, TimeCtrl.datetoTimeStr(new Date(group.last_message.date_created)), '', group.last_message, group.count))

            }

            chatCard.appendChild(constructChatFunctions('dialogue', group.name, group.other_user))

            allHolder.appendChild(chatCard)

          } else {

            allHolder.setAttribute('data-group', group.name)

            allHolder.setAttribute('href', `/group/${group.name}`)


            const chatCard = document.createElement('div')

            UICtrl.addClass(chatCard, 'chat-card')

            if (group.group_image == '' || group.group_image == null) {

              chatCard.appendChild(constructChatImage('text', null, group.group_name[0]))

            } else {

              chatCard.appendChild(constructChatImage('image', `/media/${group.group_image}`))

            }

            let sent

            if (group.last_message.date_received) {

              if (group.last_message.date_received == '') {

                sent = false

              } else {

                sent = true

              }

            } else {

              sent = false

            }

            if (group.last_message.sender_id == chattyUser.id) {

              chatCard.appendChild(constructChatDetails(group.group_name, 'group', TimeCtrl.datetoTimeStr(new Date(group.last_message.date_created)), sent, group.last_message))

            } else {

              chatCard.appendChild(constructChatDetails(group.group_name, 'group', TimeCtrl.datetoTimeStr(new Date(group.last_message.date_created)), '', group.last_message))

            }

            chatCard.appendChild(constructChatFunctions('group', group.name, group.name))

            allHolder.appendChild(chatCard)

          }

          if (group.pinned) {

            allHolder.style.order = '1'

          } else {

            allHolder.style.order = '3'

          }

          allHolder.appendChild(constructEndBorder())

          holder.appendChild(allHolder)

        }

        UIVars.leftSide.children[0].remove()

        UIVars.leftSide.prepend(holder)

      }

    }

    const loadRandomDialogues = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.leftSide.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url)


      const groupsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/get-random-dialogues/`

      const chattyGroup = await APICtrl.postAPI_Json(groupsURL, { token: token, number: 50 })


      if (chattyGroup.msg == 'Successful') {

        const chattyGroups = chattyGroup.groups

        const holder = document.createElement('div')

        UICtrl.addClass(holder, 'inner-other')

        const holderSpan = document.createElement('span')

        holderSpan.appendChild(document.createTextNode('Other Users'))

        holder.appendChild(holderSpan)

        for (let index = 0; index < chattyGroups.length; index++) {

          const group = chattyGroups[index];

          const allHolder = document.createElement('a')

          allHolder.setAttribute('data-user', group.other_user)

          allHolder.setAttribute('href', `/dialogue/${group.other_user}`)


          const chatCard = document.createElement('div')

          UICtrl.addClass(chatCard, 'chat-card')

          if (group.other_user_picture == '' || group.other_user_picture == null) {

            chatCard.appendChild(constructChatImage('text', null, group.other_user_name[0]))

          } else {

            chatCard.appendChild(constructChatImage('image', `/media/${group.other_user_picture}`))

          }

          chatCard.appendChild(constructChatDetails(group.other_user_name, 'dia', TimeCtrl.datetoTimeStr(new Date(group.last_seen)), '', { message: `Username: ${group.other_user}` }))

          allHolder.appendChild(chatCard)

          allHolder.appendChild(constructEndBorder())

          holder.appendChild(allHolder)

        }

        UIVars.leftSide.children[1].remove()

        UIVars.leftSide.append(holder)

      }

    }

    const webSocketsHandler = async () => {

      const dataSet = UICtrl.UIVars.leftSide.dataset

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';

      let chatSocket = await WebSocketCtrl.connect(protocol + window.location.host + '/ws/chatty_user/' + chattyUser.username + '/');

      chatSocket.onmessage = async (msg) => {

        let data = JSON.parse(msg.data).message

        if (data.to == chattyUser.username && data.type == 'message') {

          await loadGroups()

        } else if (data.to == chattyUser.username && data.type == 'add-message') {

          await positionGroup(data)

        } else if (data.to == chattyUser.username && data.type == 'update-message') {

          await updateGroup(data)

        } else if (data.to == chattyUser.username && data.type == 'delete-message') {

          await updateGroup(data)

        } else {

          await loadGroups()

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

    const configureChatForm = async () => {

      UICtrl.UIVars.searchBar.addEventListener('input', async (e) => {

        if (e.target.value == "") {

          UICtrl.UIVars.leftSide.children[0].style.display = 'flex'

          loadGroups()

          loadRandomDialogues()

        } else {

          const UIVars = UICtrl.UIVars

          const searchURL = window.location.protocol + '//' + window.location.host + `/api/chatty-all/search/all/`

          const searchResult = await APICtrl.postAPI_Json(searchURL, { token: token, searchWord: e.target.value })

          if (searchResult.msg == 'Successful') {

            const searchResults = searchResult.groups

            const holder = document.createElement('div')

            UICtrl.addClass(holder, 'inner-other')

            const holderSpan = document.createElement('span')

            holderSpan.appendChild(document.createTextNode('Search Result'))

            holder.appendChild(holderSpan)

            for (let index = 0; index < searchResults.length; index++) {

              const group = searchResults[index];

              const allHolder = document.createElement('a')

              const chatCard = document.createElement('div')

              if (group.type == 'group') {

                allHolder.setAttribute('data-user', group.group_name)

                allHolder.setAttribute('href', `/group/${group.name}`)

                UICtrl.addClass(chatCard, 'chat-card')

                if (group.picture == '' || group.picture == null) {

                  chatCard.appendChild(constructChatImage('text', null, group.group_name[0]))

                } else {

                  chatCard.appendChild(constructChatImage('image', `/media/${group.picture}`))

                }

                chatCard.appendChild(constructChatDetails(group.group_name, 'group', TimeCtrl.datetoTimeStr(new Date(group.last_seen)), '', { message: group.last_message }))

              } else {

                allHolder.setAttribute('data-user', group.username)

                allHolder.setAttribute('href', `/dialogue/${group.username}`)

                UICtrl.addClass(chatCard, 'chat-card')

                if (group.picture == '' || group.picture == null) {

                  chatCard.appendChild(constructChatImage('text', null, group.display_name[0]))

                } else {

                  chatCard.appendChild(constructChatImage('image', `/media/${group.picture}`))

                }

                chatCard.appendChild(constructChatDetails(group.display_name, 'dia', TimeCtrl.datetoTimeStr(new Date(group.last_seen)), '', { message: `Username: ${group.username}` }))

              }

              allHolder.appendChild(chatCard)

              allHolder.appendChild(constructEndBorder())

              holder.appendChild(allHolder)

            }

            UIVars.leftSide.children[0].style.display = 'none'

            UIVars.leftSide.children[1].remove()

            UIVars.leftSide.append(holder)

          }

        }
      })

    }

    await loadGroups()

    await webSocketsHandler()

    await loadRandomDialogues()

    await configureChatForm()

  }

  return {
    init: () => {

      loadEventListeners()

      firstInit()

      loadInit()

      console.log('Second application is successfully running...')

    }
  }
})
  (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', Application.init)
