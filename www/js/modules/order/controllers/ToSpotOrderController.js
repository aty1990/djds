/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('ToSpotOrderCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, $state, OrderService, Toast, ValidateUtil) {


  $scope.toLadingInfo = function () {
    $state.go('lading-info');
  };

  $scope.toOtherRequire = function () {
    $state.go('other-require-spot');
  };


  /**
   * 加载提货信息数据
   */
  function loadData() {

    OrderService.toWriteSpotOrder({shopcartIdStr: $stateParams.shopcartIdStr}).then((result) => {
      $scope.spotOrder = result;
      $scope.spotOrder.deliveryType = 2;
      $scope.spotOrder.warehouseFeeAgentFlag = 0;
      $scope.spotOrder.settlementType = 4;
      $scope.ladingInfoData.addressList = $scope.spotOrder.addressList;
      $scope.ladingInfoData.dfAddressId = $scope.spotOrder.dfaddress.addressId;
      $scope.partnerInfoData.showList = $scope.spotOrder.showList;
      $scope.partnerInfoData.partnerList = $scope.spotOrder.partnerList;
      queryOrderDetailList();
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
    if ($scope.spotOrder.showList && !ValidateUtil.validateForm($scope.spotOrder.personName, '请选择专属客服')) {
      return;
    }
    if ($scope.spotOrder.deliveryType == 2 && !ValidateUtil.validateForm($scope.spotOrder.dfaddress.addressId, '请选择收货地址')) {//配送必须选择收货地址
      return;
    }

    var params = {};
    params.sellId = $scope.spotOrder.sellId;
    params.orderInfo = $scope.spotOrder.orderInfo;
    params.deliveryType = $scope.spotOrder.deliveryType;

    params.pickupTel = $scope.spotOrder.pickupTel;
    params.pickupName = $scope.spotOrder.pickupName;
    params.consigneeCmpy = $scope.spotOrder.takeDep;
    params.amountMoney = $scope.spotOrder.cartList.totalMoney;
    params.amountWeight = $scope.spotOrder.cartList.totalBuyWeight;

    params.salesman = $scope.spotOrder.personName;
    params.salesmanExcode = $scope.spotOrder.personExternalCode;
    params.salesmanTel = $scope.spotOrder.cellphone;
    params.salesmanOrg = $scope.spotOrder.orgName;
    params.salesmanOrgExcode = $scope.spotOrder.orgExternalCode;

    params.myDiscount = $scope.spotOrder.myDiscount;
    params.expectFreight = $scope.spotOrder.expectFreight;
    params.orderFrom = 2;
    params.settlementType = $scope.spotOrder.settlementType;

    params.warehouseFeeAgentFlag = $scope.spotOrder.warehouseFeeAgentFlag;
    params.addressId = $scope.spotOrder.dfaddress.addressId;
    params.offerType = $scope.spotOrder.offerType;
    params.pickupCarNo = $scope.spotOrder.pickupCarNo;


    var shopcartId = [], inventoryId = [], listingId = [], weight = [], listingPrice = [], warehouseFee = [], freightPrice = [], taxPrice = [], favorableAdjustPrice = [], payablePrice = [];

    $scope.spotOrder.cartList.shopCartPO2List.forEach(function (item) {
      shopcartId.push(item.shopcartId);
      listingId.push(item.listingId);
      inventoryId.push(item.inventoryId);
      weight.push(item.buyWeight);
      listingPrice.push(item.listingPrice);
      warehouseFee.push(item.warehouseFee);
      taxPrice.push(item.taxPrice);
      freightPrice.push(item.freightPrice);
      favorableAdjustPrice.push(item.favorableAdjustPrice);
      payablePrice.push(item.payablePrice);
    });
    params.shopcartId = shopcartId;
    params.listingId = listingId;
    params.inventoryId = inventoryId;
    params.weight = weight;
    params.listingPrice = listingPrice;
    params.warehouseFee = warehouseFee;
    params.taxPrice = taxPrice;
    params.freightPrice = freightPrice;
    params.favorableAdjustPrice = favorableAdjustPrice;
    params.payablePrice = payablePrice;

    OrderService.createSpotOrder(params).then((result) => {
      Toast.show('订单生成成功！');
      $state.go('my-order', {orderType: 1});
    });
  }


  /**
   * 提货信息modal
   */
  var ladingInfoModal;

  $ionicModal.fromTemplateUrl('templates/modules/order/lading-info.html', {
    scope: $scope
  }).then(function (modal) {
    ladingInfoModal = modal;
  });

  $scope.openLadingInfoModal = function () {
    if ($scope.spotOrder.isXp == 'Y') {
      $scope.deliveryTypeSelect = [{id: 2, name: '配送'}];
    } else {
      $scope.deliveryTypeSelect = [{id: 1, name: '自提'}, {id: 2, name: '配送'}];
    }
    ladingInfoModal.show();
  };

  $scope.closeLadingInfoModal = function () {
    ladingInfoModal.hide();
  };

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
    if ($scope.ladingInfoData.deliveryType == 2 && $scope.ladingInfoData.dfAddressId == null) {
      Toast.show('请选择收货地址');
      return;
    }
    $scope.spotOrder.deliveryType = $scope.ladingInfoData.deliveryType;
    $scope.spotOrder.pickupCarNo = $scope.ladingInfoData.pickupCarNo;
    if ($scope.spotOrder.deliveryType == 1) {//自提
      $scope.spotOrder.settlementType == 5;
      $scope.closeLadingInfoModal();
    } else {//配送才查运费
      $scope.spotOrder.addressList = $scope.ladingInfoData.addressList;
      if ($scope.spotOrder.dfaddress.addressId != $scope.ladingInfoData.dfAddressId) {//如果没变则不修改默认地址
        $scope.spotOrder.dfaddress = $scope.ladingInfoData.dfaddress;
      }
      OrderService.queryFreightPrice({
        shopcartIdStr: $stateParams.shopcartIdStr,
        addressId: $scope.spotOrder.dfaddress.addressId
      }).then((result) => {
        $scope.spotOrder.freightPrice = result;
        //重新计算价格，刷新明细列表
        queryOrderDetailList();
        $scope.closeLadingInfoModal();
      });
    }

  };

  /**
   * 选择默认配送地址
   */
  $scope.addressChecked = function (item) {
    $scope.ladingInfoData.dfaddress = item;
  }


  /**
   * 专属客服modal
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
    $scope.partnerInfoData.personName = $scope.partnerInfoData.dfPartner.personName;
    $scope.spotOrder.personName = $scope.partnerInfoData.dfPartner.personName;
    $scope.spotOrder.personExternalCode = $scope.partnerInfoData.dfPartner.personExternalCode;
    $scope.spotOrder.cellphone = $scope.partnerInfoData.dfPartner.cellphone;
    $scope.spotOrder.orgName = $scope.partnerInfoData.dfPartner.orgName;
    $scope.spotOrder.orgExternalCode = $scope.partnerInfoData.dfPartner.orgExternalCode;
    $scope.closeParterInfoModal();

  };

  /**
   * 选择专属客服
   */
  $scope.partnerChecked = function (item) {
    $scope.partnerInfoData.dfPartner = item;
  }


  /**
   * 其他要求modal
   */
  var otherRequireModal;

  $ionicModal.fromTemplateUrl('templates/modules/order/other-require-spot.html', {
    scope: $scope
  }).then(function (modal) {
    otherRequireModal = modal;
  });

  $scope.openOtherRequireModal = function () {
    otherRequireModal.show();
  };

  $scope.closeOtherRequireModal = function () {
    otherRequireModal.hide();
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
   * 确认【其他要求】
   */
  $scope.confirmOtherRequire = function () {
    $scope.spotOrder.warehouseFeeAgentFlag = $scope.otherRequireData.warehouseFeeAgent;
    $scope.spotOrder.settlementType = $scope.otherRequireData.settlementType;
    $scope.spotOrder.myDiscount = $scope.otherRequireData.myDiscount;
    $scope.spotOrder.orderInfo = $scope.otherRequireData.orderInfo;

    //重新计算价格，刷新明细列表
    queryOrderDetailList();

    $scope.closeOtherRequireModal();

  }


  /**
   * 新增收货地址
   */
  var addAddressModal;
  $scope.addressData = {provinceName: '', cityName: '', districtName: ''};

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
      var provinceName, cityName, districtName;
      $scope.addressData.provinceList.forEach((item) => {
        if (item.provinceCode == $scope.addressData.province) {
          provinceName = item.provinceName;
          return false;
        }

      });
      $scope.addressData.cityList.forEach((item) => {
        if (item.cityCode == $scope.addressData.city) {
          cityName = item.cityName;
          return false;
        }
      });
      $scope.addressData.districtList.forEach((item) => {
        if (item.districtCode == $scope.addressData.district) {
          districtName = item.districtName;
          return false;
        }
      });
      if (!ValidateUtil.validateForm($scope.addressData.takeDep, "收货企业不能为空")) return;
      if (!ValidateUtil.validateForm($scope.addressData.takePerson, "收货人不能为空")) return;
      if (!ValidateUtil.validateForm($scope.addressData.takePhone, "联系方式不能为空")) return;
      if (!ValidateUtil.validateForm($scope.addressData.province, "收货省份不能为空")) return;
      if (!ValidateUtil.validateForm($scope.addressData.city, "收货城市不能为空")) return;
      if (!ValidateUtil.validateForm($scope.addressData.province, "收货区县不能为空")) return;
      if (!ValidateUtil.validateForm($scope.addressData.addressInfo, "详细地址不能为空")) return;

      OrderService.saveAddress({
        addressId: $scope.addressData.addressId,
        province: parseInt($scope.addressData.province),
        city: parseInt($scope.addressData.city),
        district: parseInt($scope.addressData.district),
        addressInfo: $scope.addressData.addressInfo,
        takeDep: $scope.addressData.takeDep,
        takePerson: $scope.addressData.takePerson,
        takePhone: $scope.addressData.takePhone,
        addressShow: provinceName + cityName + districtName,
        defaultFlag: 0
      }).then((result) => {
        Toast.show("新增地址成功!");
        $scope.closeAddressModal();
        findAddressList();
      });
    }

    $scope.showPlace = function () {
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
      $scope.spotOrder.addressList = $scope.ladingInfoData.addressList = result;
    });
  }


  /**
   * 销毁modal
   */
  $scope.$on('$destroy', function () {
    ladingInfoModal = null;
    otherRequireModal = null;
    addAddressModal = null;
  });

  /**
   * 单吨价包车价事件
   * @param offerType
   */
  $scope.changOfferType = function (offerType) {
    if (offerType == 1) {//包车价
      $scope.spotOrder.yfMoney = $scope.spotOrder.freightPrice.pricePerTon;
    } else if (offerType == 2) {//单吨价
      $scope.spotOrder.yfMoney = $scope.spotOrder.freightPrice.pricePerVehicleTon;
    }
    queryOrderDetailList();
  }


  /**
   * 重新刷新资源列表
   */
  var queryOrderDetailList = function () {
    OrderService.queryOrderDetailList({
      shopcartIdStr: $stateParams.shopcartIdStr,
      myDiscount: $scope.spotOrder.myDiscount,
      settlementType: $scope.spotOrder.settlementType,
      yfMoney: $scope.spotOrder.yfMoney,
      warehouseFeeAgentFlag: $scope.spotOrder.warehouseFeeAgentFlag,
      deliveryType: $scope.spotOrder.deliveryType
    }).then(function (result) {
      $scope.spotOrder.cartList = result;
      $scope.spotOrder.cartList.shopCartPO2List.forEach(function (item) {
        if (!$scope.spotOrder.freightPrice.hasResult && $scope.spotOrder.deliveryType != 1) {
          item.oneBillPrice = null;//待计算
        } else {
          item.oneBillPrice = item.taxPriceYuan;
        }

      })

    })

  }

});



