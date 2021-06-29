// App Controller
const Application = (function (UICtrl, APICtrl,
  StorageCtrl, GlobalCtrl, UserCtrl) {

  const loadEventListeners = function () {

    const FormValidation = async function () {

      const nameField = UICtrl.UIVars.usernameInput

      const nameFieldText = UICtrl.UIVars.usernameFieldText

      const sendForm = UICtrl.UIVars.sendForm

      nameField.addEventListener('input', async (e) => {

        if (e.target.value !== '') {

          const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${e.target.value}/`

          const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/email/${e.target.value}/`

          const checkAPI = async function (url, is_username) {

            const nameCheck = await APICtrl.getAPI_Json(url)

            if (is_username === true) {

              if (nameCheck.username == e.target.value) {

                return [true, 'Username']

              } else {

                return [false]

              }

            } else {

              if (nameCheck.email == e.target.value) {

                return [true, 'Password']

              } else {

                return [false]

              }

            }

          }

          const url1Value = await checkAPI(url1, true)

          const url2Value = await checkAPI(url2, false)

          if (url1Value[0] == true) {

            UICtrl.addClass(nameFieldText, 'good')

            UICtrl.removeClass(nameFieldText, 'bad')

            nameFieldText.innerHTML = 'Valid Username'

          } else if (url2Value[0] == true) {

            UICtrl.addClass(nameFieldText, 'good')

            UICtrl.removeClass(nameFieldText, 'bad')

            nameFieldText.innerHTML = 'Valid Email'

          } else {

            UICtrl.removeClass(nameFieldText, 'good')

            UICtrl.addClass(nameFieldText, 'bad')

            nameFieldText.innerHTML = 'Invalid Username or Email'

          }

        }

      })

      sendForm.addEventListener('submit', async (e) => {

        e.preventDefault()

        if (nameField.value !== '') {

          const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${nameField.value}/`

          const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/email/${nameField.value}/`

          const checkAPI = async function (url, is_username) {

            const nameCheck = await APICtrl.getAPI_Json(url)

            if (is_username === true) {

              if (nameCheck.username == nameField.value) {

                return [true, 'Username']

              } else {

                return [false]

              }

            } else {

              if (nameCheck.email == nameField.value) {

                return [true, 'Password', nameCheck.username]

              } else {

                return [false]

              }

            }

          }

          const url1Value = await checkAPI(url1, true)

          const url2Value = await checkAPI(url2, false)

          if (url1Value[0] == true) {

            sendForm.submit()

          } else if (url2Value[0] == true) {

            nameField.value = url2Value[2]

            sendForm.submit()

          } else {

            e.preventDefault();

            UICtrl.UIVars.authCardMessage.innerHTML = 'Invalid Username or Email'

            UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

            UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'bad')

            setTimeout(() => {

              UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

              UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'bad')

            }, 1000);

          }

        } else {
          
          e.preventDefault();

          UICtrl.UIVars.authCardMessage.innerHTML = 'Invalid Username or Email'

          UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

          UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'bad')

          setTimeout(() => {

            UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

            UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'bad')

          }, 1000);

        }

      })

    }

    FormValidation()

  }

  const firstInit = function () {

    if (UICtrl.UIVars.authCardMessage.innerText != '') {

      UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

      setTimeout(() => {

        UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

      }, 3000);
      
    }

  }

  const loadInit = function () {

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
  (UICtrl, APICtrl, StorageCtrl, GlobalCtrl, UserCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', Application.init)