import 'less/toast.less';

function toast(msg, time){  //定义这个函数
  this.msg = msg; 
  this.dismissTime = time||1000;  //设置时间，不设置就默认1s
  this.createToast();   //创造节点
  this.showToast();    //展示节点
}
toast.prototype = {
  createToast: function(){
    var tpl = '<div class="toast">'+this.msg+'</div>';
    this.$toast = $(tpl);
    $('body').append(this.$toast);
  },
  showToast: function(){
    var self = this;
    this.$toast.fadeIn(300, function(){
      setTimeout(function(){
         self.$toast.fadeOut(300,function(){
           self.$toast.remove();
         });
      }, self.dismissTime);
    });
  }
};

function Toast(msg,time){
  return new toast(msg, time);
}
window.Toast=Toast//用来调试的
const _Toast = Toast;
export { _Toast as Toast };
