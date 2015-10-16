var express = require('express');
var router = express.Router();
var path = require('path');
var Freshbooks = require('freshbooksjs');
var freshbooks = new Freshbooks(process.env.APIURL, process.env.APIKEY);
var User = require('../models/users');
var expressJwt = require('express-jwt');

/* GET users listing. */
router.get('/:username?', expressJwt({secret: process.env.SECRET}), function (req, res) {
  if(req.user.accountType === 'admin' || req.user.username === req.params.username){
    var username = req.params.username ? {username: req.params.username} : {};
    console.log('finding users in db');
    User.find(username, function (err, result) {
        result.forEach(function(elem, index){
          result[index] = {
            username: elem.username,
            first_name: elem.first_name,
            last_name: elem.last_name,
            _id: elem._id,
            accountType: elem.accountType,
            email: elem.email,
            active: elem.active
          }
        });
        console.log('list of users: ', result);
        res.json(result)
      });
    } else {
      res.status(401).json({err: 'Not Authorized'});
    }
});


//create new user account
router.post('/', function (req, res) {
    ////backend validation for the form to stop the 133t hackers
    //req.checkBody('username', 'Invalid Username').isUsername();
    //req.checkBody('password', 'Invalid Password').isPassword();
    //req.checkBody('first_name', 'Invalid Name').isFirstName();
    //req.checkBody('last_name', 'Invalid Name').isLastName();
    //req.checkBody('phone', 'Invalid Phone Number').isMobile();
    //req.checkBody('email', 'Invalid Email').isEmail();
    //var errors = req.validationErrors();
    //if(errors){
    //    req.status(400).send("Form data not valid");
    //}


    //check to see if username already exists
    User.findOne({username: req.body.username}, function (err, user) {
        //Initialize the userExists variable to false- this is so the front end knows where to send the user after they sign up depending on if they are in Freshbooks or not
        var userExists = false;

        if (err) {
            console.log('error thrown ', err);
            res.sendStatus(400);
        }
        else if (user) {
            console.log('username ' + req.body.username + ' already exists');
            userExists = true;
            res.send({"userExists": userExists});
        }
        else {
            //if the username is open check to see if the email address is already in the mongo db
            User.findOne({email: req.body.email}, function (err, email) {
                console.log(email);
               if(err) {
                   console.log('error thrown checking email', err);
                   res.sendStatus(400);
               }
                else if (email){
                   console.log('email ' + req.body.username + ' already exists. Please log in to edit account');
                   userExists = true;
                   console.log(userExists);
                   res.send({"userExists": userExists});
               }
                else {
                    //if the email doesn't exist in our database then we begin the account creation process
                    //The data variable will store all the info that was sent through the form
                    var data = req.body;
                    data.username = data.username.toLowerCase();
                    //The email variable will store the users email address
                    var email = data.email;


                    //The postMongo variable stores the function to post info to the MongoDB- this will be called later
                    var postMongo = function (user) {
                        var user = new User(user);
                        user.save(function (err) {
                            if (err) {
                                console.log('mongo error thrown ', err);
                            }
                        })
                    };

                    //to check to see if they are in freshbooks first we get all the users that exist
                    freshbooks.client.list(function (error, clients) {

                        //loop through the users to see if the user signing up exists in Freshbooks by comparing the email addresses
                        clients.forEach(function (elem) {
                            if (elem.email == email) {
                                //if the email matches add the client_id to our data set so it can be stored in mongo later in process
                                data.client_id = elem.client_id;
                                //set the userExists to true so it can be sent to the client later in the process
                                userExists = true;
                                console.log("user exists in freshbooks");
                            }
                        });

                        //if they don't exist in freshbooks then do process to post them to freshbooks
                        if (!userExists) {
                            console.log("user doesn't exist in freshbooks");
                            console.log(data);

                            //make new object to store the userdata so that the password confirm field isn't passed to Freshbooks
                            var newFbUser = {};
                            newFbUser.username = data.username;
                            newFbUser.first_name = data.first_name;
                            newFbUser.last_name = data.last_name;
                            newFbUser.email = data.email;
                            newFbUser.mobile = data.mobile;
                            newFbUser.password = data.password;

                            //post user to freshbooks
                            freshbooks.client.create(newFbUser, function (error, client) {
                                if (error) {
                                    console.log('freshbooks error thrown', error.message);
                                } else {
                                    //if there is no error thrown, post info to mongo too
                                    console.log(data);
                                    //we need to store the client_id in mongo in order to find the user later
                                    data.client_id = client.client_id;
                                    //post to mongo by calling the postMongo function and passing it the data
                                    postMongo(data);
                                    console.log("it was posted to Freshbooks!");
                                    //send client-side the variable that will tell them that they need to send the user to the next page in the from
                                    res.send({"userExists": userExists, 'client_id': client.client_id});
                                }
                            });
                        } else {
                            //if the user already exists in the freshbooks database then we call only the postMongo info to send them to our mongo database
                            //(when we looped through the users in freshbooks and the email matched we pass in the client_id into the data variable so we can send that to mongo too)
                            postMongo(data);
                            //send the client side the variable that tells it that they need to send the user back to the log in page because they don't have to input credit card info
                            res.send({userExists: userExists, 'client_id': data.client_id});
                        }
                    });
               }
            });
        }
    })
});

