var express = require('express');
var router = express.Router();
var Booking = require('../models/booking');
var Freshbooks = require('freshbooksjs');
var freshbooks = new Freshbooks(process.env.APIURL, process.env.APIKEY);

router.get('/inv', function(req, res){
    freshbooks.invoice.list(function(err, result){
        var inv = [];
        result.forEach(function(elem, index){
            console.log(elem.recurring_id, elem.status, elem.date);
            if(elem.recurring_id == '34176'){
                inv.push(elem);
            }
        })
/*
        result.forEach(function(elem, index){
            if(parseInt(elem.number) == Math.max.apply(null,arr)){
                inv.push(elem);
            }
        })
*/
        res.send(inv);
    })
})


router.get('/:toolId?/:date?', function(req, res){
  console.log('getting booked timeslots', req.params);
    Booking.findOne({date: req.params.date, toolId: req.params.toolId}, function(err, result){
        if(err){console.log(err);}
        res.send(result);
    })
})


router.post('/', function(req, res){
    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        if(err){console.log(err);}

        //if search result empty, create new date object containing reservations of the requested time slots
        if(!result){
            var booking = new Booking(req.body);
            booking.save(function(err, result){
                if(err){
                    //console.log('error thrown ', err.message);
                }
                else{
                    console.log('booking saved');
                    res.sendStatus(200);
                }
            })
        }

        //if date objects exists, reserve those timeslots that are avaliable and discard the rest
        if(result){
            req.body.reservations = spliceArray(result.reservations, req.body.reservations);
            req.body.reservations.forEach(function(element, index, array){
                result.reservations.push(element);
            })
            console.log('all bookings.. ', result.reservations);
            result.save(function(err, result){
                if(err){console.log(err);}
                else{
                    res.send(result);
                }
            })
        }

    })//end findOne
})//end post

router.delete('/', function(req, res){

    var reqArray = [{hr: 8}, {hr: 9}, {hr: 13}, {hr: 14}];
    Booking.findOne({date: req.body.date, toolId: req.body.toolId}, function(err, result){
        if(result){
            //result.reservations = spliceArray(, result.reservations);
            result.save(function(err, result){
                if(err){console.log(err);}
                res.send(result);
            })
        }

    })
});



function spliceArray(a, b){
    console.log('in splicearray');
    for(i=0; i< a.length; i++){
        b.forEach(function(element,index,array){
            if(element.hr == a[i].hr){
                console.log('match: ', element.hr, a[i].hr)
                b.splice(index, 1);
            }
        })
    }
    return b;
}

module.exports = router;



