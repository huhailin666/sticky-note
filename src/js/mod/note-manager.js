var Toast = require('./toast.js').Toast;
var Note = require('./note.js').Note;
var Toast = require('./toast.js').Toast;
var Event = require('mod/event.js');

var NoteManager = (function(){
  //加载所有数据，渲染出来，让用户看到
  function load() {
    $.get('/api/notes')
      .done(function(ret){
        console.log(ret)
        if(ret.status == 0){
          //给没一个Note添加属性
          $.each(ret.data, function(idx, article) {
              new Note({
                id: article.id,
                text: article.text,
                username: article.username
              });
          });
          //使用瀑布流布局
          Event.fire('waterfall');
        }else{
          Toast(ret.errorMsg);
        }
      })
      .fail(function(){
        Toast('网络异常');
      });
  }
  //创建一个新的Note
  function add(){
    new Note();
  }
  //notemanager只有这两个功能
  return {
    load: load,
    add: add
  }
})();

module.exports.NoteManager = NoteManager