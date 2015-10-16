var express = require('express');
var router = express.Router();
var Booking = require('../models/booking');


router.get('/:toolId?/:date?', function(req, res){
  console.log('getting booked timeslots', req.params);
    Booking.findOne({date: req.params.date, toolId: req.params.toolId}, function(err, result){
        if(err){console.log(err);}
        res.send(result);
    })
})

router.post('/', function(req, res){
    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        console.log(req.body);
        var check = undefined;
        var tempArray;
        if(err){console.log(err);}
        if(!result){
            var booking = new Booking(req.body);
            booking.save(function(err, result){
                if(err){
                    console.log('error thrown ', err.message);
                }
                else{
                    console.log('booking saved');
                    res.sendStatus(200);
                }
            })
        }
        if(result){
            tempArray = result.reservations;
            var reqArray = req.body.reservations;
            //var reqArray = [{hr: 0,userId: 'someuser', reserved: 'true'}, {hr: 3,userId: 'someuser', reserved: 'true'}, {hr: 5,userId: 'someuser', reserved: 'true'}, {hr: 10,userId: 'someuser', reserved: 'true'}, {hr: 17,userId: 'someuser', reserved: 'true'}];

            for(i = 0; i < tempArray.length; i++){
                reqArray.forEach(function(element, index, array){
                    console.log(element.hr);
                    if(element.hr == tempArray[i].hr){
                        console.log('timeslot already booked', element.hr, tempArray[i].hr );
                        reqArray.splice(index, 1);
                        check = true;
                    }
                })
            }
            if(check == true){
                console.log('booking...', reqArray);
                reqArray.forEach(function(element, index, array){
                    tempArray.push(element);
                })
                console.log('all bookings.. ', tempArray);
                result.resevations = tempArray;
                result.save(function(err, result){
                    if(err){console.log(err);}
                    else{
                        res.send(result);
                    }
                })
            }
        }
        if(result && check==undefined){
            console.log('adding new booking');
            var book = {dispTime: req.body.dispTime, hr: req.body.hr, userId: req.body.userId, reserved: req.body.reserved};
            tempArray.push(book);
            result.reservations = tempArray;
            result.save(function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result);
                }
            })
        }
        console.log(check);
    })//end findOne
})//end post


router.delete('/', function(req, res){
    console.log('deleting....');
   var reqArray = req.body.reservations;
   //var reqArray = [{hr: 12}, {hr: 10}, {hr: 13}, {hr: 14}];
   Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
       var tempArray;
       if(result){
           tempArray = result.reservations;

           for(i=0; i<reqArray.length; i++) {
               tempArray.forEach(function (element, index, array) {
                   console.log('booked time slot: ', element.hr, reqArray[i].hr);
                   if(element.hr == reqArray[i].hr) {
                       tempArray.splice(index, 1);
                   }
               })
           }

           console.log('temparray :', tempArray);
           result.reservations = tempArray;
           result.save(function(err, result){
               if(err){console.log(err);}
               res.send(result);
           })
       }

   })
});

module.exports = router;



