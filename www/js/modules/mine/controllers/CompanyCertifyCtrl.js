/**
 * Created by sjin on 17/4/12.
 */
djEShopControllers.controller('CompanyCertifyCtrl', function ($scope, MineService, CameraUtil, ValidateUtil, Toast, $state) {

  // submit object .
  $scope.form = {province: '43', city: '4301', district: '430101', credentialType: '1'};

  // 验证必填规则
  var valiRules = [
    {param: 'cmpyName', message: '请输入企业全称'},
    {param: 'socialCreditCode', message: '请输入企业信用代码'},
    {param: 'cmpyTariff', message: '请输入税号'},
    {param: 'credentialType', message: '请选择企业证件类型'},
    {param: 'busiLicence', message: '请上传营业执照'},
    {param: 'permission', message: '请上传开户许可证'},
    {param: 'proxy', message: '请上传企业认证制授权书'}
  ];

  /**
   * submit Fn ..
   */
  $scope.submitCertify = function () {
    // 验证必填
    if (!ValidateUtil.validateRequire($scope.form, valiRules)) return false;

    // 如果是普通证件类型 要多验证 两个证件 为必填
    if ($scope.form.credentialType === 1) {
      if (!$scope.form.org) {
        Toast.show('请上传组织机构代码证');
        return false;
      }
      if (!$scope.form.taxReg) {
        Toast.show('请上传税务登记证');
        return false;
      }
    }

    MineService.submitPersonApply($scope.form).then(function () {
      Toast.show('申请成功,请等待审核');
      $state.go('personDetail');
    });
  };

  /**
   * 省、市、区
   * @type {Array}
   */
  $scope.provinceList = [];
  $scope.cityList = [];
  $scope.districtList = [];

  MineService.getAllProvince().then(function (result) {
    $scope.provinceList = result;
  });

  $scope.$watch('form.province', function () {
    MineService.getCityByProvinceCode($scope.form.province).then(function (result) {
      $scope.cityList = result;
    });
  });

  $scope.$watch('form.city', function () {
    MineService.getDistrictByCityCode($scope.form.city).then(function (result) {
      $scope.districtList = result;
    });
  });

  /**
   *  img s
   */
  $scope.selectHeadImage = function (index) {
    CameraUtil.show(function (imageData) {
      mapImage(index, imageData);
    });
  };

  $scope.deleteImage = function (index) {
    mapImage(index, null);
  };

  //图片映射
  var mapImage = function (index, imageData) {
    if (index == 1) {
      $scope.form.busiLicence = imageData;// 营业执照
    } else if (index == 2) {
      $scope.form.org = imageData;// 组织机构代码
    } else if (index == 3) {
      $scope.form.taxReg = imageData;// 税务登记证
    } else if (index == 4) {
      $scope.form.permission = imageData;// 开户许可证
    } else if (index == 5) {
      $scope.form.proxy = imageData;// 企业认证制授权书
    }
  }
});
