var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/business.html', function(req, res){
  if(req.user.accountType !== 'business') {
    res.status(401).send('Not Authorized');
  } else {
    res.sendFile(path.join(__dirname, '../business/business.html'));
  };
});

module.exports = router;
