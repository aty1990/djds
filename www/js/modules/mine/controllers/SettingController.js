djEShopControllers.controller('SettingCtrl', function ($scope, $ionicModal, $cordovaAppVersion, UpdateService, Toast) {

  var aboutUsModal = null, settingMessageModal = null;

  $scope.clientVersion = '1.0.0';
  $scope.buildVersion = 1022;
  $scope.QRCode = 'img/home/banner1.png';

  $scope.isIOS = ionic.Platform.isIOS();

  // 检查版本
  if (window.cordova) {
    $scope.checkVersion = function () {
      UpdateService.checkVersion();
    };

    $cordovaAppVersion.getVersionNumber().then(function (version) {
      $scope.clientVersion = version;
    });

    $cordovaAppVersion.getVersionCode().then(function (version) {
      $scope.buildVersion = version;
    });
  }

  // 关于我们
  $ionicModal.fromTemplateUrl('about-us.html', {
    scope: $scope
  }).then(function (modal) {
    aboutUsModal = modal;
  });

  $scope.openAboutUsModal = function () {
    aboutUsModal.show();
  };

  $scope.closeAboutUsModal = function () {
    aboutUsModal.hide();
  };

  /*
   $scope.checkVersion = function () {
   UpdateService.checkVersion();
   };*/

  $scope.message = {checked:true};
  $scope.messageCheckedChange = function (){
    Toast.show('暂不支持关闭消息通知');
    $scope.message.checked = true;
  };
  // 消息设置
  $ionicModal.fromTemplateUrl('setting-message.html', {
    scope: $scope,
    animation: 'slide-in-left'
  }).then(function (modal) {
    settingMessageModal = modal;
  });

  $scope.openSettingMessageModal = function () {
    settingMessageModal.show();
  };

  $scope.closeSettingMessageModal = function () {
    settingMessageModal.hide();
  };

  /**
   * 销毁 modal s
   */
  $scope.$on('$destroy', function () {
    aboutUsModal = null;
  });

});
