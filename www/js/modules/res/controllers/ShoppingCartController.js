/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('ShoppingCartCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, ResService, Toast, $q, $ionicHistory, $ionicPopup, ValidateUtil, $ionicScrollDelegate) {


  // $scope.shopcartList = [{
  //   groupIndex: 1,
  //   mbrName: '江苏钢小二电子商务有限公司1',
  //   detailLength:4,
  //   detailCheckedLength:0,
  //   shopCartGroupPOList: [{
  //     shopCartPO2List: [{
  //       id: 1,
  //       brandName: '普碳钢',
  //       textureName: '东方特钢',
  //       specName: 'Q235',
  //       warehouseName: '东方进武库',
  //       warehouseCityName: '常州市',
  //       listingPrice: 100
  //     }, {
  //       id: 2,
  //       brandName: '普碳钢',
  //       textureName: '东方特钢',
  //       specName: 'Q235',
  //       warehouseName: '东方进武库',
  //       warehouseCityName: '常州市',
  //       listingPrice: 100
  //     }]
  //   },
  //     {
  //       shopCartPO2List: [{
  //         id: 3,
  //         brandName: '普碳钢',
  //         textureName: '东方特钢',
  //         specName: 'Q235',
  //         warehouseName: '东方进武库',
  //         warehouseCityName: '常州市',
  //         listingPrice: 300
  //       }, {
  //         id: 4,
  //         brandName: '普碳钢',
  //         textureName: '东方特钢',
  //         specName: 'Q235',
  //         warehouseName: '东方进武库',
  //         warehouseCityName: '常州市',
  //         listingPrice: 400
  //       }]
  //     }]
  // },
  // {
  //   groupIndex: 2,
  //   mbrName: '江苏钢小二电子商务有限公司2',
  //   detailLength:2,
  //   detailCheckedLength:0,
  //   shopCartGroupPOList: [{
  //     shopCartPO2List: [{
  //       id: 1,
  //       brandName: '普碳钢',
  //       textureName: '东方特钢',
  //       specName: 'Q235',
  //       warehouseName: '东方进武库',
  //       warehouseCityName: '常州市',
  //       listingPrice: 100
  //     }, {
  //       id: 2,
  //       brandName: '普碳钢',
  //       textureName: '东方特钢',
  //       specName: 'Q235',
  //       warehouseName: '东方进武库',
  //       warehouseCityName: '常州市',
  //       listingPrice: 100
  //     }]
  //   }]
  // }
  //
  // ];

  /**
   * 查询购物车数量
   */
  var shocartNum = function () {
    ResService.shocartNum().then((result) => {
      $scope.shopcartNum = result;
    })
  }

  shocartNum();


  /**
   * 清空购物车
   */
  $scope.cleanShopcart = function () {
    $ionicPopup.confirm({
      title: '清空购物车',
      template: '<div class="text-center font-size-14">请确认是否清空！</div>',
      okText: '确认',
      cancelText: '取消'
    }).then(function (flag) {
      if (flag) {
        ResService.cleanShopcart().then(function () {
          $scope.shopcartNum = 0;
          $scope.shopcartList = [];
          Toast.show("清空购物车成功");
        });
      }
    });
  }

  /**
   * 单条删除购物车资源
   * @param item
   */
  $scope.deleteShopcartById = function (shopcart,group, item, index) {
    // $ionicPopup.confirm({
    //   title: '删除资源',
    //   template: '<div class="text-center font-size-14">请确认是否删除！</div>',
    //   okText: '确认',
    //   cancelText: '取消'
    // }).then(function (flag) {
    //   if(flag){
    ResService.deleteShopcartById({shopcartId: item.shopcartId}).then(function () {
      // loadData();
      group.splice(index, 1);
      $ionicScrollDelegate.resize();
      Toast.show("删除成功");
      $scope.shopcartNum--;
      if(item.checked){
        $scope.caculateTotal(shopcart);
      }
    });
    //   }
    // });
  }


  /**
   * 跳转到填写现货订单页面
   */
  $scope.toSportOrder = function () {

    var shopcartIdStr = '', errorNum = 1, errorCode = 0, warehourse = new Map();

    //验证
    for (var i = 0; i < $scope.shopcartList.length; i++) {
      for (var j = 0; j < $scope.shopcartList[i].shopCartGroupPOList.length; j++) {
        var group = $scope.shopcartList[i].shopCartGroupPOList[j];
        for (var k = 0; k < group.shopCartPO2List.length; k++) {
          var detail = group.shopCartPO2List[k];
          if (detail.checked) {
            warehourse.set(detail.warehouseId, detail.warehouseName);
            if (shopcartIdStr == '') {
              shopcartIdStr = detail.shopcartId;
            } else {
              shopcartIdStr = shopcartIdStr + "," + detail.shopcartId;
            }
            if (detail.weight == null || detail.weight == '' || detail.weight == 0) {
              Toast.show('选中的第' + errorNum + '条资源重量不能为空，且必须大于0！');
              return false;
            }
            if (detail.weight <= detail.listingWeight) {
              errorNum++;
            } else {
              errorCode = 2;
              detail.weight = detail.listingWeight;
              $scope.caculateTotal( $scope.shopcartList[i]);
              Toast.show('选中的第' + errorNum + '条资源重量不能大于挂牌重量:' + detail.listingWeight + '吨！');
              return false;
            }
          }
        }
      }
    }

    if (shopcartIdStr == '') {
      Toast.show('请至少选择一条购物车信息！');
      return;
    }
    if (warehourse.size > 2) {
      Toast.show('最多只能选择两个仓库下的资源进行下单，请重新选择！');
      return;
    }


    $state.go('to-spot-order', {shopcartIdStr: shopcartIdStr});
  };

  var latestShopcart = null;//用户记录上次的选中记录

  /**
   *取消上次的选中记录
   */
  var uncheckedLatestItem = function () {
    $scope.shopcartList.forEach(function (shopcart) {
      if (latestShopcart.groupIndex == shopcart.groupIndex) {
        shopcart.checked = false;
        shopcart.detailCheckedLength = 0;
        shopcart.shopCartGroupPOList.forEach(function (group) {
          group.shopCartPO2List.forEach(function (detail) {
            detail.checked = false;
          });
        })
        return false;
      }
    });
  }

  /**
   * 选择资源挂牌公司
   * @param item
   */
  $scope.selectAll = function (item) {
    if (item.checked && latestShopcart != null && latestShopcart.groupIndex != item.groupIndex) {//取消上次的选中记录
      uncheckedLatestItem();
    }
    $scope.shopcartList.forEach(function (shopcart) {//更新当前明细信息的选中状态
      if (item.groupIndex == shopcart.groupIndex) {
        shopcart.shopCartGroupPOList.forEach(function (group) {
          group.shopCartPO2List.forEach(function (detail) {
            detail.checked = item.checked;
          });
        })
      }
    });
    item.detailCheckedLength = item.checked ? item.detailLength : 0;//统计当前选中条数，主信息取消选中则置为0
    latestShopcart = item.checked ? item : null;//记录当前的信息，以便下次选中其他主信息时方便只取消上一次的记录
    $scope.caculateTotal(item);//统计重量金额

  }


  /**
   * 选择明细
   * @param item
   * @param detail
   */
  $scope.selectSingle = function (item, detail) {
    if (detail.checked && latestShopcart != null && latestShopcart.groupIndex != item.groupIndex) {//取消上次的选中记录
      uncheckedLatestItem();
    }
    if (!detail.checked) {
      item.checked = false;//明细取消选中则主信息也置为未选中
      item.detailCheckedLength--;
    } else {
      item.detailCheckedLength++;
    }
    item.checked = item.detailCheckedLength == item.detailLength;
    latestShopcart = item;//记录当前的信息，以便下次选中其他主信息时方便只取消上一次的记录
    $scope.caculateTotal(item);//统计重量金额
  };

  $scope.goBack = function () {
    $ionicHistory.goBack();
  };

  /**
   * 加载数据
   */
  function loadData() {
    $scope.totalWeight = 0;//总重量
    $scope.totalMoney = 0;//总金额
    ResService.getShopcartList($scope.queryParam).then((result) => {
      // 设置是否有更多数据标识
      $scope.shopcartList = result;
      $scope.shopcartList.forEach(function (shopcart) {
        var detailLength = 0;
        shopcart.shopCartGroupPOList.forEach(function (group) {
          detailLength += group.shopCartPO2List.length;
          group.shopCartPO2List.forEach(function (detail) {
            detail.weight = detail.buyWeight;
          });
        })
        shopcart.detailLength = detailLength;
        shopcart.detailCheckedLength = 0;
      });
    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

  /**
   * 下拉刷新
   */
  $scope.doRefresh = function () {
    loadData();
  }

  /**
   * 统计选中重量金额
   * @param item
   */
  $scope.caculateTotal = function (shopcart) {
    var totalWeight = 0;
    var totalMoney = 0;
    shopcart.shopCartGroupPOList.forEach(function (group) {
      group.shopCartPO2List.forEach(function (detail) {
        if (detail.checked) {
          totalWeight += Number(detail.weight);
          totalMoney += (Number(detail.listingPriceFormat) * Number(detail.weight));
        }
      });
    })
    $scope.totalWeight = totalWeight;
    $scope.totalMoney = totalMoney;
  };

  /**
   * 加载数据
   */
  loadData();


  /**
   * 输入重量失去焦点时更新购物车信息
   */
  $scope.saveShopcart = function (shopcart,detail) {
    if (!ValidateUtil.validateForm(detail.weight, "当前输入重量不能为空，且必须大于0！")) return;
    if (detail.weight <= detail.listingWeight) {
      ResService.updateShopcartWeight({
        shopcartId: detail.shopcartId,
        weight: detail.weight
      }).then((result) => {
        console.log("更新购物车成功!");
      });

    } else {
      Toast.show("当前输入重量不能大于挂牌重量:" + detail.listingWeight + "吨");
      detail.weight = detail.listingWeight;
      $scope.caculateTotal(shopcart);
    }
  }
});
