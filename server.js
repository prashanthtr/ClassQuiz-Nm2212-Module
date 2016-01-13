var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var ensureConnect = require('connect-ensure-login')

var qb = require('./db/questionBank.js');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use('auth', new Strategy(
//    {usernameField: 'username',
 //    passwordField: 'password' // this is the virtual field on the model
 //   },
    function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// //assuming only the value of the checkbox is sent
// passport.use('checkAns', new Strategy(
//     {usernameField: 'QString',
//      passwordField: 'answerOp',
//     },
//     function(answerOp, cb){
//         console.log("the option is" + option)
//         db.questionBank.findAns( "questionNo", function(err, question) {
//             //if (err) { return cb(err); }
//             //if (!question) { console.log("false"); return cb(null, false); }
//             //if (question.answerOp != req.body.option) { return cb(null, false); }
//             return cb(null, {hello: 1});
//         });
//     }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('auth', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
        ensureConnect.ensureLoggedIn(),
        function(req, res){
            res.render('profile', { user: req.user });
        });

app.get('/takequiz',
        ensureConnect.ensureLoggedIn('/'),
        function(req, res){
            //questionNumber is array index, option is 1,2,3
            res.render('./takequiz')
        });


app.post('/submitAns',
         function(req, res){
             console.log(req.body.option);
             console.log(req.body.questionNo);
             console.log(qb);
             //questionNumber is array index, option is 1,2,3
             quizResponse = qb.findAns(req.body.questionNo, req.body.option);
             console.log(quizResponse)
             res.render('./answered', {ans: quizResponse });
         });

app.listen(3000);
