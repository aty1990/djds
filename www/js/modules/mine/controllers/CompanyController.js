/**
 * Created by rain on 2016/11/1.
 */
djEShopControllers.controller('CompanyCtrl', function($scope, $state, $stateParams, PersonService, Toast,$ionicNativeTransitions){

  $scope.imgeUrl = '';

  PersonService.getCompanyInfo($stateParams.cmpyId).then(function (data) {
    $scope.mbr = data;
  });

  $scope.showImage = function (url) {
    $scope.imgeUrl = url;
  };

  $scope.hideImage = function () {
    $scope.imgeUrl = '';
  };

  $scope.saveDefaultCompany = function () {
    PersonService.saveDefaultCompany($stateParams.mbrId).then(function () {
      Toast.show('设置默认企业成功');
      $ionicNativeTransitions.stateGo('personDetail');
    });
  };

});
