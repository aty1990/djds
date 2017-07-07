djEShopServices.service('ValidateUtil', function (Toast) {

  var phoneNumberReg = /[0-9]{11}/;
  var passwordReg = /[0-9|A-z]{6,20}/;
  var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

  this.isPhoneNumber = function (phoneNumber) {
    return phoneNumberReg.test(phoneNumber || '');
  };

  this.isPassword = function (password) {
    return passwordReg.test(password || '');
  };

  this.isEmail = function (email) {
    return emailReg.test(email || '');
  };

  /**
   * 检查一个对象中的 必填项
   * @param item 被检查的对象
   * @param rules 检查规则  [{param: 'vehicleId', message: '请选择车船'}]  parem:属性名; message:错误提示消息
   * @returns {boolean}  true 通过,  false 不通过
   */
  this.validateRequire = function (item, rules) {
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (!item[rule.param]) {
        Toast.show(rule.message);
        return false;
      }
    }
    return true;
  };

  /**
   * 验证form
   * @param val
   * @param text
   * @returns {boolean}
   */
  this.validateForm = function (val, text) {
    if (val == null || val == '') {
      Toast.show(text);
      return false;
    }
    return true;
  }
});
