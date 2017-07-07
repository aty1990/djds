/**
 * Created by sjin on 17/4/11.
 */
djEShopControllers.controller('SettingAccustomCtrl', function ($scope, $ionicModal, $ionicBackdrop, MineService, PAGE_SIZE, Toast, $ionicScrollDelegate) {

  var cityModal = null, brandModal = null, placeSteelModal = null;

  // 缓存当前选中的 品类
  $scope.varietySelected = null;

  // 缓存当前的偏好设置对象
  var curPref = null;

  // 获取 偏好设置
  MineService.getPref().then(function (result) {
    curPref = result;
    initShowList(result);
  });

  // 根据 已设置的 偏好设置, 初始化展示列表
  var initShowList = function (data) {
    if (!data) {
      $scope.curCityList = [{name: '无'}];
      $scope.curBrandList = [{name: '无'}];
      $scope.curPlacesteelList = [{name: '无'}];
    } else {
      if (data.cityOne) {
        $scope.curCityList = [];
        $scope.curCityList.push({id: data.cityOne, name: data.cityOneName});
        if (data.cityTwo) {
          $scope.curCityList.push({id: data.cityTwo, name: data.cityTwoName});
        }
        if (data.cityThree) {
          $scope.curCityList.push({id: data.cityThree, name: data.cityThreeName});
        }
      } else {
        $scope.curCityList = [{name: '无'}];
      }

      if (data.placesteelOne) {
        $scope.curPlacesteelList = [];
        $scope.curPlacesteelList.push({id: data.placesteelOne, name: data.placesteelOneName});
        if (data.placesteelTwo) {
          $scope.curPlacesteelList.push({id: data.placesteelTwo, name: data.placesteelTwoName});
        }
        if (data.placesteelThree) {
          $scope.curPlacesteelList.push({id: data.placesteelThree, name: data.placesteelThreeName});
        }
      } else {
        $scope.curPlacesteelList = [{name: '无'}];
      }

      if (data.brandOne) {
        $scope.curBrandList = [];
        $scope.curBrandList.push({id: data.brandOne, name: data.brandOneName});
        if (data.brandTwo) {
          $scope.curBrandList.push({id: data.brandTwo, name: data.brandTwoName});
        }
        if (data.brandThree) {
          $scope.curBrandList.push({id: data.brandThree, name: data.brandThreeName});
        }
      } else {
        $scope.curBrandList = [{name: '无'}];
      }
    }
  };

  // 刷新 各设置弹窗中的 选中效果
  var refreshListChecked = function (type) {
    if (type == 1) {
      angular.forEach($scope.cityList, function (item) {
        if (curPref && (curPref.cityOne == item.city || curPref.cityTwo == item.city || curPref.cityThree == item.city)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    } else if (type == 2) {
      angular.forEach($scope.placeSteelList, function (item) {
        if (curPref && (curPref.placesteelOne == item.placesteelId || curPref.placesteelTwo == item.placesteelId || curPref.placesteelThree == item.placesteelId)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    } else if (type == 3) {
      angular.forEach($scope.varietyBrandList, function (item) {
        angular.forEach(item.brandList, function (brand) {
          if (curPref && (curPref.brandOne == brand.brandId || curPref.brandTwo == brand.brandId || curPref.brandThree == brand.brandId)) {
            brand.checked = true;
            item.hasChecked = true;
          } else {
            brand.checked = false;
          }
        })
      });
    }
  };

  // 清空选中
  $scope.unChecked = function (type) {
    if (type == 1) {
      angular.forEach($scope.cityList, function (item) {
        item.checked = false;
      });
    } else if (type == 2) {
      angular.forEach($scope.placeSteelList, function (item) {
        item.checked = false;
      });
    } else if (type == 3) {
      angular.forEach($scope.varietyBrandList, function (item) {
        angular.forEach(item.brandList, function (brand) {
          brand.checked = false;
        })
      });
    }
  };

  // load data 品牌品类
  MineService.getVarietyBrand().then(function (result) {
    $scope.varietyBrandList = result;
    if ($scope.varietyBrandList && $scope.varietyBrandList.length > 0 && !$scope.varietySelected) {
      setCurBrandList($scope.varietyBrandList[0]);
    }
  });

  // load data 城市列表
  MineService.getWarehouseCityList().then(function (result) {
    $scope.cityList = result;
  });

  // load data 品牌数据
  var pPageNo = 0;
  $scope.psOptions = {moreData: false, placesteelName: '', show: false};
  var loadPlacesteelList = function (forPage) {
    if (forPage) {
      pPageNo++; // 自增页码
    } else {
      pPageNo = 0; // 重置页码
    }
    MineService.getPlacesteelList(pPageNo, PAGE_SIZE, $scope.psOptions.placesteelName).then(function (result) {
      $scope.placeSteelList = forPage ? $scope.placeSteelList.concat(result) : angular.copy(result);
      $scope.psOptions.moreData = (result && result.length == PAGE_SIZE);
      refreshListChecked(2);
    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  loadPlacesteelList();

  // 下拉刷新 品牌数据
  $scope.doRefreshPlaceSteel = function () {
    loadPlacesteelList();
  };
  // 加载更多 品牌数据
  $scope.doLoadPlaceSteel = function () {
    loadPlacesteelList(true);
  };

  // 资源所在地 modal
  $ionicModal.fromTemplateUrl('city-modal.html', {
    scope: $scope
  }).then(function (modal) {
    cityModal = modal;
  });
  $scope.openCityModal = function () {
    refreshListChecked(1);
    cityModal.show();
  };
  $scope.closeCityModal = function () {
    cityModal.hide();
  };

  // 品名 modal
  $ionicModal.fromTemplateUrl('brand-modal.html', {
    scope: $scope
  }).then(function (modal) {
    brandModal = modal;
  });
  $scope.openBrandModal = function () {
    refreshListChecked(3);
    brandModal.show();
  };
  $scope.closeBrandModal = function () {
    brandModal.hide();
  };

  $scope.changeBrandList = function (obj) {
    setCurBrandList(obj);
  };
  // 切换modal 品类
  var setCurBrandList = function (obj) {
    $scope.varietySelected = obj;
    $ionicScrollDelegate.$getByHandle('brand-modal-scroll-handle').scrollTop();
  };

  // 品牌 modal
  $ionicModal.fromTemplateUrl('placeSteel-modal.html', {
    scope: $scope
  }).then(function (modal) {
    placeSteelModal = modal;
  });
  $scope.openPlaceSteelModal = function () {
    refreshListChecked(2);
    $scope.psOptions.show = true;
    placeSteelModal.show();
  };
  $scope.closePlaceSteelModal = function () {
    $scope.psOptions.show = false;
    placeSteelModal.hide();
  };

  /**
   * save pref
   * type:1 所在地，  2 品牌，  3品名
   */
  $scope.savePref = function (type) {
    var data = {editFlag: type};
    var validateReturnData = validateAndGetData(type);
    if (validateReturnData) {
      data = angular.extend(data, validateReturnData);
      MineService.savePref(data).then(function (result) {
        curPref = result;
        initShowList(curPref);
        if (type == 1) {
          $scope.closeCityModal();
        } else if (type == 2) {
          $scope.closePlaceSteelModal();
        } else if (type == 3) {
          $scope.closeBrandModal();
        }
      })
    }
  };

  // 验证和组装数据
  var validateAndGetData = function (type) {
    var checkList = [];
    var data = {};
    if (type == 1) {
      angular.forEach($scope.cityList, function (item) {
        if (item.checked) checkList.push(item);
      });
      if (checkList.length > 3) {
        Toast.show('最多只能选择三项');
        return false;
      }
      if (checkList[0]) {
        data.cityOne = checkList[0].city;
        data.cityOneName = checkList[0].cityName;
      }
      if (checkList[1]) {
        data.cityTwo = checkList[1].city;
        data.cityTwoName = checkList[1].cityName;
      }
      if (checkList[2]) {
        data.cityThree = checkList[2].city;
        data.cityThreeName = checkList[2].cityName;
      }
    } else if (type == 2) {
      angular.forEach($scope.placeSteelList, function (item) {
        if (item.checked) checkList.push(item);
      });
      if (checkList.length > 3) {
        Toast.show('最多只能选择三项');
        return false;
      }
      if (checkList[0]) {
        data.placesteelOne = checkList[0].placesteelId;
        data.placesteelOneName = checkList[0].placesteelName;
      }
      if (checkList[1]) {
        data.placesteelTwo = checkList[1].placesteelId;
        data.placesteelTwoName = checkList[1].placesteelName;
      }
      if (checkList[2]) {
        data.placesteelThree = checkList[2].placesteelId;
        data.placesteelThreeName = checkList[2].placesteelName;
      }
    } else if (type == 3) {
      angular.forEach($scope.varietyBrandList, function (item) {
        angular.forEach(item.brandList, function (brand) {
          if (brand.checked) checkList.push(brand);
        })
      });

      if (checkList.length > 3) {
        Toast.show('最多只能选择三项');
        return false;
      }
      if (checkList[0]) {
        data.brandOne = checkList[0].brandId;
        data.brandOneName = checkList[0].brandName;
      }
      if (checkList[1]) {
        data.brandTwo = checkList[1].brandId;
        data.brandTwoName = checkList[1].brandName;
      }
      if (checkList[2]) {
        data.brandThree = checkList[2].brandId;
        data.brandThreeName = checkList[2].brandName;
      }
    }
    return data;
  };

  // 品类 品名 设置弹窗, 品类下是否有品名被选中
  $scope.hasChecked = function (item) {
    var hasChecked = false;
    angular.forEach(item.brandList, function (brand) {
      if (brand.checked) {
        hasChecked = true;
      }
    });
    return hasChecked;
  };

  /**
   * the End ...
   * 销毁 modal s
   */
  $scope.$on('$destroy', function () {
    cityModal = null;
    $ionicBackdrop.release();
  });

  $scope.$on('modal.shown', function () {
    $ionicBackdrop.retain();
  });
  $scope.$on('modal.hidden', function () {
    $ionicBackdrop.release();
  });
  $scope.$on('modal.removed', function () {
    $ionicBackdrop.release();
  });
});
