/**
 * Created by rain on 2016/11/7.
 */
djEShopServices.service('ResService', function (httpUtil, LoginInfoUtil) {

  // 获取城市和品名列表
  this.getQuoCityAndBrand = function (){
    return httpUtil.get('listingRes/getQuoCityAndBrand');
  };

  //资源列表
  this.loadRes = function (params) {

    if(LoginInfoUtil.isExpired()){//尚未登录
      return httpUtil.get("listingRes/getResList", params);
    }else{//已经登录【主要涉及到已关注和已加入购物车资源】
      return httpUtil.get("check/concern/getLoginResList", params);
    }

  }

  // 获取 筛选版面属性
  this.getSearchPanel = function (params) {
    return httpUtil.get('listingRes/getSearchPanel', params);
  };

  // 关注
  this.addCollection = function (params) {
    return httpUtil.post('check/concern/addCollection', params);
  };

  // 取消关注
  this.cancelConcern = function (params) {
    return httpUtil.post('check/concern/cancelConcern', params);
  };


  // 购物车分页查询
  this.getShopcartList = function (params) {
    return httpUtil.get('check/shopcart/getShopcartList', params);
  };

  // 更新购物车信息
  this.updateShopcartWeight = function (params) {
    return httpUtil.post('check/shopcart/updateShopcartWeight', params);
  };

  // 查询购物车数量
  this.shocartNum = function (params) {
    return httpUtil.get('check/shopcart/shocartNum', params);
  };

  // 清空购物车
  this.cleanShopcart = function (params) {
    return httpUtil.post('check/shopcart/cleanShopcart', params);
  };

  // 订货品类品名查询
  this.getVarietyBrand = function (params) {
    return httpUtil.get('check/futures/getVarietyBrand', params);
  };

  // 订货产地查询
  this.getPlacesteelList = function (params) {
    return httpUtil.get('check/futures/getPlacesteelList', params);
  };

  // 订货材质查询
  this.getTextureList = function (params) {
    return httpUtil.get('check/futures/getTextureList', params);
  };

  // 添加到购物车
  this.saveToShopcart = function (params) {
    return httpUtil.post('check/shopcart/saveToShopcart', params);
  };

  // 删除购物车
  this.deleteShopcartById = function (params) {
    return httpUtil.post('check/shopcart/deleteShopcartById', params);
  };

});
