/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('LadingInfoCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, ResService, Toast, $q, $ionicHistory, $ionicSideMenuDelegate, LoginInfoUtil) {

  /**
   * 新增收货地址
   */
  var addAddressModal;

  $ionicModal.fromTemplateUrl('templates/modules/order/add-address.html', {
    scope: $scope
  }).then(function (modal) {
    addAddressModal = modal;
  });

  $scope.openTextureModal = function () {
    addAddressModal.show();
  };

  $scope.closeTextureeModal = function () {
    addAddressModal.hide();
  };

  $scope.$on('$destroy', function () {
    addAddressModal=null;
  });




});
