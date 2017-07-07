djEShopControllers.controller('FindPasswordCtrl', function ($scope, $state, $timeout, $ionicNativeTransitions,
                                                            Toast, ValidateUtil, PrivilegeService) {
  $scope.form = {};
  $scope.isWait = false;

  // 验证手机号
  $scope.isPhoneNumberValid = function () {
    return ValidateUtil.isPhoneNumber($scope.form.phoneNumber);
  };

  // 统一验证
  $scope.isValid = function () {
    var msg = '';

    if (!ValidateUtil.isPhoneNumber($scope.form.phoneNumber)) {
      msg = '请输入正确的手机号';
    } else if (!$scope.form.validateCode) {
      msg = '请输入正确的验证码';
    } else if (!ValidateUtil.isPassword($scope.form.password)) {
      msg = '请输入正确的新密码';
    } else if ($scope.form.password !== $scope.form.passwordConfirmed) {
      msg = '请输入正确的确认密码';
    }

    if (msg.length > 0) {
      Toast.show(msg);
      return false;
    } else {
      return true;
    }

    /*return ValidateUtil.isPhoneNumber($scope.form.phoneNumber)
        && $scope.form.validateCode
        && ValidateUtil.isPassword($scope.form.password)
        && $scope.form.password === $scope.form.passwordConfirmed;*/
  };

  // 获取验证码
  $scope.getCode = function () {
    if (!ValidateUtil.isPhoneNumber($scope.form.phoneNumber)) {
      Toast.show('请输入正确的手机号');
    } else {
      $scope.isWait = true;
      PrivilegeService.getValidateCodeForFindPassword($scope.form.phoneNumber).then(function () {
        $scope.waitSeconds = 120;
        $timeout(function timePass () {
          $scope.waitSeconds--;
          if ($scope.waitSeconds > 0) {
            $timeout(timePass, 1000);
          } else {
            $scope.isWait = false;
          }
        }, 1000);
      }).catch(function () {
        $scope.isWait = false;
      });
    }
  };

  // 修改密码
  $scope.findPassword = function () {
    if ($scope.isValid()) {
      PrivilegeService.findPassword({
        cellphone: $scope.form.phoneNumber,
        captchasCode: $scope.form.validateCode,
        password: $scope.form.password
      }).then(function (data) {
        $ionicNativeTransitions.stateGo('login');
      });
    }
  };

});