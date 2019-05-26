var EventCenter = (function(){
  var events = {};//定义一个空对象
  function on(evt, handler){
    //判断这个数组是否有函数
    events[evt] = events[evt] || []; 
    //给数组events[evt]加入函数
    events[evt].push({
      handler: handler
    });
  }

  function fire(evt, args){
    //判断是否有这个数组，没有就return
    if(!events[evt]){
      return;
    }
    //依次执行这个数组中所有的函数
    for(var i=0; i<events[evt].length; i++){
      events[evt][i].handler(args);
    }
  }
  return {
    on: on,
    fire: fire
  }
})();
module.exports = EventCenter;

// EventCenter.on('text-change', function(data){
//  console.log(data);
// });
// EventCenter.on('text-change', function(data){
//  alert(1);
// });
// EventCenter.fire('text-change', 100);