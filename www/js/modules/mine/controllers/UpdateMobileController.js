/**
 * Created by rain on 2016/11/1.
 */
djEShopControllers.controller('UpdateMobileCtrl', function($scope, $state, $timeout,
                                                           PersonService, Toast, ValidateUtil,$ionicNativeTransitions){

  $scope.form = {};
  $scope.waitSeconds = 0;

  $scope.isValidPhoneNumber = function () {
    return ValidateUtil.isPhoneNumber($scope.form.phoneNumber);
  };

  $scope.isValid = function () {
    return ValidateUtil.isPhoneNumber($scope.form.phoneNumber)
      && $scope.form.validateCode;
  };

  $scope.getCode = function () {
    PersonService.getValidateCodeForChangePhoneNumber($scope.form.phoneNumber).then(function (data) {
      $scope.waitSeconds = 120;
      $timeout(function timePass () {
        $scope.waitSeconds--;
        if ($scope.waitSeconds > 0) {
          $timeout(timePass, 1000);
        }
      }, 1000);
    });
  };

  $scope.changePhoneNumber = function () {
    PersonService.changePhoneNumber($scope.form.phoneNumber, $scope.form.validateCode).then(function (data) {
      Toast.show('修改手机号成功');
      $ionicNativeTransitions.stateGo('personDetail');
    });
  };

});
