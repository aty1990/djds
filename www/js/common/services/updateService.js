djEShopServices.service('UpdateService', function ($rootScope, $window, $ionicPopup, $timeout, $cordovaFileTransfer,
                                                      $cordovaFileOpener2, $cordovaAppVersion, httpUtil, Toast) {

  var versionData;
  var updatePopup;

  var updateScope = $rootScope.$new();
  updateScope.isDownloading = false;
  updateScope.isDownloaded = false;

  updateScope.close = function () {
    if (versionData.forceUpdate === 1) { // 对于强制更新的版本,取消更新即直接退出App
      ionic.Platform.exitApp();
    }
    else {
      updatePopup && updatePopup.close();
    }
  };

  updateScope.update = function () {
    if (ionic.Platform.isAndroid()) {
      updateVersion(updateScope.version);
    } else if (ionic.Platform.isIOS()) {
      $window.open(versionData.downloadLink);
    }
  };

  this.checkVersion = function (silence) {
    httpUtil.get('home/getNewestAppVersion', {deviceType: ionic.Platform.isIOS() ? 'ios' : 'android'}).then(function (data) {
      versionData = data;

      if (!data || !data.appVersion) {
        Toast.show('版本检查失败!');
      } else {
        if (window.cordova) {
          $cordovaAppVersion.getVersionNumber().then(function (clientVersion) {
            if (clientVersion && clientVersion != data.appVersion) {
              showUpdateConfirm();
            }
            else if (!silence) {
              Toast.show('已经是最新版本');
            }
          });
        } else {
          console.warn('cordova is not available');
        }
      }
    });
  };

  var showUpdateConfirm = function () {
    updateScope.version = versionData.appVersion;
    updateScope.isForceUpdate = (versionData.forceUpdate === 1) ? true : false;

    //if (ionic.Platform.isAndroid()) {
      updatePopup = $ionicPopup.show({
        title: '版本更新',
        scope: updateScope,
        templateUrl: 'templates/modules/mine/popup/update-popup.html'
      });
    /*} else {
      Toast.show('只有Android版支持在线更新');
    }*/
  };

  var updateVersion = function (version) {
    var targetPath = cordova.file.externalRootDirectory + 'jwApp.apk';

    if (versionData.downloadLink) {
      $cordovaFileTransfer.download(versionData.downloadLink, targetPath, {}, true).then(function (result) {
        updateScope.isDownloading = false;
        updateScope.isDownloaded = true;
        install(version, targetPath);

      }, function (err) {
        updateScope.isDownloading = false;
        Toast.show("更新失败: " + err.http_status);

      }, function (progress) {
        updateScope.isDownloading = true;
        $timeout(function () { //进度，这里使用文字显示下载百分比
          updateScope.$apply( function() {
            var downloadProgress = (progress.loaded / progress.total) * 100;
            updateScope.downloadContent = "已经下载：" + Math.floor(downloadProgress) + "%";

            if (downloadProgress >= 100) {
              updateScope.downloadContent = '下载完成, 安装更新中...';
            }
          });
        })
      });
    }
    else {
      Toast.show('更新地址错误: ' + versionData.downloadLink);
    }
  };

  var install = function (version, targetPath) {
    $cordovaFileOpener2
        .open(targetPath, 'application/vnd.android.package-archive')
        .then(function () {
          console.log('更新成功!');
        }, function (err) {
          Toast.show("安装失败:" + err);
        }).finally(function () {
      updateScope.close();
      updateScope.isDownloading = false;
      updateScope.isDownloaded = false;
    });
  };


});