/**
 * 账户信息模块 service
 * Created by rain on 2016/9/18.
 */
djEShopServices.service('PersonService', function (httpUtil) {

  // 修改密码
  this.changePassword = function (params) {
    return httpUtil.post("check/person/changePassword", params);
  };

  // 获取修改手机号码验证码
  this.getValidateCodeForChangePhoneNumber = function (phoneNumber) {
    return httpUtil.post('check/person/getCaptchasCode4ModifyCellphone', {cellphone: phoneNumber});
  };

  // 修改手机号码
  this.changePhoneNumber = function (phoneNumber, validateCode) {
    return httpUtil.post('check/person/modifyCellphone', {
      cellphone: phoneNumber,
      captchasCode: validateCode
    });
  };

  // 获取修改邮箱的邮件
  this.getEmailForChangeEmail = function (email) {
    return httpUtil.post('check/person/getCaptchasCode4ModifyEmail', {email: email});
  };

  // 修改邮箱
  this.changeEmail = function (email, validateCode) {
    return httpUtil.post('check/person/modifyEmail', {
      email: email,
      captchasCode: validateCode
    });
  };

  // 获取认证企业信息
  this.getCompanyInfo = function (cmpyId) {
    return httpUtil.get('check/person/getCmpyInfo', {cmpyId: cmpyId})
  };

  // 设置默认的企业会员
  this.saveDefaultCompany = function (mbrId) {
    return httpUtil.post('check/person/saveDefaultMbr', {mbrId: mbrId});
  };

  // 我的优惠
  this.getShowDiscountInfo = function (){
    return httpUtil.get('check/person/showDiscountInfo');
  }

  //SAP可用余额
  this.getCustomerBalance= function (){
    return httpUtil.get('check/person/getCustomerBalance');
  };

});
