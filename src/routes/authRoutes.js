var express = require('express');
var authRouter = express.Router();
var mongoose = require('mongoose');
var User = require('../models/userModel');
var passport = require('passport');


var router = function() {
  authRouter.route('/signUp')
    .get(function (req,res) {
      res.render('user/signUp');
    })
    .post(function(req,res) {
      mongoose.connect('mongodb://localhost/ecommerce', function(err, db) {
        var collection = db.collection('users');
        var user = {
          userName : req.body.userName,
          password : req.body.password,
          secretanswer: req.body.secret
        };
        collection.insert(user, function(err, results) {
          req.login(results.ops[0], function() {
            res.redirect('/auth/profile');
          });
        });
      });

    })

  authRouter.route('/signIn')
    .get(function (req,res) {
      res.render('user/signIn');
    })
    .post(passport.authenticate('local', {
      failureRedirect: '/invalidPassword'
    }), function(req, res) {
      res.redirect('/auth/profile');
    })

  authRouter.route('/profile')
    .all(function(req,res,next) {
      if(!req.user) {
        res.redirect('/');
      }
      next();
    })
    .get(function(req,res) {
      res.json(req.user);
    })


  return authRouter;
}

module.exports = router;
