djEShopApp.config(function ($stateProvider) {

  $stateProvider

      .state('home-category', {
        url: '/home/category',
        templateUrl: 'templates/modules/home/category.html',
        controller: 'HomeCategoryCtrl',
        cache: false,
        params: {
          param: null
        }
      })
      .state('home-trademark', {
        url: "/home/trademark/:placesteelId",
        controller: 'HomeTrademarkCtrl',
        templateUrl: 'templates/modules/home/trademark.html'
      })

});
