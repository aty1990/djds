/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('MyConcernCtrl', function ($scope, $ionicActionSheet, $state, Toast, MyConcernService,$ionicNativeTransitions,$ionicModal) {

  $scope.queryParam = {};
  // $scope.queryParam.pageSize = 15;

 /* function loadData(forPage) {

    // 维护分页属性
    if (forPage) {
      $scope.queryParam.pageNo++;
    } else {
      $scope.queryParam.pageNo = 0;
    }
    MyConcernService.getConcernList($scope.queryParam).then((result) => {
      // 设置是否有更多数据标识
      $scope.moreData = (result && result.length > 0);
      $scope.resList = forPage ? $scope.resList.concat(result) : angular.copy(result);

    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }*/

  function loadData() {
    MyConcernService.getConcernList().then(function (result) {
      $scope.resList = result;
    });
  }


  /**
   * init load data
   */
  $scope.$on('$ionicView.enter', function () {
    loadData();
  });

  /**
   * 加载更多
   */
 /* $scope.doLoad = function () {
    loadData(true);
  };*/

  /**
   * 下拉刷新
   */
  $scope.doRefresh = function () {
    loadData();
  };


  $scope.toResListPage = function (res) {
    var placesteelIdList = [], textureIdList = [];
    placesteelIdList[0] = res.placesteelId;
    textureIdList[0] = res.textureId;
    $ionicNativeTransitions.stateGo("res-list", {
      query: {
        brandId: res.brandId,
        brandName: res.brandName,
        placesteelIdList: placesteelIdList,
        textureIdList: textureIdList,
        specId: res.specId
      }
    });
  };

  // 清空所有关注信息
  $scope.clearConcern = function () {
    $scope.concernCancelAllModal.show();
  };

  // 提交 modal
  $ionicModal.fromTemplateUrl("concern-cancel-modal.html", {
    scope: $scope
  }).then(function (modal) {
    $scope.concernCancelModal = modal;
  });

  $scope.close = function () {
    $scope.concernCancelModal.hide();
  };

  $scope.confirm = function () {
      MyConcernService.cancelConcernSingle({concernId:  $scope.resSelected.concernId}).then(function () {
            Toast.show("取消关注成功！");
            loadData();
            $scope.close();
      });
  };

  // 清空单个关注信息
  $scope.clearConcernSingle = function (res) {
    $scope.resSelected=res;
    $scope.concernCancelModal.show();
  };

  // 提交 modal
  $ionicModal.fromTemplateUrl("concern-cancel-all-modal.html", {
    scope: $scope
  }).then(function (modal) {
    $scope.concernCancelAllModal = modal;
  });

  $scope.closeAll = function () {
    $scope.concernCancelAllModal.hide();
  };

  $scope.confirmAll = function () {
    MyConcernService.clearConcern().then(function (result) {
      Toast.show("清空关注成功！");
      $scope.resList = null;
      $scope.closeAll();
    });
  };

});
