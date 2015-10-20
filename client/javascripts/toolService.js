app.service('toolService', ['$http', function($http){
  //get all the tools and return the data to the callback
  this.getTools = function (cb){
  return $http({
    method: 'GET',
    url: '/tools'
    }).then(function(res){
       cb(res.data);
    });
  };
  //pull issues that have been reported from server
  this.getReports = function(cb){
    return $http({
      method: 'GET',
      url: '/issues'
    }).then(function(res){
      cb(res.data);
    });
  };
  //delete a report
  this.deleteReport = function(id, cb){
    if(id){
      return $http({
        method: 'DELETE',
        url: '/issues/' + id
      }).then(function(res){
        if(cb){
          cb(res)
        }
      })
    }
  }
}]);
