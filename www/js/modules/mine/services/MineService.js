djEShopServices.service('MineService', function (httpUtil) {

  /**
   * 获取消息列表
   */
  this.queryMsg = function (isRead, pageNo, pageSize) {
    return httpUtil.get('check/msg/queryMsg', {isRead: isRead, pageNo: pageNo, pageSize: pageSize});
  };

  /**
   * 删除消息
   */
  this.deleteMsg = function (msgId) {
    return httpUtil.post('check/msg/deleteMsg', {msgId: msgId});
  };

  /**
   * 获取 -- 省份
   */
  this.getAllProvince = function (name) {
    return httpUtil.get('check/person/getAllProvince', {name: name});
  };

  /**
   * 获取 -- 城市
   */
  this.getCityByProvinceCode = function (provinceCode) {
    return httpUtil.get('check/person/getCityByProvinceCode', {provinceCode: provinceCode});
  };

  /**
   * 获取 -- 区县
   */
  this.getDistrictByCityCode = function (cityCode) {
    return httpUtil.get('check/person/getDistrictByCityCode', {cityCode: cityCode});
  };

  /**
   * 提交 -- 申请认证
   */
  this.submitPersonApply = function (data) {
    return httpUtil.post('check/person/submitPersonApply', data);
  };

  // 获得品类品名信息
  this.getVarietyBrand = function () {
    return httpUtil.get('check/futures/getVarietyBrand');
  };

  // 获得品牌(产地)信息
  this.getPlacesteelList = function (pageNo, pageSize, placesteelName) {
    return httpUtil.get('check/futures/getPlacesteelList', {
      pageNo: pageNo,
      pageSize: pageSize,
      placesteelName: placesteelName
    });
  };

  // 获得资源所在城市列表
  this.getWarehouseCityList = function () {
    return httpUtil.get('check/futures/getWarehouseCityList');
  };

  // 获取 偏好设置
  this.getPref= function (){
    return httpUtil.get('check/person/getPref');
  };

  // 保存 偏好设置
  this.savePref= function (data){
    return httpUtil.post('check/person/savePref', data);
  };

  // 我的订单数
  this.getUnFinishOrderCount= function (){
    return httpUtil.get('check/order/getUnFinishOrderCount');
  };

  // 未读消息数
  this.getMsgCount= function (){
    return httpUtil.get('check/msg/getMsgCount');
  };

  /**
   * 读取消息
   */
  this.markMsg = function (msgId) {
    return httpUtil.post('check/msg/markMsg', {msgId: msgId});
  };


});
