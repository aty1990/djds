/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('ResCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, ResService, Toast, $q, $ionicHistory, $ionicSideMenuDelegate, LoginInfoUtil,PAGE_SIZE) {

    $ionicSideMenuDelegate.toggleLeft();

    $scope.data = {hiddenFooter: true};
    $scope.queryParam = angular.copy($stateParams.query);
    $scope.brandNameFooter = $scope.queryParam.brandName;
    $scope.brandIdFooter = $scope.queryParam.brandId;
    $scope.queryParam.pageSize = PAGE_SIZE;
    $scope.searchPanelData = {
        placesteelAllFlag : true,
        textureAllFlag : true
    };
    $scope.sortList = [
        {"sortId": -1, "sortName": "综合排序"},
        {"sortId": 1, "sortName": "价格从高到低"},
        {"sortId": 2, "sortName": "价格从低到高"},
        {"sortId": 3, "sortName": "规格从大到小"},
        {"sortId": 4, "sortName": "规格从小到大"}
    ];

    $scope.sortIdFooter = -1;
    $scope.sortNameFooter = "综合排序";
    $scope.queryParam.sortCode = -1;

    // 如果是首页搜索功能则缓存查询到的数据
    if($scope.brandNameFooter && !$scope.brandIdFooter){
        ResService.getResList({keyword:$scope.brandNameFooter}).then(function(result){
            $scope.searchData = result;
        })
    }
    // 如果搜索关键字为空则删除首页传递的参数，执行默认逻辑
    if(!$scope.queryParam.keyword){
       delete $scope.queryParam.keyword;
       delete $scope.queryParam.from;
    }
    /**
    *获取城市和品名
    */
    var getQuoCityAndBrand = function () {
        ResService.getQuoCityAndBrand().then(function (result) {
            $scope.cityList = result.cityList;
            $scope.varietyBrandList = result.varietyBrandList;

            // console.log(result);
            let varietyList = [];
                result.varietyBrandList.forEach(function (item) {
                let variety = {};
                variety.varietyId = item.varietyId;
                variety.varietyName = item.varietyName;
                varietyList.push(variety);
                // 如果不是来自首页搜索
                if(!$scope.queryParam.from){
                    if(!$scope.queryParam.recommand){
                        item.brandList.forEach(function (brand) {
                          if ($stateParams.query.surplusFlag == 1) {//如果是余材的，则默认给个属于余材的品名
                            if (brand.surplusFlag == 1) {
                              $scope.queryParam.brandId = brand.brandId;
                              $scope.brandIdFooter = brand.brandId;
                              $scope.brandNameFooter = brand.brandName;
                              $scope.brandList = item.brandList;
                              $scope.varietySelected = item.varietyId;
                              return;
                            }
                            // 判断是否为首页的搜索
                          }else if($scope.brandNameFooter && !$scope.brandIdFooter){
                                var result = $scope.searchData;
                                if(result.length>0){
                                   $scope.queryParam.brandId = result[0].brandId;
                                    $scope.brandIdFooter = result[0].brandId;
                                    $scope.brandNameFooter = result[0].brandName;
                                    return;
                                }
                          }else if ($scope.queryParam.brandId==null||$scope.queryParam.brandId==''||brand.brandId == $scope.queryParam.brandId) {
                            // $scope.brandFooter = brand.brandName;
                            $scope.varietySelected = item.varietyId;

                            $scope.brandList = item.brandList;
                            $scope.brandNameFooter = brand.brandName;
                            $scope.queryParam.brandName=brand.brandName;
                            $scope.queryParam.brandId=brand.brandId;
                            $scope.brandIdFooter=brand.brandId;
                            return;
                          }
                        });
                    }else{
                        $scope.brandNameFooter = "全部";
                    }
                }
            });

            // 如果是首页搜索就不执行此处代码
            if($scope.queryParam.from!=="home" && !$scope.queryParam.recommand){
                getSearchPanel({brandId: $scope.brandIdFooter});
            }
            $scope.varietyList = varietyList;

        });
    }

  /**
   * 初始化城市和品名列表
   */
  getQuoCityAndBrand();


  /**
   * 品名根据品类变更
   */
  $scope.changeBrandList = function (varietyId) {
    $scope.varietySelected = varietyId;
    $scope.varietyBrandList.forEach(function (item) {
      if (item.varietyId == varietyId) {
        $scope.brandList = item.brandList;
      }
    });

  };

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
    loadData();
  };
  $scope.search = function () {
    $scope.data.hiddenFooter = false;
    loadData();
  };
  $scope.goBack = function () {
    $ionicHistory.goBack();
  };

  function loadData(forPage) {

    // 维护分页属性
    if (forPage) {
      $scope.queryParam.pageNo++;
    } else {
      $scope.queryParam.pageNo = 0;
    }
    if ($scope.cityIdFooter == null) {
      $scope.cityNameFooter = "全国";
    }

    ResService.loadRes($scope.queryParam).then((result) => {
      // 设置是否有更多数据标识
      $scope.moreData = (result && result.length > 0);
      $scope.resList = forPage ? $scope.resList.concat(result) : angular.copy(result);

    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

  /**
   * 查询购物车数量
   */
  var shocartNum=function () {
    ResService.shocartNum().then((result) => {
      $scope.shopcartNum=result;
    })
  }

  /**
   * init load data
   */
  $scope.$on('$ionicView.enter', function () {
        shocartNum();
        loadData();
  });


  // 品名筛选 modal
  $ionicModal.fromTemplateUrl('brand-search-modal.html', {
    scope: $scope
  }).then((modal) => {
    $scope.brandModal = modal;
  });

  $scope.openBrandModal = function () {
    $scope.brandModal.show();
  };
  $scope.closeBrandModal = function () {
    $scope.brandModal.hide();
  };

  //选中品名触发事件，刷新资源列表
  $scope.chooseBrand = function (brand) {
    if($scope.queryParam.keyword) delete  $scope.queryParam.keyword;
    if($scope.queryParam.recommand) delete  $scope.queryParam.recommand;
    if($scope.queryParam.listingId) delete  $scope.queryParam.listingId;
    loadData();
    $scope.brandNameFooter = brand.brandName;
    $scope.brandIdFooter = brand.brandId;
    getSearchPanel({brandId: $scope.brandIdFooter, city: $scope.cityIdFooter});
    $scope.brandModal.hide();
  };

  //选中品类
  $scope.clickVariety = function (type) {
    if ($scope.type != type) {
      $scope.type = type;
    }
  };

  // 城市筛选 modal
  $ionicModal.fromTemplateUrl('city-search-modal.html', {
    scope: $scope
  }).then((modal) => {
    $scope.cityModal = modal;
  });

  $scope.openCityModal = function () {
    $scope.cityModal.show();
  };
  $scope.closeCityModal = function () {
    $scope.cityModal.hide();
  };

  //选中城市触发事件
  $scope.chooseCity = function (city) {
    if (city == null) {
      $scope.cityNameFooter = '全国';
      $scope.cityIdFooter = null;
    } else {
      $scope.cityNameFooter = city.cityName;
      $scope.cityIdFooter = city.cityId;
    }
    if(!$scope.brandIdFooter){
        Toast.show('请选择品名');return;
    }
    loadData();
    getSearchPanel({brandId: $scope.brandIdFooter, city: $scope.cityIdFooter});
    $scope.cityModal.hide();
  };

  // 综合排序 modal
  $ionicModal.fromTemplateUrl('sort-modal.html', {
    scope: $scope
  }).then((modal) => {
    $scope.sortModal = modal;
  });

  $scope.openSortModal = function () {
    $scope.sortModal.show();
  };

  //综合排序触发事件
  $scope.chooseSort = function (sort) {
    $scope.sortIdFooter = sort.sortId;
    $scope.sortNameFooter = sort.sortName;
    $scope.queryParam.sortCode = sort.sortId;
    loadData();
    $scope.sortModal.hide();
  };

  /**
   * 以下是筛选modal
   */
  $scope.searchPanel = {};    // 筛选弹窗用于提交查询的参数对象

  // 初始化modal
  $ionicModal.fromTemplateUrl('templates/modules/res/modal-filtrate.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.filtrateModal = modal;
  });
  // 打开筛选modal
  $scope.openFiltrateModal = function () {

    $scope.filtrateModal.show();
  };
  // 清空
  $scope.cleanFiltrateModal = function () {
    $scope.searchPanelData.placesteelAllFlag = true;
    $scope.searchPanelData.textureAllFlag = true;
    setListCheckedIsFalse($scope.searchPanelData.placesteelList);
    setListCheckedIsFalse($scope.searchPanelData.allTextureList);
    $scope.searchPanel = {};
  };
  // 完成
  $scope.submitFiltrateModal = function () {

    // 规格允许正整数和 两位以内的小数， 正则
    var reg = /^\d+(\.\d{1,2})?$/;
    // 需要验证的规格属性名
    var specArr = ['diaMin', 'diaMax', 'odMin', 'odMax', 'wallthickMin', 'wallthickMax', 'thicknessMin', 'thicknessMax', 'widthMin', 'widthMax', 'lengthMin', 'lengthMax', 'heightMin', 'heightMax'];
    for (var i = 0; i < specArr.length; i++) {
      var name = specArr[i];
      if ($scope.searchPanel[name] && !reg.test($scope.searchPanel[name])) {
        Toast.show('规格格式错误');
        return false;
      }
    }

    if ($scope.searchPanelData.placesteelAllFlag == false) {
      var placesteelIdList = [];
      for (var i = 0; i < $scope.searchPanelData.placesteelList.length; i++) {
        if ($scope.searchPanelData.placesteelList[i].checked == true) {
          placesteelIdList[placesteelIdList.length] = $scope.searchPanelData.placesteelList[i].placesteelId;
        }
      }
      $scope.searchPanel.placesteelIdList = placesteelIdList;
    } else {
      $scope.searchPanel.placesteelIdList = null;
    }
    if ($scope.searchPanelData.textureAllFlag == false) {
      var textureIdList = [];
      for (var i = 0; i < $scope.searchPanelData.allTextureList.length; i++) {
        if ($scope.searchPanelData.allTextureList[i].checked == true) {
          textureIdList[textureIdList.length] = $scope.searchPanelData.allTextureList[i].textureId;
        }
      }
      $scope.searchPanel.textureIdList = textureIdList;
    } else {
      $scope.searchPanel.textureIdList = null;
    }
    $scope.searchPanel.brandId = $scope.brandIdFooter;
    $scope.searchPanel.city = $scope.cityIdFooter;
    $scope.searchPanel.pageSize = $scope.queryParam.pageSize;
    $scope.queryParam = $scope.searchPanel;
    loadData();
    $scope.filtrateModal.hide();
  };

  $scope.$on('modal.shown', function () {
    $ionicBackdrop.retain();
  });
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.filtrateModal.remove();
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

  // 获取 筛选modal的数据，这个需要随时更新
  var getSearchPanel = function (param) {
    ResService.getSearchPanel(param).then(function (result) {
      $scope.searchPanelData = result;
      $scope.searchPanelData.placesteelAllFlag = true;
      $scope.searchPanelData.textureAllFlag = true;

      // 大于等于12个的话 需要收起， 不知道为什么在 页面上ng-init有问题，故挪到这里...
      $scope.searchPanelData.placesteelShrink = $scope.searchPanelData.placesteelList.length >= 12;
      $scope.searchPanelData.textureShrink = $scope.searchPanelData.allTextureList.length >= 12;
      // 伪造测试数据
      //$scope.searchPanelData.placesteelList = $scope.searchPanelData.placesteelList.concat([{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'},{placesteelName:'12'}])
      //$scope.searchPanelData.allTextureList = $scope.searchPanelData.allTextureList.concat([{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'},{textureName:'12'}])
    });
  };



  // util fn: 设置list下每个item的 checked属性为false
  var setListCheckedIsFalse = function (list) {
    for (var i = 0;  list && i < list.length; i++) {
      list[i].checked = false;
    }
  };

  $scope.filtratePlacesteelClick = function (isAll, item) {
    if (isAll) {
      $scope.searchPanelData.placesteelAllFlag = !$scope.searchPanelData.placesteelAllFlag;
      setListCheckedIsFalse($scope.searchPanelData.placesteelList);
    } else {
      item.checked = !item.checked;
      $scope.searchPanelData.placesteelAllFlag = false;
    }
  };
  $scope.filtrateTextureClick = function (isAll, item) {
    if (isAll) {
      $scope.searchPanelData.textureAllFlag = !$scope.searchPanelData.textureAllFlag;
      setListCheckedIsFalse($scope.searchPanelData.allTextureList);
    } else {
      item.checked = !item.checked;
      $scope.searchPanelData.textureAllFlag = false;
    }
  };
  // 筛选modal code END...


  // 点击资源列表弹框 modal
  $ionicModal.fromTemplateUrl('my-concern-modal.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.concernModal = modal;
  });

  $scope.showConcernModal = function (item) {
    $scope.concernInfo = item;
    $scope.concernModal.show();
  };

  //关注取消关注
  $scope.doConcern = function (item) {
    if (item.concernStatus == 1) {
      ResService.cancelConcern({inventoryId: item.inventoryId}).then(function (result) {
        loadData();
        Toast.show("取消关注成功！");
      });
    } else {
      ResService.addCollection({inventoryId: item.inventoryId}).then(function (result) {
        loadData();
        Toast.show("关注成功！");
      });
    }
    $scope.concernModal.hide();
  };

  /**
   * 保存或取消购物车
   * @param item
   */
  $scope.doToShopcart=function (item) {
    if(item.shopcartId==null||item.shopcartId<1){
      ResService.saveToShopcart({inventoryId:item.inventoryId,buyWeight:item.listingWeight}).then(function (result) {
        // Toast.show('添加购物车成功');
        $scope.concernModal.hide();
        loadData();
        $scope.shopcartNum+=1;
      })
    }else{
      ResService.deleteShopcartById({shopcartId:item.shopcartId}).then(function (result) {
        // Toast.show('取消购物车成功');
        $scope.concernModal.hide();
        loadData();
        $scope.shopcartNum-=1;
      })
    }
  }

  if (LoginInfoUtil.isExpired()) {//尚未登录
    $scope.loginFlag = false;
  } else {
    $scope.loginFlag = true;
  }
});
