djEShopControllers.controller('HomeTrademarkCtrl', function ($scope, $state, homeService, Toast, $stateParams,$ionicNativeTransitions) {

  homeService.getFactoryRecommendDetail().then(function (result){
    // brandList 有数据的 置顶
    var dataList1 =[], dataList2 =[];
    for (var i = 0; i < result.length; i++) {
      if(result[i].brandList && result[i].brandList.length>0){
        dataList1[dataList1.length] = result[i];
      }else{
        dataList2[dataList2.length] = result[i];
      }
    }
    $scope.dataList = dataList1.concat(dataList2);

    $scope.param_placesteelId = $stateParams.placesteelId;
  });

  $scope.clickBrand = function (brand){
    $ionicNativeTransitions.stateGo("res-list",{query:{ brandId: brand.brandId,brandName: brand.brandName}});
  }

});
