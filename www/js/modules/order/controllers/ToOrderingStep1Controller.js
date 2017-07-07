/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('ToOrderingStep1Ctrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, ResService, Toast, $q, $ionicHistory, $ionicSideMenuDelegate, LoginInfoUtil,SimpleLocalStorage) {

  $scope.orderingStep1Data=SimpleLocalStorage.get("orderingStep1Data");

  //统计总重量
  $scope.weightTotal=0;

  var step2Params={brandId:[],brand:[],placesteelId:[],placesteel:[],textureId:[],texture:[],spec:[],weight:[],customRequest:[]};

  $scope.orderingStep1Data.forEach(function (item) {
    step2Params.brandId.push(item.brandId);
    step2Params.brand.push(item.brand);
    step2Params.placesteelId.push(item.placesteelId);
    step2Params.placesteel.push(item.placesteel);
    step2Params.textureId.push(item.textureId);
    step2Params.texture.push(item.texture);
    step2Params.spec.push(item.spec);
    step2Params.weight.push(item.weight);
    step2Params.customRequest.push(item.customRequest);
    $scope.weightTotal+=parseFloat(item.weight);
  });

  $scope.submit = function () {
    $state.go('to-ordering-step2',{queryParams:step2Params});
  }

  $scope.back=function () {
    SimpleLocalStorage.rm('orderingStep1Data');
    $ionicHistory.goBack();
  }


});
