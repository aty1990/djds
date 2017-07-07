/**
 * Created by rain on 2017/4/19.
 */
djEShopServices.service('ContractService', function (httpUtil) {


  // 我的合同分页列表查询
  this.getContractList = function (params) {
    return httpUtil.get('check/contract/getContractList', params);
  };

  // 我的合同分页列表查询
  this.showContractInfo = function (params) {
    return httpUtil.get('check/contract/showContractInfo', params);
  };



});
