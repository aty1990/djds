djEShopControllers.controller('HomeCtrl', function ($scope, $state, $ionicSlideBoxDelegate, PrivilegeService,
                                                    homeService, Toast, $ionicNativeTransitions, SimpleLocalStorage, LoginInfoUtil) {

  $scope.searchKey = "";                                  // 搜索关键字

  // 获取 首页各种数据
  var getHomeData = function (){
    homeService.getHomeData().then(function (result) {
      $scope.bannerList = result.advList;                 // banner
      $scope.factoryRecommend = result.factoryRecommend;  // 推荐钢厂
      $scope.firstBrands = result.firstBrands;            // 圆钢
      $scope.secondBrands = result.secondBrands;          // 工业线材
      $scope.specialRecommend = result.specialRecommend;  // 通知公告

      $ionicSlideBoxDelegate.$getByHandle('homeSlide').update();
      $ionicSlideBoxDelegate.$getByHandle('homeSlide').loop(true);
    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  getHomeData();

  // 绑定优质资源数据
  var getRecommends = function (){
    homeService.getRecommends().then(function (result) {
      //$scope.recList = result.slice(0, 5);
      $scope.recList = result;
    });
  };
  getRecommends();

  // 绑定小二数据
  var getXiaoerData = function (){
    homeService.getXiaoerData().then(function (result) {
      $scope.todaySpotWeight = result.todaySpotWeight;
      $scope.yesterdaySpotWeight = result.yesterdaySpotWeight;
    });
  };
  getXiaoerData();

  // 我的订单
  $scope.toMyOrder = function () {
    $state.go("my-order", {orderType: 1});
  };

  // 我的尊享 需判断企业认证
  $scope.toMyEnjoy = function () {
    // 登录过期
    if (LoginInfoUtil.isExpired()) {
      $ionicNativeTransitions.stateGo('login');
    } else {
      // 获取用户信息
      PrivilegeService.getUserInfo().then(function (userInfo) {
        if (userInfo.mbrList.length === 0) {
          Toast.show('暂无认证企业,无法进入"我的尊享"');
        } else {
          $ionicNativeTransitions.stateGo('myEnjoy');
        }
      });
    }
  };

  // 清除搜索内容
  $scope.clearSearch = function () {
    $scope.searchKey = "";
  };
  // 搜索
  $scope.searchFn = function () {
    $ionicNativeTransitions.stateGo('res-list', {query: {"keyword": $scope.searchKey, "from": "home"}});
  };
  // 优质资源链接跳转
  $scope.toResList = function (brand) {
    $ionicNativeTransitions.stateGo("res-list", {
      query: {
        brandId: brand.brandId,
        brandName: brand.brandName,
        listingId: brand.listingId
      }
    });
  };

  // 刷新优质资源数据
  $scope.doRefresh = function () {
    getHomeData();
    getXiaoerData();
    getRecommends();
    /*.finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
    });*/
  };

  // 跳转到 现货筛选页面
  $scope.toCategory = function (type) {
    var param = {
      type: type,
      firstBrands: $scope.firstBrands,
      secondBrands: $scope.secondBrands
    };
    $ionicNativeTransitions.stateGo('home-category', {param: param});
  };

  //余材跳转到资源列表页面
  $scope.clickSurplus = function () {
    $ionicNativeTransitions.stateGo("res-list", {query: {surplusFlag: 1}});
  };

  $scope.addGoods = function () {
    $state.go("add-goods");
    SimpleLocalStorage.rm('orderingStep1Data');
  };
  // 资讯
  $scope.clickInfo = function () {
    $ionicNativeTransitions.stateGo("info", {});
  };

});
