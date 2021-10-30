// App Controller
const Application = (function (UICtrl, APICtrl,
  StorageCtrl, GlobalCtrl, UserCtrl, SpecialCtrl) {

  const loadEventListeners = function () {

    UICtrl.UIVars.expandImage.addEventListener('click', () => {

      UICtrl.removeClass(UICtrl.UIVars.specialOverflow, 'show')

      UICtrl.removeClass(UICtrl.UIVars.expandImage, 'show')

    })

    UICtrl.UIVars.chatFileField.addEventListener('input', e => {

      if (e.target.files[0].size > 21200000) {

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

        const imageValues = [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/jfif',
          'image/gif',
        ]

        if (imageValues.includes(e.target.files[0].type)) {

          UICtrl.UIVars.chatFileCover.innerHTML = e.target.files[0].name

          UICtrl.addClass(UICtrl.UIVars.chatFileCover, 'loaded')

        } else {

          e.preventDefault()

          UICtrl.UIVars.chatFileField.value = ''
  
          if (UICtrl.UIVars.chatFileField.value) {
  
            UICtrl.UIVars.chatFileField.type = 'text'
  
            UICtrl.UIVars.chatFileField.type = 'file'
  
          }
  
          UICtrl.UIVars.chatFileField.value = ''
  
          UICtrl.UIVars.chatFileCover.innerHTML = 'Invalid File Type'
  
          UICtrl.addClass(UICtrl.UIVars.chatFileCover, 'error')
  
          setTimeout(() => {
  
            UICtrl.removeClass(UICtrl.UIVars.chatFileCover, 'error')
  
            UICtrl.UIVars.chatFileCover.innerHTML = 'Group Image'
  
          }, 2000);
  
        }

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

    UICtrl.findElement('#sendform').addEventListener('submit', e => {

      UICtrl.findElement('#date_created').value = new Date().getTime()

    })
  }

  const firstInit = function () {

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
  (UICtrl, APICtrl, StorageCtrl, GlobalCtrl, UserCtrl, SpecialCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', Application.init)