var express = require('express');
var router = express.Router();
var Tool = require('../models/tools');
var path = require('path');

//Get all tools from the mongo database or just get one tool by toolName
router.get('/:toolName?', function(req, res){
    console.log('finding tools in db');
    //If there is a toolName included in the query look for just that tool
    if(req.params.toolName) {
        Tool.findOne({}, function (err, tool){
            if(err) {
                console.log(err);
            } else {
                res.json(tool);
            }
        })
    } else {
        //else send back all the tools
        Tool.find( function(err, result){
            console.log('list of tools: ', result);
            res.json(result);
        })
    }
});

//add tool to the mongo database
router.post('/', function(req, res){
    console.log('adding tool...', req.body);
    req.body.online = true;
    //first check to see if the tool is already in the database
    Tool.findOne({toolName: req.body.toolName}, function(err, result){
        if(result === null){
            //if it isn't in the database create the tool
            Tool.create(req.body, function(err){
                if(err){
                    console.log('tool creation error thrown ', err.message);
                }
                else{
                    console.log('tool added');
                    res.sendStatus(200);
                }
            })
        }else {
            console.log('tool name ' + req.body.toolName + ' already exists');
            res.sendStatus(200);
        }
    });
});

//update/change tool
router.put('/', function(req, res){
    console.log('changing some property on this tool ', req.body.toolName);
    //find the tool
    Tool.findOne({toolName: req.body.toolName}, function(err, result){
        //If the tool is found go through all the attributes and update them if they have been inputted
        if(result){
            var tool = result;
            if(req.body.updateName){
                tool.toolName = req.body.updateName;
            }
            if(req.body.dailyHours){
                tool.dailyHours = req.body.dailyHours;
            }
            if(req.body.weeklyHours){
                tool.weeklyHours = req.body.weeklyHours;
            }
            if(req.body.online != undefined){
                console.log('req: ', req.body.online);
                tool.online = req.body.online;
            }
            tool.save(function(err){
                if(err){
                    console.log('error thrown ', err.message);
                }
                res.sendStatus(200);
            });
        }
    })
});

//delete tool
router.delete('/:id', function(req, res){
//find the tool in the database and if it is there delete it
    Tool.findOneAndRemove({_id: req.params.id}, function(err, doc, result){
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
