/**
 * Created by allannielsen on 19/10/15.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/users');
var expressJwt = require('express-jwt');


//create helper or admin accts
router.post('/', expressJwt({secret: process.env.SECRET}),function(req, res){
    console.log('creating admin acct', req.body);
    User.findOne({username: req.body.username}, function(err, user){
        if(err){console.log(err);}
        else if(user){
            console.log('username already exists');
            res.send(user);
        }
        else{
            var user = new User(req.body);
            user.save(function(err, response){
                if(err){console.log(err);}
                else{
                    res.send(response);
                }
            })
        }
    })
});

module.exports = router;