/*
React-Quill v0.4.1
https://github.com/zenoamaro/react-quill
*/
module.exports = require('./component')
module.exports.Mixin = require('./mixin')
module.exports.Toolbar = require('./toolbar')
var quill = require('quill')
var Parchment = quill.import('parchment')
var MultiCursor = require('./custom_modules/MultiCursor')

var FontStyle = new Parchment.Attributor.Style('size', 'font-size', { scope: Parchment.Scope.INLINE })
var FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', { scope: Parchment.Scope.INLINE })
var DataElement = new Parchment.Attributor.Attribute('data-element', 'data-element', {scope: Parchment.Scope.INLINE})
var CapsElement = new Parchment.Attributor.Attribute('data-caps', 'data-caps', {scope: Parchment.Scope.INLINE})
var TypeElement = new Parchment.Attributor.Attribute('data-tyoe', 'data-type', {scope: Parchment.Scope.BLOCK})

quill.register(FontStyle, true)
quill.register(FontFamilyStyle, true)
quill.register('modules/multi-cursor', MultiCursor)
quill.register(DataElement, true)
quill.register(CapsElement, true)
quill.register(TypeElement, true)

module.exports.Quill = quill