//creating recurring invoice for current user/client_id
router.post('/invoice', function(req, res){
    console.log('Creating new recurring invoice for user ', req.body);

    var auto = {};

    //autobill information for live acct. Does not work on teamnordeast acct due lack of Stripe connection
/*
    auto.gateway_name = 'Stripe';
    auto.card = {};
    auto.card.number = req.body.cardNumber;
    auto.card.name = req.body.cardName;
    auto.card.expiration = {};
    auto.card.expiration.month = req.body.expirationMonth;
    auto.card.expiration.year = req.body.expirationYear;
*/

    var membership = {line: {name: 'Membership', unit_cost: '200', quantity: '1'}};
    var invoice = {client_id: req.body.client_id, frequency: 'monthly', autobill: auto, lines: membership};
    freshbooks.recurring.create(invoice, function(err, response){
        if(err) {
          console.log(err);
        };
        console.log('Recurring invoice created', response);
        User.findOne({client_id: response.client_id }, function(err, user){
            if(err){console.log(err)}
            else{
                user.recurring_id = response.recurring_id;
                user.save(function(err){
                    if(err){console.log(err)}
                    else{
                        console.log('recurring id added');
                        //res.sendStatus(200);
                    }
                })
            }
        })
        res.sendStatus(200);
    });
});


//update/change acct
router.put('/', expressJwt({secret: process.env.SECRET}), function (req, res) {
    console.log('changing some propterty on this user ', req.body.username);
    if(req.user.accountType === 'admin' || req.user.username === req.body.username) {
      User.findOne({username: req.body.username}, function (err, result) {
        if (result) {
            var user = result;
            if (req.body.cardNumber) {
                //!!An empty autobill object will remove autobill information from recurring invoices!!
                //All fields are required when updating autobill information
                var auto = {};
                /*
                 auto.gateway_name = 'Stripe';
                 auto.card = {};
                 auto.card.number = req.body.cardNumber;
                 auto.card.name = req.body.cardName;
                 auto.card.expiration = {};
                 auto.card.expiration.month = req.body.expirationMonth;
                 auto.card.expiration.year = req.body.expirationYear;
                 */
                freshbooks.recurring.update({recurring_id: result.recurring_id, autobill: auto}, function(err, response){
                    console.log('recurring invoice updated', response.autobill);
                    res.sendStatus(200);
                })
            }

            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.businessAcct) {
                user.businessAcct = req.body.businessAcct;
            }
            if (req.body.businessAcctUsers) {
                user.businessAcctUsers = req.body.businessAcctUsers;
            }
            if (req.body.accountType) {
                user.accountType = req.body.accountType;
            }
            if (req.body.accessCode) {
                user.accessCode = req.body.accessCode;
            }
            if (req.body.active) {
                user.active = req.body.active;
                var temp;
                var date = {};
                if(req.body.active == 'true'){
                    temp = 0;
                }else {
                    temp = 1;
                }
                if(req.body.date){
                    date = req.body.date;
                }
                console.log('right here: ', req.body.active, result.recurring_id);

            //stop/start recurring invoice based user active status
                freshbooks.recurring.update({recurring_id: result.recurring_id, stopped: temp , date: date }, function(err, response){
                    console.log('recurring invoice updated', response.stopped);
                } )

            }
            if (req.body.recurring_id) {
                user.recurring_id = req.body.recurring_id;
            }

            user.save(function (err) {
                if (err) {
                    console.log('error thrown ', err.message);
                }
                console.log('user ' + user.username + ' updated');
                res.send(user);
                //res.sendStatus(200);
            });
        }
    })
  }
});


//delete acct
router.delete('/', expressJwt({secret: process.env.SECRET}), function (req, res) {
    console.log('deleting user ', req.body.username);
    if(req.user.accountType === 'admin' || req.user.username === req.body.username) {
        User.findOneAndRemove({username: req.body.username}, function (err, doc, result) {
            if (err) {
                console.log('error thrown ', err.message);
                res.sendStatus(200);
            }
            else if (!doc) {
                console.log('user does not exist');
                res.sendStatus(200);
            }
            else {
                console.log('user ' + doc + ' deleted');
                res.sendStatus(200);
            }
        })
      } else {
      res.status(401).json({err: 'Not Authorized'});
    }
});

module.exports = router;
