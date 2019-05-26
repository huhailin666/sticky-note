var express = require('express');
var router = express.Router();
var Note = require('../model/note.js').Note

// 1.获取所有的note:GET   /api/notes    req:{}     res: {status:0,data:[{},{}]} {status:1,errorMsg:'失败的原因'}
// 1.创建一个note:POST   /api/notes/add    req:{note:'hello world'}     res: {status:0,data:[{},{}]} {status:1,errorMsg:'失败的原因'}
// 1.修改一个note:POST   /api/notes/edit    req:{note:'new note'}    
// 1.删除一个的note:POST   /api/notes/delete    req:{id:100}     

//获取所有Note
router.get('/notes', function(req, res, next) {  //因为前面有api，所以/api可以不写
  var opts = {raw: true}
  if(req.session && req.session.user){
    opts.where = {username:req.session.user.username }
  }
  Note.findAll(opts).then(function(notes) {
    res.send({status: 0, data: notes});
  }).catch(function(){
    res.send({ status: 1,errorMsg: '数据库异常'});
  });
});

/*新增note*/
router.post('/notes/add', function(req, res, next){
  //设定在登录状态才能新增
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  if (!req.body.note) {  //为何此处是req.body，跟express的用法有关
    return res.send({status: 2, errorMsg: '内容不能为空'});
  }
  var note = req.body.note;
  var username = req.session.user.username;
  //判断完成后，开始创建Note
  Note.create({text: note, username: username}).then(function(){
    console.log(arguments)
    res.send({status: 0})
  }).catch(function(){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

/*修改note*/
router.post('/notes/edit', function(req, res, next){
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  var noteId = req.body.id;
  var note = req.body.note;
  var username = req.session.user.username;
  //将文本改为note，条件是where里面的内容
  Note.update({text: note}, {where:{id: noteId, username: username}}).then(function(lists){
    if(lists[0] === 0){
      return res.send({ status: 1,errorMsg: '你没有权限'});
    }
    res.send({status: 0})
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})


/*删除note*/
router.post('/notes/delete', function(req, res, next){
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }

  var noteId = req.body.id
  var username = req.session.user.username;

  Note.destroy({where:{id:noteId, username: username}}).then(function(deleteLen){
    if(deleteLen === 0){
      return res.send({ status: 1, errorMsg: '你没有权限'});
    }
    res.send({status: 0})
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

module.exports = router;
