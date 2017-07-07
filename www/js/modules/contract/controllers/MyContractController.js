/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('MyContractCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, ContractService, Toast, $q, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, PAGE_SIZE) {


  $scope.queryParams = {
    pageNo: 0,
    pageSize: PAGE_SIZE,
    contractType: 1,
    busiNo: null
  };

  $scope.options = {
    activeTab: 1,
    moreData: false
  };

  /**
   * 切换 tab
   */
  $scope.switchTab = function (index) {
    $scope.options.activeTab = index;
    // $ionicScrollDelegate.scrollTop();// 回到顶部
    $ionicSlideBoxDelegate.$getByHandle('contractSlide').slide(index - 1);

    // if(index==1){
    //   if($scope.spotContractList){
    //     $scope.options.moreData = true;
    //   }else{
    //     loadData();
    //   }
    // }else if(index==2){
    //   if($scope.orderingContractList){
    //     $scope.options.moreData = true;
    //   }else{
    //     loadData();
    //   }
    // }
  };

  /**
   * 左右滑动切换
   * @param index
   */
  $scope.switchTabContent = function (index) {

    $ionicScrollDelegate.scrollTop();// 回到顶部
    $scope.options.activeTab = index + 1;
    loadData();
  };

  $scope.toSportContract = function () {
    $state.go('other-require');
  }


  /**
   * 加载更多
   */
  $scope.doLoad = function () {
    loadData(true);
  };
  /**
   * 下拉刷新
   */
  $scope.doRefresh = function () {
    $scope.options.moreData = false;
    loadData();
  };


  function loadData(forPage) {

    // 维护分页属性
    if (forPage) {
      $scope.queryParams.pageNo++;
    } else {
      $scope.queryParams.pageNo = 0;
    }

    $scope.queryParams.contractType = $scope.options.activeTab;

    ContractService.getContractList({
      pageNo: $scope.queryParams.pageNo,
      pageSize: $scope.queryParams.pageSize,
      contractType: $scope.queryParams.contractType,
      busiNo: $scope.queryParams.busiNo
    }).then((result) => {

      if ($scope.options.activeTab == 1) {
        $scope.spotContractList = forPage ? $scope.spotContractList.concat(result) : angular.copy(result);
        $scope.orderingContractList = null;
      } else if ($scope.options.activeTab == 2) {
        $scope.orderingContractList = forPage ? $scope.orderingContractList.concat(result) : angular.copy(result);
        $scope.spotContractList = null;
      }

      // 设置是否有更多数据标识
      $scope.options.moreData = (result && result.length == PAGE_SIZE);

    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

  /**
   * init load data
   */
  $scope.$on('$ionicView.enter', function () {
    loadData();
  });

  /**
   * 合同详情页
   * @param orderId
   */
  $scope.showDetail = function (contractId) {
    $state.go('contract-detail', {contractId: contractId});
  }


});
