djEShopServices.service('httpUtil',
function (
    $state,
    $ionicNativeTransitions,
    $http,
    $q,
    $ionicLoading,
    $timeout,
    $cordovaNetwork,
    Toast,
    LoginInfoUtil,
    SERVER_API_URL
) {

  var that = this,
      httpLoadingTimer = null,
      isRefreshing = false,
      requestOptionQueue = [];

  var showHttpLoading = function (textWhenLoading) {
    if (httpLoadingTimer) {
      return undefined;
    }
    else {
      return httpLoadingTimer = $timeout(function () {
        $ionicLoading.show({
          template: textWhenLoading || '加载中...'
        });
      });
    }
  };

  var hideHttpLoading = function () {
    if (httpLoadingTimer) {
      $timeout.cancel(httpLoadingTimer);
      httpLoadingTimer = null;
    }
    $ionicLoading.hide();
  };

  var handleUrl = function (url) {
    if (url.indexOf('?') > 0) {
      url = url.replace('?', '.json?');
    } else {
      url += '.json';
    }
    return url;
  };

  var refreshToken = function (refreshToken) {
    var refreshDefer = $q.defer();
    var refreshOption = {
      method: 'post',
      url: SERVER_API_URL + 'oauth/token.json',
      data: {
        "client_id": "mobile-client",
        "client_secret": "mobile",
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }
    };

    $http(refreshOption).then(function (response) {
      var data = response.data;
      LoginInfoUtil.setLoginInfo(data);
      refreshDefer.resolve(data);
    }).catch(function (error) {
      refreshDefer.reject(error);
      //LoginInfoUtil.clearLoginInfo();
    });

    return refreshDefer.promise;
  };

  var request = function (method, url, params, textWhenLoading, failMessage) {
    var httpDefer = $q.defer();

    that.isOnline().then(function (isOnline) {
      if (isOnline) {
        var loginInfo = LoginInfoUtil.getLoginInfo();

        var httpOption = {
          timeout: 10000,
          method: method,
          url: SERVER_API_URL + url,
          params: (method === 'get') ? params : null,
          data: (method === 'get') ? null : params
        };

        // 如果Url中包含check,则表示该Url需要验证token
        if (!~url.indexOf('check')) { // Url不包含check
          doRequest(httpDefer, httpOption, textWhenLoading, failMessage, url);
        } else {
          // 判断是否拥有token
          if (LoginInfoUtil.hasToken()) {
            // 是否已有token 并且 token是否过期
            if (!LoginInfoUtil.isExpired()) {
              doRequest(httpDefer, setToken(httpOption, loginInfo.token), textWhenLoading, failMessage);
            }
            else {
              // 是否正在刷新 token
              if (isRefreshing) {
                console.warn('token is refreshing.');
                requestOptionQueue.unshift(httpOption);
              }
              else {
                isRefreshing = true;
                refreshToken(loginInfo.refreshToken).then(function () {
                  loginInfo = LoginInfoUtil.getLoginInfo();

                  var tempHttpOption;
                  requestOptionQueue.unshift(httpOption);
                  while (tempHttpOption = requestOptionQueue.pop()) {
                    doRequest(httpDefer, setToken(tempHttpOption, loginInfo.token), textWhenLoading, failMessage);
                  }
                }).catch(function (error) {
                  Toast.show('更新登录状态发生异常: ' + error.statusText + '[' + error.status + '], 请重新登录');
                  httpDefer.reject(error);
                }).finally(function () {
                  isRefreshing = false;
                });
              }
            }
          } else {
            console.warn(url + ' 需要登录才能访问!');
          }
        }
      } else {
        var errorMsg = '网络已断开,请检查您的设备是否联网';
        Toast.show(errorMsg);
        httpDefer.reject(new Error(errorMsg));
      }
    });

    return httpDefer.promise;
  };

  var setToken = function (option, token) {
    if (option.method === 'get') {
      option.params.access_token = token;
    } else {
      option.data.access_token = token;
    }
    return option;
  };

  var doRequest = function (httpDefer, option, textWhenLoading, failMessage, crudeUrl) {
    // 显示加载信息
    showHttpLoading(textWhenLoading);

    $http(option).then(function (response) {
      var reData = response.data;
      if (reData.code === 0) {
        httpDefer.resolve(reData.data);
      }
      else if (crudeUrl && crudeUrl.indexOf('oauth') === 0 && reData.value) { // login
        httpDefer.resolve(reData);
      }
      else {
        httpDefer.reject(reData);
        Toast.show('操作失败: ' + reData.message);
      }
    }, function (error) {
      Toast.show(failMessage || '服务器请求异常: ' + error.statusText + '[' + error.status + ']');
      httpDefer.reject(error);

      /*if (error.status == -1) {
       Toast.show('登录信息异常,请重新登录');
       StateUtil.go('login', {removeBackView: true});
       }
       else {
       Toast.show(failMessage || '服务器请求异常: ' + error.statusText + '[' + error.status + ']');
       }*/
    }).finally(hideHttpLoading);
  };

  this.get = function (url, params, textWhenLoading, failMessage) {
    return request('get', url, params || {}, textWhenLoading, failMessage);
  };

  this.post = function (url, params, textWhenLoading, failMessage) {
    return request('post', url, params || {}, textWhenLoading, failMessage);
  };

  this.isOnline = function () {
    var defer = $q.defer();
    if (!window.cordova) {
      defer.resolve(true);
    } else {
      ionic.Platform.ready(function () {
        defer.resolve($cordovaNetwork.isOnline());
      });
    }
    return defer.promise;
  };

});
