require('less/note.less');

var Toast = require('./toast.js').Toast;
var Event = require('mod/event.js');

function Note(opts){
  this.initOpts(opts);  //首先初始化
  this.createNote();  //然后创造节点
  this.setStyle();  //设置样式
  this.bindEvent();
}
//设置原型
Note.prototype = {
  colors: [
    ['#ea9b35','#efb04e'], // headColor, containerColor
    ['#dd598b','#e672a2'],
    ['#eee34b','#f2eb67'],
    ['#c24226','#d15a39'],
    ['#c1c341','#d0d25c'],
    ['#3f78c3','#5591d2']
  ],

  defaultOpts: {
    id: '',   //Note的 id
    $ct: $('#content').length>0?$('#content'):$('body'),  //默认存放 Note 的容器
    text: 'input here'  //Note 的内容
  },

  initOpts: function (opts) {  //初始化
    this.opts = $.extend({}, this.defaultOpts, opts||{});
    if(this.opts.id){
      this.id = this.opts.id;
    }
  },
  //创建节点
  createNote: function () {  
    var tpl =  '<div class="note">'
              + '<div class="img"></div>'
              + '<div class="note-head"><span class="username"></span><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              +'</div>';
    this.$note = $(tpl);
    this.$note.find('.note-ct').text(this.opts.text);
    //如果登录了，有username，那么就让username显示username
    if (this.opts.username){
      this.$note.find('.username').text(this.opts.username);
    }
    //挂载
    this.opts.$ct.append(this.$note);
    if(!this.id)  this.$note.css('bottom', '10px');  //新增放到右边
  },
  //设置样式
  setStyle: function () {
    var color = this.colors[Math.floor(Math.random()*6)];//随机选择6中样式中的一种
    this.$note.find('.note-head').css('background-color', color[0]); //头部样式
    this.$note.find('.note-ct').css('background-color', color[1]); //容器样式
  },
  //设置布局
  setLayout: function(){
    var self = this;
    if(self.clk){
      clearTimeout(self.clk);
    }
    self.clk = setTimeout(function(){
      Event.fire('waterfall');//使用瀑布流
    },100);
  },
  //添加事件
  bindEvent: function () {
    var self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');
    $delete.on('click', function(){
      self.delete();
    })
    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function() {
      if($noteCt.html()=='inpu here') $noteCt.html('');
      $noteCt.data('before', $noteCt.html());
    }).on('blur paste', function() {
      if( $noteCt.data('before') != $noteCt.html() ) {
        $noteCt.data('before',$noteCt.html());
        self.setLayout();
        if(self.id){
          self.edit($noteCt.html())
        }else{
          self.add($noteCt.html())
        }
      }
    });
    //设置笔记的移动
    $noteHead.on('mousedown', function(e){
      var evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
          evtY = e.pageY - $note.offset().top;
      //把事件到 dialog 边缘的距离保存下来，增加class是为了让其在拖动过程中有特效
      $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}); 
    }).on('mouseup', function(){
       $note.removeClass('draggable').removeData('pos');
    });

    $('body').on('mousemove', function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX-$('.draggable').data('evtPos').x
      });
    });
  },

  edit: function (msg) {
    var self = this;
    $.post('/api/notes/edit',{
        id: this.id,
        note: msg
      }).done(function(ret){
      if(ret.status === 0){
        Toast('更改成功');
      }else{
        Toast(ret.errorMsg);
      }
    })
  },

  add: function (msg){
    var self = this;
    $.post('/api/notes/add', {note: msg})
      .done(function(ret){
        if(ret.status === 0){
          Toast('添加成功');
        }else{
          self.$note.remove();
          Event.fire('waterfall')
          Toast(ret.errorMsg);
        }
      });
  },

  delete: function(){
    var self = this;
    $.post('/api/notes/delete', {id: this.id})
      .done(function(ret){
        if(ret.status === 0){
          Toast('删除成功');
          self.$note.remove();
          Event.fire('waterfall')
        }else{
          Toast(ret.errorMsg);
        }
    });
  }
};

module.exports.Note = Note;