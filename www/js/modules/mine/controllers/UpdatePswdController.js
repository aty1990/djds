/**
 * Created by rain on 2016/11/1.
 */
djEShopControllers.controller('UpdatePswdCtrl', function ($scope, $state, $stateParams,
                                                          PersonService, Toast, LoginInfoUtil, ValidateUtil,$ionicNativeTransitions) {

  $scope.form = {};

  var personInfo = $stateParams.personInfo;

  $scope.isValid = function () {
    return ValidateUtil.isPassword($scope.form.oldPswd)
        && ValidateUtil.isPassword($scope.form.newPswd)
        && $scope.form.newPswd === $scope.form.confirmPswd;
  };

  $scope.changePassword = function () {
    PersonService.changePassword({
      userId: personInfo.userId,
      password: $scope.form.oldPswd,
      newPassword: $scope.form.newPswd
    }).then(function () {
      Toast.show('密码修改成功,请重新登录');
      $ionicNativeTransitions.stateGo('login');
      LoginInfoUtil.clearLoginInfo();
    });
  };

});
