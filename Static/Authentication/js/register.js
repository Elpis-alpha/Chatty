// App Controller
const Application = (function (UICtrl, APICtrl,
  StorageCtrl, GlobalCtrl, UserCtrl) {

  const loadEventListeners = function () {

    const FormValidation = async function () {

      const displayField = UICtrl.UIVars.displayInput

      const displayFieldText = UICtrl.UIVars.displayFieldText

      const usernameField = UICtrl.UIVars.usernameInput

      const usernameFieldText = UICtrl.UIVars.usernameFieldText

      const emailField = UICtrl.UIVars.emailInput

      const emailFieldText = UICtrl.UIVars.emailFieldText

      const passwordField = UICtrl.UIVars.passwordInput

      const passwordFieldText = UICtrl.UIVars.passwordFieldText

      const passwordField2 = UICtrl.UIVars.passwordInput2

      const passwordField2Text = UICtrl.UIVars.passwordField2Text

      const sendForm = UICtrl.UIVars.sendForm

      displayField.addEventListener('input', (e) => {

        const re = /^([A-Za-z0-9 ]){3,45}$/

        if (re.test(e.target.value)) {

          UICtrl.addClass(displayFieldText, 'good')

          UICtrl.removeClass(displayFieldText, 'bad')

          displayFieldText.innerHTML = 'Valid Display Name'

        } else {

          UICtrl.removeClass(displayFieldText, 'good')

          UICtrl.addClass(displayFieldText, 'bad')

          displayFieldText.innerHTML = 'Invalid Display Name'

        }

      })

      usernameField.addEventListener('input', (e) => {

        const re = /^([A-Za-z0-9]){3,45}$/

        if (re.test(e.target.value)) {

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${e.target.value}/`

          const checkAPI = async function () {

            const usernameCheck = await APICtrl.getAPI_Json(url)

            if (usernameCheck.username == '') {

              UICtrl.addClass(usernameFieldText, 'good')

              UICtrl.removeClass(usernameFieldText, 'bad')

              usernameFieldText.innerHTML = 'Valid Username'

            } else {

              usernameFieldText.innerHTML = 'Username is taken'

              UICtrl.removeClass(usernameFieldText, 'good')

              UICtrl.addClass(usernameFieldText, 'bad')

            }

          }

          checkAPI()

        } else {

          UICtrl.removeClass(usernameFieldText, 'good')

          UICtrl.addClass(usernameFieldText, 'bad')

          usernameFieldText.innerHTML = 'Invalid Username'

        }

      })

      emailField.addEventListener('input', (e) => {

        const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

        if (re.test(e.target.value)) {

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/email/${e.target.value}/`

          const checkAPI = async function () {

            const emailCheck = await APICtrl.getAPI_Json(url)

            if (emailCheck.email == '') {

              UICtrl.addClass(emailFieldText, 'good')

              UICtrl.removeClass(emailFieldText, 'bad')

              emailFieldText.innerHTML = 'Valid Email'

            } else {

              emailFieldText.innerHTML = 'Email is taken'

              UICtrl.removeClass(emailFieldText, 'good')

              UICtrl.addClass(emailFieldText, 'bad')

            }

          }

          checkAPI()

        } else {

          UICtrl.removeClass(emailFieldText, 'good')

          UICtrl.addClass(emailFieldText, 'bad')

          emailFieldText.innerHTML = 'Invalid Email'

        }

      })

      passwordField.addEventListener('input', (e) => {

        const re = /(?=.*?[a-z]).{5,}/

        if (re.test(e.target.value)) {

          UICtrl.addClass(passwordFieldText, 'good')

          UICtrl.removeClass(passwordFieldText, 'bad')

          passwordFieldText.innerHTML = 'Password is ok'

        } else {

          UICtrl.removeClass(passwordFieldText, 'good')

          UICtrl.addClass(passwordFieldText, 'bad')

          passwordFieldText.innerHTML = 'Password is too weak'

        }

      })

      passwordField2.addEventListener('input', (e) => {

        if (passwordField.value === passwordField2.value) {

          UICtrl.addClass(passwordField2Text, 'good')

          UICtrl.removeClass(passwordField2Text, 'bad')

          passwordField2Text.innerHTML = 'Password matches'

        } else {

          UICtrl.removeClass(passwordField2Text, 'good')

          UICtrl.addClass(passwordField2Text, 'bad')

          passwordField2Text.innerHTML = 'Password does not match'

        }

      })

      sendForm.addEventListener('submit', async (e) => {

        e.preventDefault()

        const reDisplayname = /^([A-Za-z0-9 ]){3,45}$/

        const reUsername = /^([A-Za-z0-9]){3,45}$/

        const reEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

        const rePassword = /(?=.*?[a-z]).{5,}/

        const val1 = reDisplayname.test(displayField.value)

        const val2 = reUsername.test(usernameField.value)

        const val3 = reEmail.test(emailField.value)

        const val4 = rePassword.test(passwordField.value)

        const val5 = passwordField.value === passwordField2.value

        const finalFactor = val1 && val2 && val3 && val4 && val5

        if (finalFactor === true) {

          const validateForm = async function () {

            const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${usernameField.value}/`

            const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/email/${emailField.value}/`

            let val_url1; let val_url2

            const usernameCheck = await APICtrl.getAPI_Json(url1)

            const emailCheck = await APICtrl.getAPI_Json(url2)

            val_url1 = usernameCheck.username == ''

            val_url2 = emailCheck.username == ''

            console.log(val_url1, val_url2)

            const xval = val_url1 && val_url2

            if (xval !== true) {

              e.preventDefault();

              UICtrl.UIVars.authCardMessage.innerHTML = 'Invalid Data'

              UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

              UICtrl.addClass(UICtrl.UIVars.authCardMessage.parentElement, 'bad')

              setTimeout(() => {

                UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'show')

                UICtrl.removeClass(UICtrl.UIVars.authCardMessage.parentElement, 'bad')

              }, 1000);

            } else {

              UICtrl.UIVars.dateField.value = new Date().getTime()

              sendForm.submit()

            }

          }

          validateForm()

        } else {

          e.preventDefault();

          UICtrl.UIVars.authCardMessage.innerHTML = 'Invalid Data'

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

  }

  const loadInit = function () {

    SpecialCtrl.togglePassword(UICtrl.UIVars.passwordInput, UICtrl.UIVars.passwordSVG, 'hover')

    SpecialCtrl.togglePassword(UICtrl.UIVars.passwordInput2, UICtrl.UIVars.passwordSVG2, 'hover')

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