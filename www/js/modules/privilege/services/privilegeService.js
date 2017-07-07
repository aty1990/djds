djEShopServices.service('PrivilegeService', function ($ionicNativeTransitions, httpUtil, LoginInfoUtil) {

  this.register = function (params) {
    return httpUtil.post('person/doRegister', params);
  };

  this.getValidateCodeOfRegister = function (cellphone) {
    return httpUtil.post('person/registerSendSms', {cellphone: cellphone});
  };

  this.login = function (account, password) {
    httpUtil.post('oauth/token.json', {
      username: account,
      password: password,
      client_id: 'mobile-client',
      client_secret: 'mobile',
      grant_type: 'password',
      scope: 'read'
    }, null, '登录失败: 用户名或密码不正确').then(function (loginInfo) {
      LoginInfoUtil.setLoginInfo(loginInfo);
      $ionicNativeTransitions.stateGo('tab.mine');
    }).catch(function (error) {
      //LoginInfoUtil.clearLoginInfo();
    });
  };

  this.getUserInfo = function () {
    return httpUtil.get('check/person/getPersonInfo');
  };

  this.findPassword = function (params) {
    return httpUtil.post('person/retrievePassword', params);
  };

  this.getValidateCodeForFindPassword = function (cellphone) {
    return httpUtil.post('person/getCaptchasCode', {cellphone: cellphone});
  };

});