app.controller('adminReportCtrl', ['$scope', '$http', '$location', 'toolService', function($scope, $http, $location, toolService){
  function getIssueReports(){
    toolService.getReports(function(issues){
      $scope.issues = issues;
    });
  }

  getIssueReports();

  $scope.removeItem = function(issue){
    toolService.deleteReport(issue._id, function(){
      getIssueReports();
    })
  }
}]);
