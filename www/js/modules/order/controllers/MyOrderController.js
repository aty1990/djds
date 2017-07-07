/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('MyOrderCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, OrderService, Toast, $q, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, PAGE_SIZE, $ionicPopup, ionicDatePicker, $filter) {


  $scope.queryParams = {
    pageNo: 0,
    pageSize: PAGE_SIZE,
    orderType: $stateParams.orderType ? $stateParams.orderType : 1,
    orderNo: null,
    brandName: null,
    begDate: null,
    endDate: null
  };

  $scope.options = {
    activeTab: $scope.queryParams.orderType,
    moreData: false
  };


  /**
   * 切换 tab
   */
  $scope.switchTab = function (index) {
    $scope.options.activeTab = index;
    // $ionicScrollDelegate.scrollTop();// 回到顶部
    $ionicSlideBoxDelegate.$getByHandle('orderSlide').slide(index - 1);

    // if(index==1){
    //   if($scope.spotOrderList){
    //     $scope.options.moreData = true;
    //   }else{
    //     loadData();
    //   }
    // }else if(index==2){
    //   if($scope.orderingOrderList){
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
    $scope.options.activeTab = index+1;
    loadData();

  };

  $scope.toSportOrder = function () {
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
    $scope.options.moreData=false;
    loadData();
  };

  function loadData(forPage) {

    // 维护分页属性
    if (forPage) {
      $scope.queryParams.pageNo++;
    } else {
      $scope.queryParams.pageNo = 0;
    }

    $scope.queryParams.orderType = $scope.options.activeTab;

    OrderService.getAppOrderList({
      pageNo: $scope.queryParams.pageNo,
      pageSize: $scope.queryParams.pageSize,
      orderType: $scope.queryParams.orderType,
      orderNo: $scope.queryParams.orderNo,
      brandName: $scope.queryParams.brandName,
      begDate: $scope.queryParams.begDate,
      endDate: $scope.queryParams.endDate
    }).then((result) => {


      if ($scope.options.activeTab == 1) {
        $scope.spotOrderList = forPage ? $scope.spotOrderList.concat(result) : angular.copy(result);
        $scope.orderingOrderList=null;
      } else if ($scope.options.activeTab == 2) {
        $scope.orderingOrderList = forPage ? $scope.orderingOrderList.concat(result) : angular.copy(result);
        $scope.spotOrderList=null;
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
    if($scope.options.activeTab==2){//解决定货下单进入此页面查询两次问题
      $ionicSlideBoxDelegate.$getByHandle('orderSlide').slide($scope.options.activeTab - 1);
    }else{
      loadData();

    }
  });

  /**
   * 订单详情页
   * @param orderId
   */
  $scope.showDetail = function (orderId) {
    $state.go('order-detail', {orderId: orderId, orderType: $scope.options.activeTab});
  }

  /**
   * 拒绝订单
   */
  $scope.refuseOrder = function (orderId) {
    $ionicPopup.confirm({
      title: '拒绝报价',
      template: '<div class="text-center font-size-14">拒绝报价后将关闭交易！</div>',
      okText: '确认',
      cancelText: '取消'
    }).then(function (flag) {
      if (flag) {
        OrderService.cancelOrder({orderId: orderId}).then(() => {
          Toast.show("已拒绝报价！");
          loadData();
        })
      }

    });

  }

  /**
   * 确认订单
   */
  $scope.confirmOrder = function (orderId) {
    $ionicPopup.confirm({
      title: '接受报价',
      template: '<div class="text-center font-size-14">接受报价后将达成交易！</div>',
      okText: '确认',
      cancelText: '取消'
    }).then(function (flag) {
      if (flag) {
        OrderService.confirmOrder({orderId: orderId}).then(() => {
          Toast.show("已接受报价！");
          loadData();
        })
      }

    });

  }

  /**
   * 撤销订单
   */
  $scope.cancelOrder = function (orderId) {
    $ionicPopup.confirm({
      title: '撤销订单',
      template: '<div class="text-center font-size-14">撤消订单后将关闭交易！</div>',
      okText: '确认',
      cancelText: '取消'
    }).then(function (flag) {
      if (flag) {
        OrderService.cancelUnauditedOrder({orderId: orderId}).then(() => {
          Toast.show("已撤销订单！");
          loadData();
        })
      }
    });
  }


  // 订单筛选条件 modal
  $ionicModal.fromTemplateUrl('order-search-modal.html', {
    scope: $scope
  }).then((modal) => {

    $scope.pickDate1 = function () {
      var tempTime = 0;
      ionicDatePicker.openDatePicker({
        // inputDate: new Date(today.replace(/-/g, '/')),
        callback: function (date) {
          tempTime = date;
          $scope.queryParams.begDate = $filter('date')(new Date(tempTime), 'yyyy-MM-dd');
        }
      })
    };

    $scope.pickDate2 = function () {
      var tempTime = 0;
      ionicDatePicker.openDatePicker({
        // inputDate: new Date(today.replace(/-/g, '/')),
        callback: function (date) {
          tempTime = date;
          $scope.queryParams.endDate = $filter('date')(new Date(tempTime), 'yyyy-MM-dd');
        }
      })
    };

    $scope.cleanFiltrateModal = function () {
      $scope.queryParams.orderNo = '';
      $scope.queryParams.brandName = '';
      $scope.queryParams.begDate = '';
      $scope.queryParams.endDate = '';
    }
    $scope.submitFiltrateModal = function () {
      loadData();
      $scope.closeOrderSearchModal();
      $scope.cleanFiltrateModal();
    }
    $scope.orderSearchModal = modal;
  });

  $scope.openOrderSearchModal = function () {
    $scope.orderSearchModal.show();
  };
  $scope.closeOrderSearchModal = function () {
    $scope.orderSearchModal.hide();
  };


  $scope.$on('modal.shown', function () {
    $ionicBackdrop.retain();
  });
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.orderSearchModal.remove();
    $ionicBackdrop.release();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    $ionicBackdrop.release();
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    $ionicBackdrop.release();
  });


  $scope.myOrderBack = function () {
    // $ionicHistory.goBack();
    $state.go('tab.mine');
  }


});
