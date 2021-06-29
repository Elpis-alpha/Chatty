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

    const fillForm = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.leftSide.dataset

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      const group = await APICtrl.getAPI_Json(url2)

      UIVars.nameField.value = group.group_name

      UIVars.descriptionField.value = group.group_description

      if (group.group_image == null) {

        UIVars.imageContainer.innerHTML = ''

        UICtrl.addClass(UIVars.imageContainer, 'text')

        const span = document.createElement('span')

        span.innerText = 'No Image Provided'

        UIVars.imageContainer.appendChild(span)

        UIVars.chatFileCover.innerText = 'Add Group Image'

        UICtrl.removeClass(UIVars.chatFileCover, 'loaded')

      } else {

        UIVars.imageContainer.innerHTML = ''

        UICtrl.removeClass(UIVars.imageContainer, 'text')

        const img = document.createElement('img')

        img.src = group.group_image

        UIVars.imageContainer.appendChild(img)

        UIVars.chatFileCover.innerText = 'Change Group Image'

        UICtrl.addClass(UIVars.chatFileCover, 'loaded')

      }

      const adminURL = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/get-group-link/`

      const adminToken = await APICtrl.postAPI_Json(adminURL, {
        token: token,
        group: group.id,
        request: 'Request Admin'
      })

      UIVars.adminLink.value = `${window.location.protocol}//${window.location.host}/group/admin-group/${group.name}/${adminToken.token}`

      const joinToken = await APICtrl.postAPI_Json(adminURL, {
        token: token,
        group: group.id,
        request: 'Request Join'
      })

      UIVars.joinLink.value = `${window.location.protocol}//${window.location.host}/group/join-group/${group.name}/${joinToken.token}`


      const settingsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-group-settings/get-or-post/`

      const groupSettings = await APICtrl.postAPI_Json(settingsURL, {
        token: token,
        name: group.name,
      })

      UIVars.pinned.checked = groupSettings.setting.pinned

      UIVars.muted.checked = groupSettings.setting.muted

    }

    const configureForm = async () => {

      const UIVars = UICtrl.UIVars

      const dataSet = UIVars.leftSide.dataset

      const url1 = window.location.protocol + '//' + window.location.host + `/api/chatty-users/username/${dataSet.user}/`

      const url2 = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

      const chattyUser = await APICtrl.getAPI_Json(url1)

      const group = await APICtrl.getAPI_Json(url2)

      UIVars.nameFieldSave.addEventListener('click', async (e) => {

        const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

        const retVal = APICtrl.putAPI_JsonWithFile(url, {
          token: token,
          with_image: 'false',
          with_des: 'false',
          with_name: 'true',
          group_name: UIVars.nameField.value
        })

        await fillForm()

      })

      UIVars.descriptionFieldSave.addEventListener('click', async (e) => {

        const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

        const retVal = APICtrl.putAPI_JsonWithFile(url, {
          token: token,
          with_image: 'false',
          with_des: 'true',
          with_name: 'false',
          group_description: UIVars.descriptionField.value
        })

        await fillForm()

      })

      UIVars.adminLinkCopy.addEventListener('click', () => { SpecialCtrl.copyText(UIVars.adminLink.value) })

      UIVars.joinLinkCopy.addEventListener('click', () => { SpecialCtrl.copyText(UIVars.joinLink.value) })

      UIVars.adminLinkGenerate.addEventListener('click', async () => {

        const adminURL = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/get-group-link/`

        const adminToken = await APICtrl.postAPI_Json(adminURL, {
          token: token,
          group: group.id,
          request: 'Generate Admin'
        })

        fillForm()

      })

      UIVars.joinLinkGenerate.addEventListener('click', async () => {

        const joinURL = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/get-group-link/`

        const joinToken = await APICtrl.postAPI_Json(joinURL, {
          token: token,
          group: group.id,
          request: 'Generate Join'
        })

        fillForm()

      })

      UIVars.pinned.addEventListener('click', async e => {

        const settingsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-group-settings/get-or-post/`

        const groupSettings = await APICtrl.postAPI_Json(settingsURL, {
          token: token,
          name: group.name,
        })

        const newSettings = await APICtrl.putAPI_Json(settingsURL, {
          token: token,
          name: group.name,
          pinned: e.target.checked,
          muted: groupSettings.setting.muted
        })

      })

      UIVars.muted.addEventListener('click', async e => {

        const settingsURL = window.location.protocol + '//' + window.location.host + `/api/chatty-group-settings/get-or-post/`

        const groupSettings = await APICtrl.postAPI_Json(settingsURL, {
          token: token,
          name: group.name,
        })

        const newSettings = await APICtrl.putAPI_Json(settingsURL, {
          token: token,
          name: group.name,
          pinned: groupSettings.setting.pinned,
          muted: e.target.checked
        })

        console.log(newSettings);

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

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

          const retVal = APICtrl.putAPI_JsonWithFile(url, {
            token: token,
            with_image: 'truex',
            with_des: 'false',
            with_name: 'false',
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

          const url = window.location.protocol + '//' + window.location.host + `/api/chatty-groups/name/${dataSet.group}/`

          const retVal = APICtrl.putAPI_JsonWithFile(url, {
            token: token,
            with_image: 'true',
            with_des: 'false',
            with_name: 'false',
            image: e.target.files[0]
          })

          await fillForm()

        }

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