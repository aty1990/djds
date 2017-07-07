/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('OrderDetailCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, OrderService, Toast, $q, $ionicHistory, $ionicSideMenuDelegate, LoginInfoUtil) {

  /**
   * 查看订单明细
   */
  OrderService.getOrderDetail({orderId:$stateParams.orderId,orderType:$stateParams.orderType}).then((result) => {
    $scope.order = result.orderDetail;
    if($stateParams.orderType==2){
      $scope.order.detailList=$scope.order.orderDetailList;
    }
    $scope.busiLog = result.busiLog;
  })



});
