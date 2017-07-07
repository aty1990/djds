/**
 * Created by rain on 2016/11/7.
 */
djEShopServices.service('MyConcernService', function (httpUtil) {

  // 获取关注列表
  this.getConcernList = function (params){
    return httpUtil.get('check/concern/getConcernList',params);
  };

  // 清空关注
  this.clearConcern = function (){
    return httpUtil.post('check/concern/deleteAllSpotConcern');
  };

  // 取消单个关注
  this.cancelConcernSingle = function (params) {
    return httpUtil.post('check/concern/deleteSpotConcern', params);
  };

});
