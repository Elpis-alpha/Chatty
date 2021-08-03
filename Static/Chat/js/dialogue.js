// App Controller
const Application = (function (UICtrl, APICtrl, GlobalCtrl, SpecialCtrl, WebSocketCtrl) {

  const token = UICtrl.findElement('.sofilnxzcm-asdoidksm').innerText

  UICtrl.findElement('.sofilnxzcm-asdoidksm').remove()

  const loadEventListeners = function () {

    UICtrl.UIVars.expandImage.addEventListener('click', () => {

      UICtrl.removeClass(UICtrl.UIVars.specialOverflow, 'show')

      UICtrl.removeClass(UICtrl.UIVars.expandImage, 'show')

    })

    UICtrl.UIVars.chatAddUsername.addEventListener('click', () => {

      const pValue = UICtrl.UIVars.chatMessage.value

      UICtrl.UIVars.chatMessage.value = pValue + '___ username ___'

    })

  }

  const firstInit = function () {

  }

  const loadInit = function () {

    UICtrl.UIVars.writeDate.innerHTML = TimeCtrl.datetoTimeStr(new Date(parseInt(UICtrl.UIVars.writeDate.dataset.date)))

    // Message Constructors

    const constructMessageContext = async (text) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'message-content')

      holder.innerHTML = await SpecialCtrl.getUsername(SpecialCtrl.urlify(text))

      return holder

    }

    const constructMessageRefferal = (rName, context, referedID) => {

      const colors = ["#008000", "#4653a2", "#ce8a2c", "#ce2cb6", "#2ccecb", "#710875", "#86850c", "#21b9af", "#9acd32"]

      const color = SpecialCtrl.chooseFrom(colors)

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'message-refferal')


      const holderColor = document.createElement('div')

      UICtrl.addClass(holderColor, 'refferal-color')

      const holderName = document.createElement('div')

      UICtrl.addClass(holderName, 'refferal-name')

      const holderContext = document.createElement('div')

      UICtrl.addClass(holderContext, 'refferal-context')


      const textName = document.createTextNode(rName)

      holderName.appendChild(textName)

      const textContext = document.createTextNode(context)

      holderContext.appendChild(textContext)

      holderColor.style.backgroundColor = color

      holderName.style.color = color


      holder.appendChild(holderColor)

      holder.appendChild(holderName)

      holder.appendChild(holderContext)


      const anchor = document.createElement('a')

      anchor.appendChild(holder)

      anchor.href = `#message-mes-${referedID}`

      return anchor

    }

    const constructMessageImage = (src) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'message-image')


      const holderImage = document.createElement('img')

      holderImage.setAttribute('src', src)

      holder.onclick = (e) => { GlobalCtrl.expandImage(e); return false }


      holder.appendChild(holderImage)

      return holder

    }

    const constructMessageFile = (src, name) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'message-file')


      const holderAnchor = document.createElement('a')

      holderAnchor.setAttribute('href', src)

      holderAnchor.setAttribute('target', '_blank')


      const holderImage = document.createElement('img')

      holderImage.setAttribute('src', '/static/Chat/images/file.png')


      const holderName = document.createElement('div')

      UICtrl.addClass(holderName, 'file-name')


      holderName.appendChild(document.createTextNode(name))

      holderAnchor.appendChild(holderImage)

      holderAnchor.appendChild(holderName)


      holder.appendChild(holderAnchor)

      return holder

    }

    const constructMessageOthers = (mine, time, received, id) => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'message-otherss')


      const holderEllipses = document.createElement('span')

      UICtrl.addClass(holderEllipses, 'message-ellipses')


      const holderSpan = document.createElement('span')

      const holderI = document.createElement('i')

      UICtrl.addClass(holderI, 'js-elipses')

      holderI.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg>'

      const holderSpanx = document.createElement('span')

      holderSpanx.onclick = (e) => { GlobalCtrl.showChatEllipses(e); return false }

      holderSpanx.setAttribute('data-message-id', id)

      holderSpan.appendChild(holderI)

      holderSpan.appendChild(holderSpanx)

      holderEllipses.appendChild(holderSpan)

      const holderTime = document.createElement('span')

      UICtrl.addClass(holderTime, 'message-time')

      const newTime = TimeCtrl.datetoTimeStr(new Date(time))

      holderTime.appendChild(document.createTextNode(newTime))


      holder.appendChild(holderEllipses)

      holder.appendChild(holderTime)

      if (mine) {

        const holderStatus = document.createElement('span')

        UICtrl.addClass(holderStatus, 'message-status')

        if (received) {

          holderStatus.appendChild(document.createTextNode('✓✓'))

        } else {

          holderStatus.appendChild(document.createTextNode('✓'))

        }

        holder.appendChild(holderStatus)

      }

      return holder

    }

    const constructMessageSeperator = () => {

      const holder = document.createElement('div')

      UICtrl.addClass(holder, 'message-content-seperator')

      return holder

    }

    // Message Constructors Ends

    const loadMessages = async (number) => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.rightSide.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/is-dialogue/${dataSet.user}/${dataSet.other}/`

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.other}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      const otherUser = await APICtrl.getAPI_Json(url2)

      const isDialogue = await APICtrl.getAPI_Json(url)

      let messages, messageContext, received, reName

      if (isDialogue.msg) {

        const url = window.location.protocol + '//' + window.location.host + `/api/messages/list-through/${isDialogue.name}/${number}/latest/`

        messages = await APICtrl.postAPI_Json(url, { token: token })

        messages.reverse()

      } else {

        messages = []

      }

      if (messages.length == 0) {

        const messageHolder = document.createElement('div')

        UICtrl.addClass(messageHolder, 'no-messages')

        const innerSpan = document.createElement('span')

        messageContext = document.createTextNode('You have no messages with this user')

        innerSpan.appendChild(messageContext)

        messageHolder.appendChild(innerSpan)

        UIVars.rightSideInner.innerHTML = ''

        UIVars.rightSideInner.appendChild(messageHolder)

      } else {

        const listOfMessageElements = []

        for (let index = 0; index < messages.length; index++) {

          const messageHolder = document.createElement('div')

          UICtrl.addClass(messageHolder, 'message')

          const message = messages[index];

          messageHolder.id = `message-mes-${message.id}`

          const messagePosition = document.createElement('div')

          if (message.date_received == null) { received = false } else { received = true }

          if (message.message_type === 'Text') {

            UICtrl.addClass(messagePosition, 'middle-message')

            switch (message.message) {

              case "Dialogue with":

                messageContext = document.createTextNode(message.message + ` ${otherUser.display_name}`)

                break;

              default:

                messageContext = document.createTextNode(message.message)

                break;
            }

            messagePosition.appendChild(messageContext)

          } else {

            if (message.sender == chattyUser.id) {

              UICtrl.addClass(messagePosition, 'my-message')

            } else {

              UICtrl.addClass(messagePosition, 'other-message')

              const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.id}/`

              if (message.date_received == undefined) {

                const ref = await APICtrl.putAPI_Json(url, {
                  token: token,
                  type: 'date_received',
                  date_received: new Date().getTime()
                })

                await WebSocketCtrl.sendToUser(otherUser.username, {
                  to: otherUser.username,
                  toGroup: isDialogue.name,
                  from: chattyUser.username,
                  type: 'update-message',
                  id: message.id
                })

              }

            }

          }

          switch (message.message_type) {

            case 'Pure Text':

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'Image with Caption':

              messagePosition.appendChild(constructMessageImage(message.image))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'File with Caption':

              messagePosition.appendChild(constructMessageFile(message.other_file, message.other_file.replace(/.*[\/\\]/, ''), 'Unknown'))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'Text with Refferal':

              const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

              const ref = await APICtrl.postAPI_Json(url, { token: token })

              if (ref.sender == chattyUser.id) { reName = 'You' } else {

                const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${ref.sender}/`

                const sender = await APICtrl.getAPI_Json(url)

                reName = sender.display_name

              }

              messagePosition.appendChild(constructMessageRefferal(reName, ref.message, ref.id))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'Image with Refferal':

              const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

              const refx = await APICtrl.postAPI_Json(urlx, { token: token })

              if (refx.sender == chattyUser.id) { reName = 'You' } else {

                const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${refx.sender}/`

                const sender = await APICtrl.getAPI_Json(url)

                reName = sender.display_name

              }

              messagePosition.appendChild(constructMessageRefferal(reName, refx.message, refx.id))

              messagePosition.appendChild(constructMessageSeperator())

              messagePosition.appendChild(constructMessageImage(message.image))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'File with Refferal':

              const urly = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

              const refy = await APICtrl.postAPI_Json(urly, { token: token })

              if (refy.sender == chattyUser.id) { reName = 'You' } else {

                const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${refy.sender}/`

                const sender = await APICtrl.getAPI_Json(url)

                reName = sender.display_name

              }

              messagePosition.appendChild(constructMessageRefferal(reName, refy.message, refy.id))

              messagePosition.appendChild(constructMessageFile(message.other_file, message.other_file.replace(/.*[\/\\]/, ''), 'Unknown'))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            default:
              break;
          }

          messageHolder.appendChild(messagePosition)

          listOfMessageElements.push(messageHolder)

        }

        UIVars.rightSideInner.innerHTML = '';

        listOfMessageElements.forEach((item) => {

          UIVars.rightSideInner.appendChild(item)

        })

        window.scrollTo(0, UIVars.rightSide.scrollHeight)

      }

    }

    const updateMessage = async (id) => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.rightSide.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/is-dialogue/${dataSet.user}/${dataSet.other}/`

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.other}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      const otherUser = await APICtrl.getAPI_Json(url2)

      const isDialogue = await APICtrl.getAPI_Json(url)

      let messages, messageContext, received, reName

      if (isDialogue.msg) {

        const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${id}/`

        const message = await APICtrl.postAPI_Json(url, { token: token })

        const messageHolder = UICtrl.findElement(`#message-mes-${id}`)

        if (messageHolder != null) {

          const messagePosition = document.createElement('div')

          if (message.date_received == null) { received = false } else { received = true }

          if (message.message_type === 'Text') {

            UICtrl.addClass(messagePosition, 'middle-message')

            switch (message.message) {

              case "Dialogue with":

                messageContext = document.createTextNode(message.message + ` ${otherUser.display_name}`)

                break;

              default:

                messageContext = document.createTextNode(message.message)

                break;
            }

            messagePosition.appendChild(messageContext)

          } else {

            if (message.sender == chattyUser.id) {

              UICtrl.addClass(messagePosition, 'my-message')

            } else {

              UICtrl.addClass(messagePosition, 'other-message')

              const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.id}/`

              if (message.date_received == undefined) {

                const ref = await APICtrl.putAPI_Json(url, {
                  token: token,
                  type: 'date_received',
                  date_received: new Date().getTime()
                })

              }

            }

          }

          switch (message.message_type) {

            case 'Pure Text':

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'Image with Caption':

              messagePosition.appendChild(constructMessageImage(message.image))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'File with Caption':

              messagePosition.appendChild(constructMessageFile(message.other_file, message.other_file.replace(/.*[\/\\]/, ''), 'Unknown'))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'Text with Refferal':

              const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

              const ref = await APICtrl.postAPI_Json(url, { token: token })

              if (ref.sender == chattyUser.id) { reName = 'You' } else {

                const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${ref.sender}/`

                const sender = await APICtrl.getAPI_Json(url)

                reName = sender.display_name

              }

              messagePosition.appendChild(constructMessageRefferal(reName, ref.message, ref.id))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'Image with Refferal':

              const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

              const refx = await APICtrl.postAPI_Json(urlx, { token: token })

              if (refx.sender == chattyUser.id) { reName = 'You' } else {

                const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${refx.sender}/`

                const sender = await APICtrl.getAPI_Json(url)

                reName = sender.display_name

              }

              messagePosition.appendChild(constructMessageRefferal(reName, refx.message, refx.id))

              messagePosition.appendChild(constructMessageSeperator())

              messagePosition.appendChild(constructMessageImage(message.image))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            case 'File with Refferal':

              const urly = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

              const refy = await APICtrl.postAPI_Json(urly, { token: token })

              if (refy.sender == chattyUser.id) { reName = 'You' } else {

                const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${refy.sender}/`

                const sender = await APICtrl.getAPI_Json(url)

                reName = sender.display_name

              }

              messagePosition.appendChild(constructMessageRefferal(reName, refy.message, refy.id))

              messagePosition.appendChild(constructMessageFile(message.other_file, message.other_file.replace(/.*[\/\\]/, ''), 'Unknown'))

              messagePosition.appendChild(await constructMessageContext(message.message))

              if (message.sender == chattyUser.id) {

                messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

              } else {

                messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

              }

              break;

            default:
              break;
          }

          messageHolder.children[0].remove()

          messageHolder.appendChild(messagePosition)

        }

      }

      addMessage()

    }

    const addMessage = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.rightSide.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/is-dialogue/${dataSet.user}/${dataSet.other}/`

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.other}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      const otherUser = await APICtrl.getAPI_Json(url2)

      const isDialogue = await APICtrl.getAPI_Json(url)

      let messages, messageContext, received, reName

      if (isDialogue.msg) {

        const url = window.location.protocol + '//' + window.location.host + `/api/messages/list-through/${isDialogue.name}/10/latest/`

        messages = await APICtrl.postAPI_Json(url, { token: token })

        messages.reverse()

      } else {

        messages = []

      }

      if (messages.length == 0) {

        const messageHolder = document.createElement('div')

        UICtrl.addClass(messageHolder, 'no-messages')

        const innerSpan = document.createElement('span')

        messageContext = document.createTextNode('You have no messages with this user')

        innerSpan.appendChild(messageContext)

        messageHolder.appendChild(innerSpan)

        UIVars.rightSideInner.innerHTML = ''

        UIVars.rightSideInner.appendChild(messageHolder)

      } else {

        const listOfMessageElements = []

        const listOfEmpty = []

        for (let index = 0; index < messages.length; index++) {

          const message = messages[index];

          const messageHolder = UICtrl.findElement(`#message-mes-${message.id}`)

          if (messageHolder === null) {

            listOfEmpty.push('X')

            const messageHolder = document.createElement('div')

            UICtrl.addClass(messageHolder, 'message')

            messageHolder.id = `message-mes-${message.id}`

            const messagePosition = document.createElement('div')

            if (message.date_received == null) { received = false } else { received = true }

            if (message.message_type === 'Text') {

              UICtrl.addClass(messagePosition, 'middle-message')

              switch (message.message) {

                case "Dialogue with":

                  messageContext = document.createTextNode(message.message + ` ${otherUser.display_name}`)

                  break;

                default:

                  messageContext = document.createTextNode(message.message)

                  break;
              }

              messagePosition.appendChild(messageContext)

            } else {

              if (message.sender == chattyUser.id) {

                UICtrl.addClass(messagePosition, 'my-message')

              } else {

                UICtrl.addClass(messagePosition, 'other-message')

                const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.id}/`

                if (message.date_received == undefined) {

                  const ref = await APICtrl.putAPI_Json(url, {
                    token: token,
                    type: 'date_received',
                    date_received: new Date().getTime()
                  })

                  await WebSocketCtrl.sendToUser(otherUser.username, {
                    to: otherUser.username,
                    toGroup: isDialogue.name,
                    from: chattyUser.username,
                    type: 'update-message',
                    id: message.id
                  })

                }

              }

            }

            switch (message.message_type) {

              case 'Pure Text':

                messagePosition.appendChild(await constructMessageContext(message.message))

                if (message.sender == chattyUser.id) {

                  messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

                } else {

                  messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

                }

                break;

              case 'Image with Caption':

                messagePosition.appendChild(constructMessageImage(message.image))

                messagePosition.appendChild(await constructMessageContext(message.message))

                if (message.sender == chattyUser.id) {

                  messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

                } else {

                  messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

                }

                break;

              case 'File with Caption':

                messagePosition.appendChild(constructMessageFile(message.other_file, message.other_file.replace(/.*[\/\\]/, ''), 'Unknown'))

                messagePosition.appendChild(await constructMessageContext(message.message))

                if (message.sender == chattyUser.id) {

                  messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

                } else {

                  messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

                }

                break;

              case 'Text with Refferal':

                const url = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

                const ref = await APICtrl.postAPI_Json(url, { token: token })

                if (ref.sender == chattyUser.id) { reName = 'You' } else {

                  const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${ref.sender}/`

                  const sender = await APICtrl.getAPI_Json(url)

                  reName = sender.display_name

                }

                messagePosition.appendChild(constructMessageRefferal(reName, ref.message, ref.id))

                messagePosition.appendChild(await constructMessageContext(message.message))

                if (message.sender == chattyUser.id) {

                  messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

                } else {

                  messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

                }

                break;

              case 'Image with Refferal':

                const urlx = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

                const refx = await APICtrl.postAPI_Json(urlx, { token: token })

                if (refx.sender == chattyUser.id) { reName = 'You' } else {

                  const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${refx.sender}/`

                  const sender = await APICtrl.getAPI_Json(url)

                  reName = sender.display_name

                }

                messagePosition.appendChild(constructMessageRefferal(reName, refx.message, refx.id))

                messagePosition.appendChild(constructMessageSeperator())

                messagePosition.appendChild(constructMessageImage(message.image))

                messagePosition.appendChild(await constructMessageContext(message.message))

                if (message.sender == chattyUser.id) {

                  messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

                } else {

                  messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

                }

                break;

              case 'File with Refferal':

                const urly = window.location.protocol + '//' + window.location.host + `/api/messages/by-id/${message.message_refer}/`

                const refy = await APICtrl.postAPI_Json(urly, { token: token })

                if (refy.sender == chattyUser.id) { reName = 'You' } else {

                  const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/id/${refy.sender}/`

                  const sender = await APICtrl.getAPI_Json(url)

                  reName = sender.display_name

                }

                messagePosition.appendChild(constructMessageRefferal(reName, refy.message, refy.id))

                messagePosition.appendChild(constructMessageFile(message.other_file, message.other_file.replace(/.*[\/\\]/, ''), 'Unknown'))

                messagePosition.appendChild(await constructMessageContext(message.message))

                if (message.sender == chattyUser.id) {

                  messagePosition.appendChild(constructMessageOthers(true, message.date_created, received, message.id))

                } else {

                  messagePosition.appendChild(constructMessageOthers(false, message.date_created, received, message.id))

                }

                break;

              default:
                break;
            }

            messageHolder.appendChild(messagePosition)

            listOfMessageElements.push(messageHolder)

          }

        }

        if (listOfEmpty.length >= messages.length) {

          await loadMessages(50)

        } else {

          listOfMessageElements.forEach((item) => {

            UIVars.rightSideInner.appendChild(item)

          })

        }

        window.scrollTo(0, UIVars.rightSide.scrollHeight + 5000)

      }

    }

    const deleteMessage = async (id) => {

      let messageHolder = UICtrl.findElement(`#message-mes-${id}`)

      if (messageHolder != null) {

        messageHolder.remove()

      }

      addMessage()

    }

    const configureChatForm = async () => {

      const sendChat = async () => {

        const UIVars = UICtrl.UIVars

        const dataSet = UIVars.rightSide.dataset

        const url = window.location.protocol + '//' + window.location.host + `/api/is-dialogue/${dataSet.user}/${dataSet.other}/`

        const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

        const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.other}/`

        const chattyUser = await APICtrl.getAPI_Json(url1)

        const otherUser = await APICtrl.getAPI_Json(url2)

        const groupName = await APICtrl.getAPI_Json(url)

        if (groupName.msg == false) {

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/`

          const returnedData = await APICtrl.postAPI_Json(url, {

            is_dialogue: true,

            members: [chattyUser.id, otherUser.id],

            date_created: new Date().getTime(),

          })

          groupName.name = returnedData.data

        }

        const groupURL = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${groupName.name}/`

        const group = await APICtrl.getAPI_Json(groupURL)

        const message = UIVars.chatMessage.value

        const dateCreated = new Date().getTime()

        const messageRefID = parseInt(UIVars.chatRefer.dataset.ref.split('-')[2])

        const file = UICtrl.UIVars.chatFileField.files[0]; let fileImage, fileFile, msgType, messageData, sendMessage

        if (file != undefined) {

          switch (file.type) {

            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
            case 'image/jfif':
            case 'image/gif':

              fileImage = file

              break;

            default:

              fileFile = file

              break;

          }

        }

        if (isNaN(messageRefID)) {

          if (fileImage) {

            msgType = 'Image with Caption'

          } else if (fileFile) {

            msgType = 'File with Caption'

          } else {

            msgType = 'Pure Text'

          }

        } else {

          if (fileImage) {

            msgType = 'Image with Refferal'

          } else if (fileFile) {

            msgType = 'File with Refferal'

          } else {

            msgType = 'Text with Refferal'

          }

        }

        const messageURL = window.location.protocol + '//' + window.location.host + `/api/messages/create/`

        switch (msgType) {

          case 'Pure Text':

            messageData = {
              msgType: msgType,
              sender: chattyUser.id,
              group: group.id,
              dateCreated: dateCreated,
              message: message,
              token: token
            }

            sendMessage = await APICtrl.postAPI_Json(messageURL, messageData)

            break;

          case 'Image with Caption':

            messageData = {
              msgType: msgType,
              sender: chattyUser.id,
              group: group.id,
              dateCreated: dateCreated,
              message: message,
              image: fileImage,
              token: token
            }

            sendMessage = await APICtrl.postAPI_JsonWithFile(messageURL, messageData)

            break;

          case 'File with Caption':

            messageData = {
              msgType: msgType,
              sender: chattyUser.id,
              group: group.id,
              dateCreated: dateCreated,
              message: message,
              file: fileFile,
              token: token
            }

            sendMessage = await APICtrl.postAPI_JsonWithFile(messageURL, messageData)

            break;

          case 'Text with Refferal':

            messageData = {
              msgType: msgType,
              sender: chattyUser.id,
              group: group.id,
              dateCreated: dateCreated,
              message: message,
              messageRef: messageRefID,
              token: token
            }

            sendMessage = await APICtrl.postAPI_Json(messageURL, messageData)

            break;

          case 'Image with Refferal':

            messageData = {
              msgType: msgType,
              sender: chattyUser.id,
              token: token,
              group: group.id,
              dateCreated: dateCreated,
              message: message,
              messageRef: messageRefID,
              image: fileImage,
            }

            sendMessage = await APICtrl.postAPI_JsonWithFile(messageURL, messageData)

            break;

          case 'File with Refferal':

            messageData = {
              msgType: msgType,
              sender: chattyUser.id,
              group: group.id,
              dateCreated: dateCreated,
              token: token,
              messageRef: messageRefID,
              message: message,
              file: fileFile,
            }

            sendMessage = await APICtrl.postAPI_JsonWithFile(messageURL, messageData)

            break;

          default:
            break;
        }

        await WebSocketCtrl.sendToUser(otherUser.username, {
          to: otherUser.username,
          toGroup: groupName.name,
          from: chattyUser.username,
          type: 'add-message',
          id: sendMessage.messageID
        })

        await WebSocketCtrl.sendToUser(chattyUser.username, {
          to: chattyUser.username,
          toGroup: groupName.name,
          from: chattyUser.username,
          type: 'add-message',
          id: sendMessage.messageID
        })

        UIVars.chatMessage.value = ''

        UIVars.chatRefer.innerHTML = ''

        UIVars.chatRefer.setAttribute('data-ref', '')

        if (UICtrl.UIVars.chatFileCover.classList.contains('loaded')) {

          UICtrl.removeClass(UICtrl.UIVars.chatFileCover, 'loaded')

          UICtrl.UIVars.chatFileCover.innerHTML = 'Add a File'

          UICtrl.UIVars.chatFileField.value = ''

          if (UICtrl.UIVars.chatFileField.value) {

            UICtrl.UIVars.chatFileField.type = 'text'

            UICtrl.UIVars.chatFileField.type = 'file'

          }

          UICtrl.UIVars.chatFileField.value = ''

        }

      }

      UICtrl.UIVars.chatForm.addEventListener('submit', e => { e.preventDefault(); sendChat() })

      const configureInputEnter = async () => {

        const UIVars = UICtrl.UIVars

        const dataSet = UIVars.rightSide.dataset

        const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

        const chattyUser = await APICtrl.getAPI_Json(url1)

        const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-user-settings/get-or-post/`

        const chattyUserSettings = await APICtrl.postAPI_Json(url2, {
          token: token
        })

        if (chattyUserSettings.setting.send_by_enter === true) {

          UICtrl.UIVars.chatMessage.addEventListener('keydown', e => { if (e.keyCode == 13) { e.preventDefault(); sendChat() } })

        }

      }

      UICtrl.UIVars.chatFileField.addEventListener('input', e => {

        if (e.target.files[0].size > 51200000) {

          e.preventDefault()

          UICtrl.UIVars.chatFileField.value = ''

          if (UICtrl.UIVars.chatFileField.value) {

            UICtrl.UIVars.chatFileField.type = 'text'

            UICtrl.UIVars.chatFileField.type = 'file'

          }

          UICtrl.UIVars.chatFileField.value = ''

          UICtrl.UIVars.chatFileCover.innerHTML = 'File is too Large'

          UICtrl.addClass(UICtrl.UIVars.chatFileCover, 'error')

          setTimeout(() => {

            UICtrl.removeClass(UICtrl.UIVars.chatFileCover, 'error')

            UICtrl.UIVars.chatFileCover.innerHTML = 'Add a File'

          }, 2000);

        } else {

          UICtrl.UIVars.chatFileCover.innerHTML = e.target.files[0].name

          UICtrl.addClass(UICtrl.UIVars.chatFileCover, 'loaded')

        }

      })

      UICtrl.UIVars.chatFileField.addEventListener('click', e => {

        if (UICtrl.UIVars.chatFileCover.classList.contains('loaded')) {

          e.preventDefault()

          UICtrl.removeClass(UICtrl.UIVars.chatFileCover, 'loaded')

          UICtrl.UIVars.chatFileCover.innerHTML = 'Add a File'

          UICtrl.UIVars.chatFileField.value = ''

          if (UICtrl.UIVars.chatFileField.value) {

            UICtrl.UIVars.chatFileField.type = 'text'

            UICtrl.UIVars.chatFileField.type = 'file'

          }

          UICtrl.UIVars.chatFileField.value = ''

        }

      })

      configureInputEnter()

    }

    const webSocketsHandler = async () => {

      const dataSet = UICtrl.UIVars.rightSide.dataset

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.other}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      const otherUser = await APICtrl.getAPI_Json(url2)

      var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';

      let chatSocket = await WebSocketCtrl.connect(protocol + window.location.host + '/ws/chatty_user/' + chattyUser.username + '/');

      chatSocket.onmessage = async (msg) => {
        
        UICtrl.UIVars.writeDate.innerHTML = TimeCtrl.datetoTimeStr(new Date(parseInt(chattyUser.last_seen)))

        const url = window.location.protocol + '//' + window.location.host + `/api/is-dialogue/${dataSet.user}/${dataSet.other}/`

        const groupName = await APICtrl.getAPI_Json(url)

        let data = JSON.parse(msg.data).message

        if (data.to == chattyUser.username && data.toGroup == groupName.name && data.type == 'message') {

          loadMessages(50)

        } else if (data.to == chattyUser.username && data.toGroup == groupName.name && data.type == 'add-message') {

          addMessage()

        } else if (data.to == chattyUser.username && data.toGroup == groupName.name && data.type == 'update-message') {

          updateMessage(data.id)

        } else if (data.to == chattyUser.username && data.toGroup == groupName.name && data.type == 'delete-message') {

          console.log(data.id);
          
          deleteMessage(data.id)

        } else {

          addMessage()

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

    loadMessages(50)

    configureChatForm()

    webSocketsHandler()

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
