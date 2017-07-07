/**
 * Created by shijing.guan on 2016/11/22.
 */
djEShopControllers.controller('MyEnjoyCtrl', function($scope, $state, $stateParams, PersonService, Toast){
  PersonService.getShowDiscountInfo().then(function (result){
    $scope.enjoy = result.discount;
  });
});
