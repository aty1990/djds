djEShopControllers.controller('LoginCtrl', function ($scope, $state, $stateParams, $filter, $ionicHistory,
                                                     Toast, ValidateUtil, PrivilegeService) {

  $scope.form = {};

  if ($stateParams.removeBackView) {
    $ionicHistory.removeBackView();
  }

  $scope.isValid = function () {
    var msg = '';

    if (!$scope.form.account) {
      msg = '请输入正确的账号';
    } else if (!ValidateUtil.isPassword($scope.form.password)) {
      msg = '请输入正确的密码';
    }

    if (msg.length > 0) {
      Toast.show(msg);
      return false;
    } else {
      return true;
    }
  };

  $scope.login = function () {
    if ($scope.isValid()) {
      PrivilegeService.login($scope.form.account, $scope.form.password);
    }
  };

});
