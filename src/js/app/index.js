//首页三个功能
require('less/index.less');

var NoteManager = require('mod/note-manager.js').NoteManager;
var Event = require('mod/event.js');
var WaterFall = require('mod/waterfall.js');
//加载页面内容
NoteManager.load();
//点击添加Note
$('.add-note').on('click', function() {
  NoteManager.add();
})
//启动瀑布流
Event.on('waterfall', function(){
  WaterFall.init($('#content'));
})
console.log('success')
console.log('success')
