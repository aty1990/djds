djEShopControllers.controller('HomeCategoryCtrl', function ($scope, $state, $stateParams, homeService, Toast,$ionicNativeTransitions) {

  var params = $stateParams.param;
  $scope.type = params.type;
  $scope.dataList = params.type == 1 ? params.firstBrands : params.secondBrands;

  $scope.clickBrand = function (brand){
    $ionicNativeTransitions.stateGo("res-list",{query:{ brandId: brand.brandId,brandName: brand.brandName}});
  };

  $scope.clickVariety = function (type){
    if($scope.type != type){
      $scope.type = type;
      $scope.dataList = type == 1 ? params.firstBrands : params.secondBrands;
    }
  };

});
