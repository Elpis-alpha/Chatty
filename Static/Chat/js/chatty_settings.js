// App Controller
const Application = (function (UICtrl, APICtrl, StorageCtrl, GlobalCtrl, UserCtrl, SpecialCtrl) {

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

    SpecialCtrl.togglePassword(UICtrl.UIVars.passwordInput, UICtrl.UIVars.passwordSVG, 'hover')

    SpecialCtrl.togglePassword(UICtrl.UIVars.passwordInput2, UICtrl.UIVars.passwordSVG2, 'hover')

    const fillForm = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.leftSide.dataset

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      UIVars.nameField.value = chattyUser.display_name

      UIVars.numberField.value = chattyUser.number

      UIVars.descriptionField.value = chattyUser.biography

      UIVars.passwordInput.value = ''

      UIVars.passwordInput2.value = ''

      if (chattyUser.picture == null) {

        UIVars.imageContainer.innerHTML = ''

        UICtrl.addClass(UIVars.imageContainer, 'text')

        const span = document.createElement('span')

        span.innerText = 'No Image Provided'

        UIVars.imageContainer.appendChild(span)

        UIVars.chatFileCover.innerText = 'Add Profile Picture'

        UICtrl.removeClass(UIVars.chatFileCover, 'loaded')

      } else {

        UIVars.imageContainer.innerHTML = ''

        UICtrl.removeClass(UIVars.imageContainer, 'text')

        const img = document.createElement('img')

        img.src = chattyUser.picture

        UIVars.imageContainer.appendChild(img)

        UIVars.chatFileCover.innerText = 'Change Profile Picture'

        UICtrl.addClass(UIVars.chatFileCover, 'loaded')

      }


      const settingsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-user-settings/get-or-post/`

      const userSettings = await APICtrl.postAPI_Json(settingsURL, {
        token: token,
      })

      UIVars.pinned.checked = userSettings.setting.send_by_enter

      UIVars.muted.checked = userSettings.setting.counter

    }

    const configureForm = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.leftSide.dataset

      const url = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const chattyUser = await APICtrl.getAPI_Json(url)

      UIVars.nameFieldSave.addEventListener('click', async (e) => {

        if (UIVars.nameField.value.length < 3) {

        } else {

          const retVal = await APICtrl.putAPI_JsonWithFile(url, {
            token: token,
            with_image: 'false',
            with_bio: 'false',
            with_name: 'true',
            with_phone: 'false',
            with_password: 'false',
            display_name: UIVars.nameField.value
          })

        }

        await fillForm()

      })

      UIVars.numberFieldSave.addEventListener('click', async (e) => {

        const retVal = await APICtrl.putAPI_JsonWithFile(url, {
          token: token,
          with_image: 'false',
          with_bio: 'false',
          with_name: 'false',
          with_phone: 'true',
          with_password: 'false',
          phone: UIVars.numberField.value
        })

        await fillForm()

      })

      UIVars.descriptionFieldSave.addEventListener('click', async (e) => {

        const retVal = await APICtrl.putAPI_JsonWithFile(url, {
          token: token,
          with_image: 'false',
          with_bio: 'true',
          with_phone: 'false',
          with_name: 'false',
          with_password: 'false',
          biography: UIVars.descriptionField.value
        })

        await fillForm()

      })

      UIVars.pinned.addEventListener('click', async e => {

        const settingsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-user-settings/get-or-post/`

        const userSettings = await APICtrl.postAPI_Json(settingsURL, {
          token: token,
        })

        const userSettingsx = await APICtrl.putAPI_Json(settingsURL, {
          token: token,
          send_by_enter: e.target.checked,
          counter: userSettings.setting.send_by_enter
        })

      })

      UIVars.muted.addEventListener('click', async e => {

        const settingsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-user-settings/get-or-post/`

        const userSettings = await APICtrl.postAPI_Json(settingsURL, {
          token: token,
        })

        const userSettingsx = await APICtrl.putAPI_Json(settingsURL, {
          token: token,
          send_by_enter: userSettings.setting.send_by_enter,
          counter: e.target.checked
        })

      })

      UIVars.chatFileField.addEventListener('click', async e => {

        if (UICtrl.UIVars.chatFileCover.classList.contains('loaded')) {

          e.preventDefault()

          UICtrl.removeClass(UICtrl.UIVars.chatFileCover, 'loaded')

          UICtrl.UIVars.chatFileCover.innerHTML = 'Add Group Image'

          UICtrl.UIVars.chatFileField.value = ''

          if (UICtrl.UIVars.chatFileField.value) {

            UICtrl.UIVars.chatFileField.type = 'text'

            UICtrl.UIVars.chatFileField.type = 'file'

          }

          UICtrl.UIVars.chatFileField.value = ''

          const retVal = await APICtrl.putAPI_JsonWithFile(url, {
            token: token,
            with_image: 'truex',
            with_bio: 'false',
            with_phone: 'false',
            with_name: 'false',
            with_password: 'false',
          })

          await fillForm()
        }

      })

      UICtrl.UIVars.chatFileField.addEventListener('input', async e => {

        if (e.target.files[0].size > 31200000) {

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

          const retVal = await APICtrl.putAPI_JsonWithFile(url, {
            token: token,
            with_image: 'true',
            with_bio: 'false',
            with_phone: 'false',
            with_name: 'false',
            with_password: 'false',
            image: e.target.files[0]
          })

          await fillForm()

        }

      })

      UIVars.passwordSave.addEventListener('click', async (e) => {

        if (UIVars.passwordInput2.value.length < 5) {

        } else {

          const retVal = await APICtrl.putAPI_JsonWithFile(url, {
            token: token,
            with_image: 'false',
            with_bio: 'false',
            with_name: 'false',
            with_phone: 'false',
            with_password: 'true',
            old_password: UIVars.passwordInput.value,
            new_password: UIVars.passwordInput2.value,
          })

          console.log(retVal);
        }

        await fillForm()


      })

    }

    await fillForm()

    await configureForm()

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
  (UICtrl, APICtrl, StorageCtrl, GlobalCtrl, UserCtrl, SpecialCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', Application.init)