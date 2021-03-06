var DEFAULTS = {
  template: '<span class="ql-cursor-flag"> <span class="ql-cursor-name"></span> </span> <span class="ql-cursor-caret"></span>',
  timeout: 2500
}

var MultiCursor = function (quill, options) {
  this.quill = quill
  this.options = Object.assign({}, DEFAULTS, options)
  this.container = quill.addContainer('ql-multi-cursor')
  this.cursors = {}
}

MultiCursor.prototype.clearCursors = function () {
  Object.keys(this.curosrs).forEach(this.removeCursor.bind(this))
}

MultiCursor.prototype.moveCursor = function (userId, index) {
  var cursor = this.cursors[userId]
  if (cursor) {
    cursor.index = index
    cursor.elem.classList.remove('ql-hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout(() => {
      cursor.elem.classList.add('ql-hidden')
      cursor.timer = null
    }, this.options.timeout)
    this.updateCursor(cursor)
    return cursor
  }
}

MultiCursor.prototype.removeCursor = function (userId) {
  var cursor = this.cursors[userId]
  if (cursor) {
    cursor.elem.parentNode.removeChild(cursor.elem)
  }
  delete this.cursors[userId]
}

MultiCursor.prototype.setCursor = function (userId, index, name, color) {
  if (!this.cursors[userId]) {
    var cursor = {
      userId: userId,
      index: index,
      color: color,
      elem: this.buildCursor(name, color)
    }
    this.cursors[userId] = cursor
  }
  setTimeout(() => {
    this.moveCursor(userId, index)
  }, 1)
  return this.cursors[userId]
}

MultiCursor.prototype.buildCursor = function (name, color) {
  var cursorEl = document.createElement('span')
  cursorEl.classList.add('ql-cursor')
  cursorEl.innerHTML = this.options.template
  var cursorName = cursorEl.querySelector('.ql-cursor-name')
  var nameTextNode = document.createTextNode(name)
  cursorName.appendChild(nameTextNode)
  var cursorCaret = cursorEl.querySelector('.ql-cursor-caret')
  cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
  this.container.appendChild(cursorEl)
  return cursorEl
}

MultiCursor.prototype.updateCursor = function (cursor) {
  var bounds = this.quill.getBounds(cursor.index)

  // MEMO : This is due to quill.js bug. When cursor is at the new line or
  //        the end of the line, quill's `getBound` can not return correct 
  //        cursor position. Somewhat correct cursor position can be retrieved
  //        if we getBound for the previous index.
  var newLine = false
  if (this.quill.getText(cursor.index, 1) === '\n' || this.quill.getText(cursor.index - 1, 1) === '\n') {
    bounds = this.quill.getBounds(cursor.index - 1)
    newLine = true
  }

  if (bounds) {
    cursor.elem.style.top = (bounds.top + this.quill.container.scrollTop) + 'px'
    // WARNING SUPER HACKY (SORRY!)
    // If getBound was done with previous index, off set that by 5px
    cursor.elem.style.left = bounds.left + (newLine ? 5 : 0) + 'px'
    cursor.elem.style.height = bounds.height + 'px'
    var flag = cursor.elem.querySelector('.ql-cursor-flag')
    cursor.elem.classList.toggle('ql-top', parseInt(cursor.elem.style.top) <= flag.offsetHeight)
    cursor.elem.classList.toggle('ql-left', parseInt(cursor.elem.style.left) <= flag.offsetWidth)
    cursor.elem.classList.toggle('ql-right', this.quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth)
  } else {
    this.removeCursor(cursor.userId)
  }
}

module.exports = MultiCursor
