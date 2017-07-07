djEShopControllers.controller('MyMessageCtrl', function ($scope, $state, $ionicNativeTransitions, PrivilegeService,
                                                         LoginInfoUtil, SimpleLocalStorage, Toast, $ionicScrollDelegate, MineService, PAGE_SIZE, $ionicPopup, $ionicSlideBoxDelegate) {

  /**
   * init options
   */
  $scope.tabs = [
    {
      tabName: '未读消息',
      tabIndex: 0,
      isRead: false,
      pageNo: 0
    },
    {
      tabName: '已读消息',
      tabIndex: 1,
      isRead: true,
      pageNo: 0
    },
  ];
  $scope.curTab = $scope.tabs[0];

  // 默认没有更多, 在每次 loadData会重设这个值
  $scope.options = {moreData: false};

  /**
   * load Data
   */
  var loadData = function (forPage) {
    if (forPage) {
      $scope.curTab.pageNo++;
    } else {
      $scope.curTab.pageNo = 0;
    }
    MineService.queryMsg($scope.curTab.isRead, $scope.curTab.pageNo, PAGE_SIZE).then(function (result) {
      // 判断是分页还是 刷新,亦或是第一次load, set data to list.
      $scope.msgList = forPage ? $scope.msgList.concat(result) : angular.copy(result);
      // $scope.tabs[$scope.curTab.tabIndex].list = (forPage && result ) ? result.concat($scope.msgList) : angular.copy(result);

      // 分析或者 处理数据, 内容太多 考虑封装函数
      angular.forEach($scope.msgList, function (data) {
        if(data.sendTime){
          data.sendTimeStr = data.sendTime.substring(0, data.sendTime.lastIndexOf(':'));
        }
      });

      // 重写 是否loadmore 标识
      $scope.options.moreData = (result && result.length == PAGE_SIZE);

    }).finally(function () {
      if(forPage){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };
  loadData();

  // 下拉刷新
  $scope.doRefresh = function () {
    loadData();
  };
  // 加载更多
  $scope.doLoad = function () {
    loadData(true);
  };

  /**
   * 切换 tab
   */
  $scope.switchTab = function (item) {
    $scope.curTab = item;
    if (item.list) {
      $scope.options.moreData = true;  // 加载更多标识重置
    } else {
      loadData();
    }

    $ionicScrollDelegate.scrollTop();   // 回到顶部
    // $ionicSlideBoxDelegate.$getByHandle('vieSlide').slide(index);
  };

  /**
   * 删除消息
   */
  $scope.delMsg = function (msg, index) {
    if (!msg) {
      $ionicPopup.confirm({
        title: '请确认',
        template: '确定要清空所有的消息?',
        okText: '确定',
        cancelText: '取消'
      }).then(function (re) {
        if (re) {
          doDeleteMsg('all', index);
        }
      });
    } else {
      doDeleteMsg(msg.msgId, index);
    }
  };
  var doDeleteMsg = function (msgId, index) {
    MineService.deleteMsg(msgId).then(function (result) {
      if(index || index ===0){
        $scope.msgList.splice(index, 1);
      }else{
        $scope.msgList = [];
        angular.forEach($scope.tabs, function (data) {
          data.list = [];
        })
      }
    });
  }


  /**
   * 已读消息
   */
  $scope.markMsg = function (msg,index) {
    MineService.markMsg(msg.msgId).then(function (result) {
      $scope.msgList.splice(index, 1);
    });
  };
});
