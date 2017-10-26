var passport = require('passport');
var User = require('../models/user');
var LocalStrategy= require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.serializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

passport.user('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCalback: true
}, function(req, email, password, done){
	User.findOne({'email': email})

}));