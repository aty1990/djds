djEShopControllers.controller('MineCtrl', function ($scope, $state, $ionicNativeTransitions, PrivilegeService,
                                                    LoginInfoUtil, SimpleLocalStorage, Toast,MineService ) {

  $scope.personInfo = {};
  $scope.mbrList = [];
  $scope.defaultMbr = {};


  PrivilegeService.getUserInfo().then(function (userInfo) {
    $scope.personInfo = userInfo.person;
    $scope.mbrList = userInfo.mbrList;
    $scope.headImage = SimpleLocalStorage.get('headImage-' + $scope.personInfo.userId);

    $scope.isLogin = !LoginInfoUtil.isExpired();

    for (var i = 0; i < userInfo.mbrList.length; i++) {
      if (userInfo.mbrList[i].deMbr === 2) {
        $scope.defaultMbr = userInfo.mbrList[i];
        break;
      }
    }
  });

  $scope.toMyEnjoy = function () {

    if(LoginInfoUtil.isExpired()){
      $ionicNativeTransitions.stateGo('login');
    }else{
      if ($scope.mbrList.length === 0) {
        Toast.show('暂无认证企业,无法进入"我的尊享"');
      } else {
        $ionicNativeTransitions.stateGo('myEnjoy');
      }
    }
  }

  $scope.toMyOrder=function () {
    $state.go("my-order",{orderType:1});
  }

  $scope.toMyContract=function () {
    $state.go("my-contract");
  }

  if (LoginInfoUtil.hasToken()) {
    /**
     * 处理中订单
     * @param type
     */
    MineService.getUnFinishOrderCount().then(function (result) {
      $scope.orderNum=result;
    });

    /**
     * 未读消息
     * @param type
     */
    MineService.getMsgCount().then(function (result) {
      $scope.msgNum=result;
    });
  }else{
    $scope.orderNum=0;
    $scope.msgNum=0;
  }



});
