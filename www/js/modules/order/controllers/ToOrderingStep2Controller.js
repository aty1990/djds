/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('ToOrderingStep2Ctrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, Toast, $q, $ionicHistory, $ionicSideMenuDelegate, LoginInfoUtil,ionicDatePicker,OrderService,$filter,CameraUtil,ValidateUtil,SimpleLocalStorage ) {

  $scope.toLadingInfo = function () {
    $state.go('lading-info');
  };

  $scope.toOtherRequire = function () {
    $state.go('other-require-ordering');
  };

  $scope.pickDate = function () {
    var tempTime = 0;
    ionicDatePicker.openDatePicker({
      // inputDate: new Date(today.replace(/-/g, '/')),
      callback: function (date) {
        tempTime = date;
        $scope.orderingOrder.futureDeliveryDate = $filter('date')(new Date(tempTime), 'yyyy-MM-dd');
      }
    })
  };

  /**
   * 加载提货信息数据
   */
  function loadData() {

    OrderService.toWriteFuturesOrder($stateParams.queryParams).then((result) => {
      $scope.orderingOrder = result;
      $scope.orderingOrder.deliveryType = 2;//默认配送
      $scope.orderingOrder.warehouseFeeAgentFlag = 0;//代垫上力费:否
      $scope.orderingOrder.settlementType = 4;//一票制要求:货运二票制
      $scope.partnerInfoData.showList = $scope.orderingOrder.showList;
      $scope.partnerInfoData.partnerList = $scope.orderingOrder.partnerList;
      $scope.ladingInfoData.addressList = $scope.orderingOrder.addList;
      $scope.ladingInfoData.dfAddressId = $scope.orderingOrder.dfaddress.addressId;
    })
  }

  /**
   * 查询现货订单相关信息
   */
  $scope.$on('$ionicView.enter', function () {
    loadData();
  });

  /**
   * 提交订单
   */
  $scope.submitOrder = function () {

    if ($scope.orderingOrder.showList && !ValidateUtil.validateForm($scope.orderingOrder.personName,'请选择专属客服')) {
      return;
    }

    if($scope.orderingOrder.deliveryType==2&&!ValidateUtil.validateForm($scope.orderingOrder.dfaddress.addressId,'请选择收货地址')){//配送必须选择收货地址
      return;
    }

    if(!ValidateUtil.validateForm($scope.orderingOrder.futureDeliveryDate,"请选择交货期")) return;

    var params = {};
    params.sellId = $scope.orderingOrder.sellId;
    params.orderInfo = $scope.orderingOrder.orderInfo;
    params.deliveryType = $scope.orderingOrder.deliveryType;

    params.pickupTel = $scope.orderingOrder.pickupTel;
    params.pickupName = $scope.orderingOrder.pickupName;
    params.consigneeCmpy = $scope.orderingOrder.takeDep;

    params.salesman = $scope.orderingOrder.personName;
    params.salesmanExcode = $scope.orderingOrder.personExternalCode;
    params.salesmanTel = $scope.orderingOrder.cellphone;
    params.salesmanOrg = $scope.orderingOrder.orgName;
    params.salesmanOrgExcode = $scope.orderingOrder.orgExternalCode;

    params.myDiscount = $scope.orderingOrder.myDiscount;
    params.expectFreight = $scope.orderingOrder.expectFreight;
    params.orderFrom = 2;
    params.settlementType = $scope.orderingOrder.settlementType;

    params.warehouseFeeAgentFlag = $scope.orderingOrder.warehouseFeeAgentFlag;
    params.addressId = $scope.orderingOrder.dfaddress.addressId;
    // params.offerType = $scope.orderingOrder.offerType;
    params.futureDeliveryDate = $scope.orderingOrder.futureDeliveryDate;



    var weight = [], brandId = [], brandName = [], placesteelId = [], placesteelName=[],textureId = [], textureName = [], specName = [], requirementInfo = [];

    $scope.orderingOrder.detailList.forEach(function (item) {
      weight.push(item.weight);
      brandId.push(item.brandId);
      brandName.push(item.brandName);
      placesteelId.push(item.placesteelId);
      placesteelName.push(item.placesteelName);
      textureId.push(item.textureId);
      textureName.push(item.textureName);
      specName.push(item.specName);
      requirementInfo.push(item.requirementInfo);
    });

    params.weight=weight;
    params.brandId=brandId;
    params.brandName=brandName;
    params.placesteelId=placesteelId;
    params.placesteelName=placesteelName;
    params.textureId=textureId;
    params.textureName=textureName;
    params.specName=specName;
    params.requirementInfo=requirementInfo;

    OrderService.createFuturesOrder(params).then((result) => {
      SimpleLocalStorage.rm('orderingStep1Data');
      Toast.show('订单生成成功！');
      $state.go('my-order',{orderType:2});
    });
  }


  /**
   * ====================提货信息【开始】=====================
   */
  var ladingInfoModal;

  $ionicModal.fromTemplateUrl('templates/modules/order/lading-info.html', {
    scope: $scope
  }).then(function (modal) {
    ladingInfoModal = modal;
  });

  $scope.openLadingInfoModal = function () {
    ladingInfoModal.show();
  };

  $scope.closeLadingInfoModal = function () {
    ladingInfoModal.hide();
  };
  $scope.deliveryTypeSelect=[{id:1,name:'自提'},{id:2,name:'配送'}];
  $scope.ladingInfoData = {deliveryType: '2'};//提货信息数据对象

  /**
   * 提货信息点击确认
   * 查询运价
   */
  $scope.confirmLadingInfo = function () {
    if ($scope.ladingInfoData.deliveryType == '' || $scope.ladingInfoData.deliveryType == null) {
      Toast.show('请选择提货方式');
      return;
    }
    if($scope.ladingInfoData.deliveryType==2&&$scope.ladingInfoData.dfAddressId==null){
      Toast.show('请选择收货地址');
      return;
    }
    $scope.orderingOrder.deliveryType=$scope.ladingInfoData.deliveryType;
    $scope.orderingOrder.pickupCarNo = $scope.ladingInfoData.pickupCarNo;
    if($scope.orderingOrder.deliveryType==1){//自提
      $scope.orderingOrder.settlementType==5;
    }else{//配送
      $scope.orderingOrder.addressList = $scope.ladingInfoData.addressList;
      if($scope.orderingOrder.dfaddress.addressId!=$scope.ladingInfoData.dfAddressId){//如果没变则不修改默认地址
        $scope.orderingOrder.dfaddress = $scope.ladingInfoData.dfaddress;
      }
    }
    $scope.closeLadingInfoModal();
  };

  /**
   * 选择默认配送地址
   */
  $scope.addressChecked = function (item) {
    $scope.ladingInfoData.dfaddress = item;
  }


  /**
   * ====================提货信息【结束】=====================
   */


  /**
   * ====================专属客服【开始】=====================
   */
  var partnerInfoModal;

  $ionicModal.fromTemplateUrl('templates/modules/order/partner-info.html', {
    scope: $scope
  }).then(function (modal) {
    partnerInfoModal = modal;
  });

  $scope.openParterInfoModal = function () {
    if (!$scope.partnerInfoData.showList) {
      Toast.show("暂无销售组织和专属客服信息，请联系运营方维护。联系电话：4001685888");
      return;
    }
    partnerInfoModal.show();
  };

  $scope.closeParterInfoModal = function () {
    partnerInfoModal.hide();
  };

  $scope.partnerInfoData = {};


  /**
   * 专属客服点击确认
   */
  $scope.confirmPartnerInfo = function () {
    if ($scope.partnerInfoData.showList && $scope.partnerInfoData.dfPartner == null) {
      Toast.show('请选择专属客服');
      return;
    }
    $scope.partnerInfoData.personName=$scope.partnerInfoData.dfPartner.personName;
    $scope.orderingOrder.personName = $scope.partnerInfoData.dfPartner.personName;
    $scope.orderingOrder.personExternalCode = $scope.partnerInfoData.dfPartner.personExternalCode;
    $scope.orderingOrder.cellphone = $scope.partnerInfoData.dfPartner.cellphone;
    $scope.orderingOrder.orgName = $scope.partnerInfoData.dfPartner.orgName;
    $scope.orderingOrder.orgExternalCode = $scope.partnerInfoData.dfPartner.orgExternalCode;
    $scope.closeParterInfoModal();

  };

  /**
   * 选择专属客服
   */
  $scope.partnerChecked = function (item) {
    $scope.partnerInfoData.dfPartner = item;
  }


  /**
   * ====================专属客服【结束】=====================
   */

  /**
   * ====================其他要求【开始】=====================
   */
  var otherRequireModal;

  $ionicModal.fromTemplateUrl('templates/modules/order/other-require-ordering.html', {
    scope: $scope
  }).then(function (modal) {
    otherRequireModal = modal;
  });

  $scope.openOtherRequireModal = function () {
    $scope.pickDate2 = function () {
      var tempTime = 0;
      ionicDatePicker.openDatePicker({
        // inputDate: new Date(today.replace(/-/g, '/')),
        callback: function (date) {
          tempTime = date;
          $scope.otherRequireData.futureDeliveryDate = $filter('date')(new Date(tempTime), 'yyyy-MM-dd');
        }
      })
    };


    $scope.warehouseFeeAgentSelect = [{id: 0, name: '否'}, {id: 1, name: '代垫上力费'}];//上力费要求
    $scope.settlementTypeSelect = [{id: 3, name: '货运一票制'}, {id: 4, name: '货运二票制'}];//一票制要求

    $scope.otherRequireData = {warehouseFeeAgent: '0', settlementType: '4'};//默认值

    /**
     * 一票制要求根据上力费要求变换值
     */
    $scope.changeWarehouseFeeAgentSelect = function () {
      if ($scope.otherRequireData.warehouseFeeAgent == 0) {
        $scope.settlementTypeSelect = [{id: 3, name: '货运一票制'}, {id: 4, name: '货运二票制'}];//一票制要求
        $scope.otherRequireData.settlementType = '4';
      } else {
        $scope.settlementTypeSelect = [{id: 1, name: '货运吊一票制'}, {id: 2, name: '货运吊三票制'}, {id: 6, name: '货吊一票制'}, {
          id: 7,
          name: '货吊二票制'
        }];//一票制要求
        $scope.otherRequireData.settlementType = '2';
      }
    }

    /**
     *  拍照
     */
    $scope.takePhoto = function () {
      CameraUtil.show(function (imageData) {
        $scope.otherRequireData.uploadImg=imageData;
      });
    };

    /**
     * 删除
     */
    $scope.deleteImage = function () {
      $scope.otherRequireData.uploadImg=null;
    };


    /**
     * 确认【其他要求】
     */
    $scope.confirmOtherRequire = function () {
      if(!ValidateUtil.validateForm($scope.otherRequireData.warehouseFeeAgent,"请选择上力费要求")) return;
      if(!ValidateUtil.validateForm($scope.otherRequireData.settlementType,"请选择一票制要求")) return;
      if(!ValidateUtil.validateForm($scope.otherRequireData.futureDeliveryDate,"请选择交货期")) return;
      $scope.orderingOrder.warehouseFeeAgentFlag = $scope.otherRequireData.warehouseFeeAgent;
      $scope.orderingOrder.settlementType = $scope.otherRequireData.settlementType;
      $scope.orderingOrder.futureDeliveryDate = $scope.otherRequireData.futureDeliveryDate;
      $scope.orderingOrder.orderInfo = $scope.otherRequireData.orderInfo;
      $scope.orderingOrder.uploadImg = $scope.otherRequireData.uploadImg;
      $scope.closeOtherRequireModal();
    }

    otherRequireModal.show();
  };

  $scope.closeOtherRequireModal = function () {
    otherRequireModal.hide();
  };






  /**
   * ====================其他要求【结束】=====================
   */


  /**
   * ====================新增收货地址【开始】=========================
   */
  var addAddressModal;
  $scope.addressData = {provinceName:'',cityName:'',districtName:''};

  $ionicModal.fromTemplateUrl('templates/modules/order/add-address.html', {
    scope: $scope
  }).then(function (modal) {
    addAddressModal = modal;
  });

  $scope.openAddressModal = function () {
    /**
     * 查询省份
     */
    OrderService.getAllProvince().then((result) => {
      $scope.addressData.provinceList = result;
      $scope.addressData.cityList = [];
      $scope.addressData.city = '';
      $scope.addressData.districtList = [];
      $scope.addressData.district = '';
    });

    /**
     * 查询城市
     */
    $scope.getCityByProvinceCode = function () {
      $scope.addressData.city = '';
      $scope.addressData.districtList = [];
      $scope.addressData.district = '';
      OrderService.getCityByProvinceCode({provinceCode: $scope.addressData.province}).then((result) => {
        $scope.addressData.cityList = result;
      });
    };

    /**
     * 查询区
     */
    $scope.getDistrictByCityCode = function () {
      $scope.addressData.district = '';
      OrderService.getDistrictByCityCode({cityCode: $scope.addressData.city}).then((result) => {
        $scope.addressData.districtList = result;

      });
    };

    /**
     * 新增地址
     */
    $scope.saveAddress = function () {
      var provinceName,cityName,districtName;
      $scope.addressData.provinceList.forEach((item) => {
        if(item.provinceCode == $scope.addressData.province){
          provinceName=item.provinceName;
          return false;
        }

      });
      $scope.addressData.cityList.forEach((item) => {
        if(item.cityCode ==$scope.addressData.city){
          cityName=item.cityName;
          return false;
        }
      });
      $scope.addressData.districtList.forEach((item) => {
        if(item.districtCode == $scope.addressData.district){
          districtName=item.districtName;
          return false;
        }
      });
      if(!ValidateUtil.validateForm($scope.addressData.takeDep,"收货企业不能为空")) return;
      if(!ValidateUtil.validateForm($scope.addressData.takePerson,"收货人不能为空")) return;
      if(!ValidateUtil.validateForm($scope.addressData.takePhone,"联系方式不能为空")) return;
      if(!ValidateUtil.validateForm($scope.addressData.province,"收货省份不能为空")) return;
      if(!ValidateUtil.validateForm($scope.addressData.city,"收货城市不能为空")) return;
      if(!ValidateUtil.validateForm($scope.addressData.province,"收货区县不能为空")) return;
      if(!ValidateUtil.validateForm($scope.addressData.addressInfo,"详细地址不能为空")) return;

      OrderService.saveAddress({
        addressId: $scope.addressData.addressId,
        province: parseInt($scope.addressData.province),
        city: parseInt($scope.addressData.city),
        district: parseInt($scope.addressData.district),
        addressInfo: $scope.addressData.addressInfo,
        takeDep: $scope.addressData.takeDep,
        takePerson: $scope.addressData.takePerson,
        takePhone: $scope.addressData.takePhone,
        addressShow:provinceName+cityName+districtName,
        defaultFlag: 0
      }).then((result) => {
        Toast.show("新增地址成功!");
        $scope.closeAddressModal();
        findAddressList();
      });
    }

    $scope.showPlace=function () {
      console.log("哈哈哈");
    }

    addAddressModal.show();
  };

  $scope.closeAddressModal = function () {
    addAddressModal.hide();
  };

  /**
   * 查询收货地址
   */
  var findAddressList = function () {
    OrderService.findAddressList().then((result) => {
      $scope.orderingOrder.addressList = $scope.ladingInfoData.addressList = result;
    });
  }

  /**
   * ====================新增收货结束【开始】=========================
   */


  /**
   * 销毁modal
   */
  $scope.$on('$destroy', function () {
    ladingInfoModal = null;
    otherRequireModal = null;
    addAddressModal = null;
  });





});
