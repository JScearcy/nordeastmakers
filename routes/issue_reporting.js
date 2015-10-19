/**
 * Created by Mothra on 10/16/15.
 */
var express = require('express');
var router = express.Router();
var Report = require('../models/issue_reporting');
var path = require('path');

//Get all reports from the mongo database
router.get('/', function(req, res){
    Report.find(function(err, result){
        res.json(result);
    });
});

//add report to the mongo database
router.post('/', function(req, res){
    Report.create(req.body, function(err){
        if(err){
            console.log('report creation error thrown ', err.message);
        }
        else{
            console.log('reported issue to admin');
            res.sendStatus(200);
        }
    });
});

//update/change report
router.put('/', function(req, res){
    Report.findOne({userId: req.body.userId}, function(err, result){
        if(result){
            var report = result;
            if(req.body.toolName){
                report.toolName = req.body.toolName;
            }
            if(req.body.issueReport){
                report.issueReport = req.body.issueReport;
            }
            report.save(function(err){
                if(err){
                    console.log('error thrown ', err.message);
                }
                res.sendStatus(200);
            });
        }
    })
});

//delete report
router.delete('/:id', function(req, res){
    Report.findOneAndRemove({_id: req.params.id}, function(err, doc, result){
        if(err){
            console.log('error thrown ', err.message);
            res.sendStatus(200);
        }
        else if(!doc){
            console.log('tool does not exist');
            res.sendStatus(200);
        }
        else{
            console.log('tool ' + doc + ' deleted');
            res.sendStatus(200);
        }
    })
});

module.exports = router;