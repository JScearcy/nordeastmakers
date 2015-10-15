var express = require('express');
var router = express.Router();
//var xml2js = require('xml2js');
var Freshbooks = require('freshbooksjs');
//var freshbooks = new Freshbooks("https://teamnordeast.freshbooks.com/api/2.1/xml-in", "a5f4b3b560d79f98dfe4a98a058521bc");
var freshbooks_live = new Freshbooks(process.env.APIURL, process.env.APIKEY);

router.get('/', function(req, res, next){
    console.log('getting list of invoices from Freshbooks');
    freshbooks_live.recurring.list(function(err, invoices){
        console.log('printing invoices ', invoices);
        res.send(invoices);
        //res.sendStatus(200);
    })
});


router.get('/inv', function(req, res){
    freshbooks_live.recurring.get({client_id: '424911'}, function(err, response){
        if(err){console.log(err)}
        console.log('printing clients', response );
        res.send(response);
    })
})

router.get('/cid/:email?', function(req, res){
    console.log('getting dummy client', req.params);
    freshbooks_live.client.get({email: req.params.email}, function(err, response){
        if(err){console.log(err)};
        console.log('printing client by email: ', req.params.email);
        res.send(response);
    })
})

router.post('/', function(req, res, next){
    var dummy = {};
    dummy.first_name = req.body.first;
    dummy.last_name = req.body.last;
    dummy.email = req.body.email;
    dummy.username = 'alnig441';
    dummy.password = 'always0k';
    console.log('building dummy user: ', dummy);

    freshbooks_live.client.create(dummy, function (error, client) {
        if (error) {
            console.log('freshbooks error thrown', error.message);
        } else {
            //if there is no error thrown, post info to mongo too
            console.log(client);
            //we need to store the client_id in mongo in order to find the user later
            data.client_id = client.client_id;
            //post to mongo by calling the postMongo function and passing it the data
            console.log("it was posted to Freshbooks!");
            //send client-side the variable that will tell them that they need to send the user to the next page in the from
            res.send({"userExists": userExists, 'client_id': client.client_id});
        }
    })
});

router.put('/', function(req, res, next){
    console.log('Creating new invoice');
    var membership = {line: {name: 'DummyMembership', unit_cost: '1', quantity: '1'}};
    //var autobill = {gateway_name: 'Stripe'};
    var invoice = {client_id: '424911', frequency: 'monthly', lines: membership};
    freshbooks_live.recurring.create(invoice, function(err, response){
        if(err){console.log(err)};
        //console.log('Recurring invoice created for ' + response.first_name + ' ' + response.last_name +' for line item: ' + response.lines.line.name);
        console.log('recurring invoice ', response);
        res.send(response);
        //res.sendStatus(200);

    })
});

router.put('/update', function(req, res){
    console.log('updating recurring dummy invoice');
    var auto = {};
    auto.gateway_name = 'Stripe';
    auto.card = {};
    auto.card.number = '4111 1111 1111 1111';
    auto.card.name = 'Ignore Dummy';
    auto.card.expiration = {};
    auto.card.expiration.month = '10';
    auto.card.expiration.year = '2018';
    freshbooks_live.recurring.update({recurring_id: "00000034167", stopped: 1 }, function(err, response){
        if(err){console.log(err)}
        console.log('recurring invoice updated', response.stopped);
        res.send(response);
    } )
})

router.delete('/', function(req,res){
    var inv = {};
    inv.recurring_id = '34167';
    console.log('deleting recurring invoice ', inv);

    freshbooks_live.recurring.delete({recurring_id: '34167', line_id: '123901' }, function(err, response){
        console.log('recurring dummy invoice deleted');
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})


module.exports = router;
