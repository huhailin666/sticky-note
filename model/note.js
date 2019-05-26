var Sequelize = require('sequelize')
var path = require('path')
var sequelize = new Sequelize(undefined,undefined,undefined,{
    host: 'localhost',
    dialect: 'sqlite',
    // storage: '../database/database.sqlite'
    storage: path.join(__dirname,'../database/database.sqlite')
});

//下面是用来测试连接的
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

//创建表结构
const Note = sequelize.define('note', {
  //设置了两条字段
    text: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING
    }
  });

  Note.sync()
//   Note.sync().then(() => {
//     // Now the `users` table in the database corresponds to the model definition
//     return Note.create({
//       text: 'ipm',
//       username: 'yls'
//     });
//   });

//   Note.findAll().then(notes => {
//     console.log("All users:", JSON.stringify(notes, null, 4));
//   });

// Note.findAll({raw:true,where:{id:2}}).then(function(notes){
//     console.log(notes)
// })

module.exports.Note = Note