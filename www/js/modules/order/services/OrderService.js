/**
 * Created by rain on 2016/11/7.
 */
djEShopServices.service('OrderService', function (httpUtil) {

  // 填写现货订单查询
  this.toWriteSpotOrder = function (params) {
    return httpUtil.post('check/shopcart/toWriteSpotOrder', params);
  };

  // 提交订单
  this.createSpotOrder = function (params) {
    return httpUtil.post('check/shopcart/createSpotOrder', params);
  };

  // 我的订单分页列表查询
  this.getAppOrderList = function (params) {
    return httpUtil.get('check/order/getAppOrderList', params);
  };

  // 我的订单分页列表查询
  this.getOrderDetail = function (params) {
    return httpUtil.get('check/order/getOrderDetail', params);
  };

  // 查询运价
  this.queryFreightPrice = function (params) {
    return httpUtil.get('check/shopcart/queryFreightPrice', params);
  };

  // 查询省份
  this.getAllProvince = function (params) {
    return httpUtil.get('check/person/getAllProvince', params);
  };

  // 查询城市
  this.getCityByProvinceCode = function (params) {
    return httpUtil.get('check/person/getCityByProvinceCode', params);
  };

  // 查询区
  this.getDistrictByCityCode = function (params) {
    return httpUtil.get('check/person/getDistrictByCityCode', params);
  };

  // 新增地址
  this.saveAddress = function (params) {
    return httpUtil.post('check/person/saveAddress', params);
  };

  // 查询所有地址地址
  this.findAddressList = function (params) {
    return httpUtil.get('check/person/findAddressList', params);
  };

  // 订单
  this.saveAddress = function (params) {
    return httpUtil.post('check/person/saveAddress', params);
  };

  // 买家确认订单
  this.confirmOrder = function (params) {
    return httpUtil.post('check/order/confirmOrder', params);
  };
  // 买家拒绝订单
  this.cancelOrder = function (params) {
    return httpUtil.post('check/order/cancelOrder', params);
  };

  // 买家撤销订单
  this.cancelUnauditedOrder = function (params) {
    return httpUtil.post('check/order/cancelUnauditedOrder', params);
  };

  // 填写期货订单查询
  this.toWriteFuturesOrder = function (params) {
    return httpUtil.post('check/shopcart/toWriteFuturesOrder', params);
  };

  // 填写期货订单查询
  this.createFuturesOrder = function (params) {
    return httpUtil.post('check/shopcart/createFuturesOrder', params);
  };

  // 下单页面重新查询资源列表
  this.queryOrderDetailList = function (params) {
    return httpUtil.post('check/shopcart/queryOrderDetailList', params);
  };



});
