/**
 * Created by rain on 2016/11/1.
 */
djEShopControllers.controller('UpdateEmailCtrl', function($scope, $state, $timeout,
                                                          Toast, PersonService, ValidateUtil,$ionicNativeTransitions){

  $scope.form = {};
  $scope.waitSeconds = 0;

  $scope.isValidEmail = function () {
    return ValidateUtil.isEmail($scope.form.email);
  };

  $scope.isValid = function () {
    return $scope.isValidEmail() && $scope.form.validateCode;
  };

  $scope.getCode = function () {
    PersonService.getEmailForChangeEmail($scope.form.email).then(function () {
      $scope.waitSeconds = 120;
      $timeout(function timePass () {
        $scope.waitSeconds--;
        if ($scope.waitSeconds > 0) {
          $timeout(timePass, 1000);
        }
      }, 1000);
    });
  };

  $scope.changeEmail = function () {
    PersonService.changeEmail($scope.form.email, $scope.form.validateCode).then(function () {
      Toast.show('修改邮箱成功');
      $ionicNativeTransitions.stateGo('personDetail');
    });
  };

});
