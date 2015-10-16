var express = require('express');
var router = express.Router();
//var xml2js = require('xml2js');
var Freshbooks = require('freshbooksjs');


router.get('/', function(req, res, next){
    console.log('getting list of invoices from Freshbooks');
    freshbooks.recurring.list(function(err, invoices){
        console.log('printing invoices ', invoices);
        res.send(invoices);
        //res.sendStatus(200);
    })
});

router.put('/', function(req, res, next){
    console.log('Creating new invoice');
    var membership = {line: {name: 'Membership', unit_cost: '200', quantity: '1'}};
    var invoice = {client_id: '8452', frequency: 'monthly', lines: membership};
    freshbooks.recurring.create(invoice, function(err, response){
        console.log('Recurring invoice created for ' + response.first_name + ' ' + response.last_name +' for line item: ' + response.lines.line.name);
        res.sendStatus(200);

    })
});

router.put('/updateInvoice', function(req, res, next){
    freshbooks.recurring.update({recurring_id: '00000000132', stopped: '1'}, function(err, response){
        console.log('updating invoice ', err, response);
    });
});


module.exports = router;