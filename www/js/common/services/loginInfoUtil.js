djEShopServices.service('LoginInfoUtil', function (SimpleLocalStorage) {

  // 登录后才能访问的路由
  var privilegeRouters = [
      'tab.myConcern',
      'tab.shopping-cart',
      'personDetail',
      'myBalance',
      'myEnjoy',
      'add-goods',
      'my-order',
      'my-contract'
  ];

  this.setLoginInfo = function (loginInfo) {
    SimpleLocalStorage.set('token', loginInfo.value);
    SimpleLocalStorage.set('refreshToken', loginInfo.refreshToken.value);
    SimpleLocalStorage.set('expiresIn', loginInfo.expiresIn);
    SimpleLocalStorage.set('tokenGenTime', Date.now());
  };

  this.getLoginInfo = function () {
    return {
      token: SimpleLocalStorage.get('token'),
      refreshToken: SimpleLocalStorage.get('refreshToken')
    };
  };

  this.clearLoginInfo = function () {
    SimpleLocalStorage.rm('token');
    SimpleLocalStorage.rm('refreshToken');
    SimpleLocalStorage.rm('expiresIn');
    SimpleLocalStorage.rm('tokenGenTime');
  };

  this.hasToken = function () {
    return !!SimpleLocalStorage.get('token');
  };

  // token是否存在并且是否已过期
  this.isExpired = function () {
    var token = SimpleLocalStorage.get('token');
    var expiresIn = SimpleLocalStorage.get('expiresIn');
    var tokenGemTime = SimpleLocalStorage.get('tokenGenTime');

    if (!token || !expiresIn || !tokenGemTime) {
      return true;
    }
    return token && (Date.now() - tokenGemTime > (expiresIn - 60) * 1000); // 设置60s误差
  };

  this.needLogin = function (routerName) {
    return ~privilegeRouters.indexOf(routerName) && !this.hasToken();
  };

});
