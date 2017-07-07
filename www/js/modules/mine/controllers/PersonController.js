/**
 * 账户信息控制器
 * Created by rain on 2016/10/14.
 */
djEShopControllers.controller('PersonCtrl', function (
    $scope, $state, $stateParams, $ionicPopup, $ionicHistory,
    CameraUtil, SimpleLocalStorage, PersonService, PrivilegeService, LoginInfoUtil,$ionicNativeTransitions) {

  var selectImagePopup = null;

  $scope.personInfo = {};
  $scope.mbrList = [];

  PrivilegeService.getUserInfo().then(function (userInfo) {
    $scope.personInfo = userInfo.person;
    $scope.mbrList = userInfo.mbrList;
    $scope.headImage = SimpleLocalStorage.get('headImage-' + $scope.personInfo.userId);

    $scope.goToChangePasswordPage = function () {
      $ionicNativeTransitions.stateGo('updatePswd', {personInfo: $scope.personInfo});
    };

    $scope.goToChangePhoneNumberPage = function () {
      $ionicNativeTransitions.stateGo('updateMobile', {personInfo: $scope.personInfo});
    };

    $scope.goToChangeEmailPage = function () {
      $ionicNativeTransitions.stateGo('updateEmail', {personInfo: $scope.personInfo});
    };

    $scope.goToCompanyPage = function (mbr) {
      $ionicNativeTransitions.stateGo('companyDetail', {mbr: mbr});
    };
  });

  $scope.logout = function () {
    $ionicPopup.confirm({
      title: '退出确认',
      template: '<div class="text-center font-size-16">是否退出登录?</div>',
      okText: '是',
      cancelText: '否'
    }).then(function (res) {
      if (res) {
        LoginInfoUtil.clearLoginInfo();
        $ionicNativeTransitions.stateGo('login', {removeBackView: true});
      }
    });
  };

  /**
   *  拍照
   */
  $scope.selectImage = function () {
    CameraUtil.show(function (imageData) {
      $scope.headImage = imageData;
      SimpleLocalStorage.set('headImage-' + $scope.personInfo.userId, $scope.headImage);
      $scope.otherRequireData.uploadImg=imageData;
    });
  };


});
