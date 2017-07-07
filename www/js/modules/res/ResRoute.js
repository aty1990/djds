/**
 * Created by rain on 2016/11/7.
 */
djEShopApp.config(function ($stateProvider) {
  $stateProvider .state('res-list', {
      url: 'res/list',
      controller: 'ResCtrl',
      templateUrl: 'templates/modules/res/res-list.html',
      cache:false,
      params:{
        query:{}
      }
    })
    .state('add-goods', {
      url: 'res/add-goods',
      controller: 'AddGoodsCtrl',
      templateUrl: 'templates/modules/res/add-goods.html',
      cache:false
    })
});
