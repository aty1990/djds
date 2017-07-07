/**
 * Created by rain on 2016/11/7.
 */
djEShopApp.config(function ($stateProvider) {
  $stateProvider
      //填写现货订单
      .state('to-spot-order', {
        url: 'order/to-spot-order',
        controller: 'ToSpotOrderCtrl',
        templateUrl: 'templates/modules/order/to-spot-order.html',
        params: {
          shopcartIdStr: null
        }
      })
      .state('lading-info', {
        url: 'order/lading-info',
        controller: 'LadingInfoCtrl',
        templateUrl: 'templates/modules/order/lading-info.html'
      })
      //订货订单->其他要求
      .state('other-require-ordering', {
        url: 'order/other-require-ordering',
        controller: 'OtherRequireOrderingCtrl',
        templateUrl: 'templates/modules/order/other-require-ordering.html'
      })
      .state('my-order', {
        url: 'order/my-order',
        controller: 'MyOrderCtrl',
        templateUrl: 'templates/modules/order/my-order.html',
        cache:false,
        params:{
          orderType:null
        }
      })
      .state('order-detail', {
        url: 'order/order-detail',
        controller: 'OrderDetailCtrl',
        templateUrl: 'templates/modules/order/order-detail.html',
        cache:false,
        params:{
          orderId:null,
          orderType:null
        }
      })
      .state('to-ordering-step1', {
        url: 'order/to-ordering-step1',
        controller: 'ToOrderingStep1Ctrl',
        cache:false,
        templateUrl: 'templates/modules/order/to-ordering-step1.html'
      })
      .state('to-ordering-step2', {
        url: 'order/to-ordering-step2',
        controller: 'ToOrderingStep2Ctrl',
        cache:false,
        templateUrl: 'templates/modules/order/to-ordering-step2.html',
        params:{
          queryParams:{}
        }
      })
});
