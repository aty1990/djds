/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('AddGoodsCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, ResService, Toast, $q, $ionicHistory, $ionicSideMenuDelegate, LoginInfoUtil,$ionicNativeTransitions,SimpleLocalStorage,PAGE_SIZE,ValidateUtil) {

  $scope.addGoodsData={};

  /**
   *跳转到订货下单页面
   */
  $scope.toOrderingStep1=function () {
    if(!ValidateUtil.validateForm($scope.addGoodsData.brand,"请选择货品")) return;
    if(!ValidateUtil.validateForm($scope.addGoodsData.placesteel,"请选择产地")) return;
    if(!ValidateUtil.validateForm($scope.addGoodsData.texture,"请选择材质")) return;
    if(!ValidateUtil.validateForm($scope.addGoodsData.spec,"请输入规格")) return;
    if(!ValidateUtil.validateForm($scope.addGoodsData.weight,"请输入重量")) return;

    var orderingStep1Data=eval(SimpleLocalStorage.get('orderingStep1Data'));
    if(orderingStep1Data==null) orderingStep1Data=[];
    orderingStep1Data.push($scope.addGoodsData);
    SimpleLocalStorage.set('orderingStep1Data',orderingStep1Data);
    $state.go('to-ordering-step1');
  };



  /**
   * =========================选择货品【开始】==========================
   */
  var chooseBrandModal;

  $ionicModal.fromTemplateUrl('templates/modules/res/choose-brand.html', {
    scope: $scope
  }).then(function (modal) {
    chooseBrandModal = modal;
  });

  var latestVariety;//记录上次品类选中记录，简化循环

  $scope.openBrandModal = function () {
    
    ResService.getVarietyBrand().then(function (result) {
      $scope.varietyBrandList=result;
      if($scope.varietyBrandList!=null&&$scope.varietyBrandList.length>0){
        $scope.varietyBrandList[0].checked=true;
        $scope.brandList=$scope.varietyBrandList[0].brandList;
        latestVariety=$scope.varietyBrandList[0];
      }
    })

    /**
     * 点击品类
     * @param item
     */
    $scope.clickVariety=function (item) {
      item.checked=true;
      $scope.brandList=item.brandList;
      $scope.varietyBrandList.forEach(function (item) {
        if(item.varietyId==latestVariety.varietyId) {
          item.checked=false;
          return false;
        }
      });
      latestVariety=item;
    }

    /**
     * 点击品名
     * @param item
     */
    $scope.clickBrand=function (item) {
      $scope.addGoodsData.brandId=item.brandId;
      $scope.addGoodsData.brand=item.brandName;
      $scope.closeBrandModal();
    }
    
    chooseBrandModal.show();
  };

  $scope.closeBrandModal = function () {
    chooseBrandModal.hide();
  };

  /**
   * =========================选择货品【结束】==========================
   */


  /**
   * =========================选择产地【开始】==========================
   */
  var choosePlaceSteelModal;

  $ionicModal.fromTemplateUrl('templates/modules/res/choose-placesteel.html', {
    scope: $scope
  }).then(function (modal) {
    choosePlaceSteelModal = modal;
  });

  $scope.openPlaceSteelModal = function () {

    /**
     * 默认从缓存中取8条记录
     */
    $scope.steelPlaceStorageList=SimpleLocalStorage.getPlaceSteelStorage();

    choosePlaceSteelModal.show();
  };

  $scope.closePlaceSteelModal = function () {
    choosePlaceSteelModal.hide();
  };

  /**
   * =========================选择产地【结束】==========================
   */


  /**
   * =========================选择产地-更多【开始】==========================
   */
  var choosePlaceSteelMoreModal;

  $ionicModal.fromTemplateUrl('templates/modules/res/choose-placesteel-more.html', {
    scope: $scope
  }).then(function (modal) {
    choosePlaceSteelMoreModal = modal;
  });

  $scope.openPlaceSteelMoreModal = function () {

    choosePlaceSteelMoreModal.show();
    $scope.psOptions={placesteelName:null,pageNo:0,pageSize:PAGE_SIZE,moreData:false};

    function loadDataPlaceSteel(forPage) {

      // 维护分页属性
      if (forPage) {
        $scope.psOptions.pageNo++;
      } else {
        $scope.psOptions.pageNo = 0;
      }

      ResService.getPlacesteelList($scope.psOptions).then((result) => {
        // 设置是否有更多数据标识
        $scope.psOptions.moreData = (result && result.length > 0);
        $scope.steelPlaceList = forPage ? $scope.steelPlaceList.concat(result) : angular.copy(result);

      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    /**
     * 加载更多
     */
    $scope.doLoadPlaceSteel = function () {
      loadDataPlaceSteel(true);
    };
    /**
     * 下拉刷新
     */
    $scope.doRefreshPlaceSteel = function () {
      loadDataPlaceSteel();
    };

    loadDataPlaceSteel();

  };

  /**
   * 选中产地
   * @param item
   */

  var checkedPlacesteel=null;
  $scope.checkedPlaceSteel=function (item) {
    checkedPlacesteel=item;
  };

  /**
   * 确认产地，页面共用
   */
  $scope.confirmPlaceSteel=function (moreStep) {
    if(checkedPlacesteel==null){
      Toast.show('请选择产地！');
      return;
    }
    if(moreStep){
      SimpleLocalStorage.setPlaceSteelStorage(checkedPlacesteel);
    }
    $scope.addGoodsData.placesteelId=checkedPlacesteel.placesteelId;
    $scope.addGoodsData.placesteel=checkedPlacesteel.placesteelName;
    $scope.closePlaceSteelModal();
    $scope.closePlaceSteelMoreModal();
  }

  $scope.closePlaceSteelMoreModal = function () {
    choosePlaceSteelMoreModal.hide();
  };


  /**
   * =========================选择产地-更多【结束】==========================
   */




  /**
   * =========================选择材质【开始】==========================
   */
  var chooseTextureModal;

  $ionicModal.fromTemplateUrl('templates/modules/res/choose-texture.html', {
    scope: $scope
  }).then(function (modal) {
    chooseTextureModal = modal;
  });

  $scope.openTextureModal = function () {

    /**
     * 默认从缓存中取8条记录
     */
    $scope.textureStorageList=SimpleLocalStorage.getTextureStorage();

    chooseTextureModal.show();
  };

  $scope.closeTextureModal = function () {
    chooseTextureModal.hide();
  };

  /**
   * =========================选择材质【结束】==========================
   */


  /**
   * =========================选择材质-更多【开始】==========================
   */
  var chooseTextureMoreModal;

  $ionicModal.fromTemplateUrl('templates/modules/res/choose-texture-more.html', {
    scope: $scope
  }).then(function (modal) {
    chooseTextureMoreModal = modal;
  });

  $scope.openTextureMoreModal = function () {

    chooseTextureMoreModal.show();
    $scope.textureOptions={textureName:null,pageNo:0,pageSize:PAGE_SIZE,moreData:false};

    function loadDataTexture (forPage) {

      // 维护分页属性
      if (forPage) {
        $scope.textureOptions.pageNo++;
      } else {
        $scope.textureOptions.pageNo = 0;
      }

      ResService.getTextureList($scope.textureOptions).then((result) => {
        // 设置是否有更多数据标识
        $scope.textureOptions.moreData = (result && result.length > 0);
        $scope.textureList = forPage ? $scope.textureList.concat(result) : angular.copy(result);

      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    /**
     * 加载更多
     */
    $scope.doLoadTexture = function () {
      loadDataTexture(true);
    };
    /**
     * 下拉刷新
     */
    $scope.doRefreshTexture = function () {
      loadDataTexture();
    };

    loadDataTexture();

  };

  /**
   * 选中材质
   * @param item
   */

  var checkedTexture=null;
  $scope.checkedTexture=function (item) {
    checkedTexture=item;
  };

  /**
   * 确认材质，页面共用
   */
  $scope.confirmTexture=function (moreStep) {
    if(checkedTexture==null){
      Toast.show('请选择产地！');
      return;
    }
    if(moreStep){
      SimpleLocalStorage.setTextureStorage(checkedTexture);
    }
    $scope.addGoodsData.textureId=checkedTexture.textureId;
    $scope.addGoodsData.texture=checkedTexture.textureName;
    $scope.closeTextureModal();
    $scope.closeTextureMoreModal();
  }

  $scope.closeTextureMoreModal = function () {
    chooseTextureMoreModal.hide();
  };


  /**
   * =========================选择材质-更多【结束】==========================
   */




  $scope.$on('$destroy', function () {
    choosePlaceSteelModal = null;
    chooseTextureModal=null;
    chooseBrandModal=null;
  });





});
