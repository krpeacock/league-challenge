const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
const routes = require("./routes");
const flash = require('connect-flash');

app.set("view engine", "jade");
app.use(express.static(__dirname + "/public"));
app.use(morgan("tiny"))
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  maxage: 3600000
  })
);


// get passport + flash messages started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./helpers/passport')(passport);

app.use('/', routes.auth)
app.use('/users', routes.users)
app.use('/users/:user_id/posts', routes.posts)

app.get('/', function(req,res){
  res.redirect('/login')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});
