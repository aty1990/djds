djEShopControllers.controller('RegisterCtrl', function ($scope, $timeout, $ionicModal,
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
    } else if (!$scope.form.isAllowed) {
      msg = '请勾选"已阅读并同意注册协议"';
    }

    if (msg.length > 0) {
      Toast.show(msg);
      return false;
    } else {
      return true;
    }
  };

  // 获取验证码
  $scope.getCode = function () {
    if (!ValidateUtil.isPhoneNumber($scope.form.phoneNumber)) {
      Toast.show('请输入正确的手机号');
    } else {
      $scope.isWait = true;
      PrivilegeService.getValidateCodeOfRegister($scope.form.phoneNumber).then(function () {
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

  // 注册
  $scope.register = function () {
    if ($scope.isValid()) {
      PrivilegeService.register({
        cellphone: $scope.form.phoneNumber,
        dynamicCode: $scope.form.validateCode,
        userPwd1: $scope.form.password
      }).then(function (data) {
        // 注册成功后自动登录
        PrivilegeService.login($scope.form.phoneNumber, $scope.form.password);
      });
    }
  };

  var agreementModal = null;

  $ionicModal.fromTemplateUrl('agreement-modal.html', {
    scope: $scope
  }).then(function (modal) {
    agreementModal = modal;
  });

  $scope.openAgreementModal = function () {
    agreementModal.show();
  };

  $scope.closeAgreementModal = function () {
    agreementModal.hide();
  };

  $scope.$on('$destroy', function () {
    agreementModal.remove();
  });

});