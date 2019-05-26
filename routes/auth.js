var express = require('express');
var router = express.Router();

var passport = require('passport');  //模块名叫passport，专门验证auth相关的内容
var GitHubStrategy = require('passport-github').Strategy;//第三方登录请求

//规定这样写
passport.serializeUser(function(user, done) {     //把用户传递过来的信息序列化，存储在session中
  console.log('---serializeUser---')
  done(null, user);
});

passport.deserializeUser(function(obj, done) {   //解析session
  console.log('---deserializeUser---')
  done(null, obj);
});

//配置登录信息
passport.use(new GitHubStrategy({     
    clientID: 'a152e7c20469c9221197',
    clientSecret: '1a5423ba575488e3bac916d97aabde3adaeab4c5',
    callbackURL: "http://localhost:3000/auth/github/callback" 
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    // });
    done(null, profile);
  }
));

router.get('/logout', function(req, res){     //注销
  req.session.destroy();
  res.redirect('/');  //返回到首页
})

//认证github登录
router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = {
      id: req.user.id,
      username: req.user.displayName || req.user.username,
      avatar: req.user._json.avatar_url,
      provider: req.user.provider
    };
    res.redirect('/');
  });

module.exports = router;
