/**
 * Created by rain on 2016/11/1.
 */
djEShopControllers.controller('MyBalanceCtrl', function($scope, $state, $stateParams, PersonService, Toast){
  // $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  //   viewData.enableBack = true;
  // });


  PersonService.getCustomerBalance().then(function (result) {
    $scope.balanceData=result;
  });

});
