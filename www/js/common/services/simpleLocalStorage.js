djEShopServices.service('SimpleLocalStorage', function () {

  var SEARCH_PLACE_STEEL_KEY = 'search_place_steel_key';
  var SEARCH_TEXTURE_KEY = 'search_texture_key';

  this.set = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };

  this.get = function (key) {
    return JSON.parse(localStorage.getItem(key));
  };

  this.rm = function (key) {
    localStorage.removeItem(key);
  };

  /**
   * 缓存: 产地
   * @param item
   */
  this.setPlaceSteelStorage = function (item){
    if(item && item.placesteelName){
      var keyArr = this.getPlaceSteelStorage() || [];
      if (keyArr.length > 0) {
        var isAdd = true;
        for (var i = 0; i < keyArr.length; i++) {
          if (keyArr[i].placesteelName == item.placesteelName) {
            isAdd = false;   // 重复不添加
            break;
          }
        }
        if (isAdd) keyArr.unshift(item);
      } else {
        // 第一个
        keyArr[0] = item;
      }

      // 只保存最多8个
      if(keyArr.length > 8){
        keyArr.length = 8;
      }
      this.set(SEARCH_PLACE_STEEL_KEY, keyArr);
    }
  };
  this.getPlaceSteelStorage = function (){
    return this.get(SEARCH_PLACE_STEEL_KEY);
  };
  this.clearPlaceSteelStorage = function (){
    this.rm(SEARCH_PLACE_STEEL_KEY);
  };




  /**
   * 缓存: 材质
   * @param item
   */
  this.setTextureStorage = function (item){
    if(item && item.textureName){
      var keyArr = this.getTextureStorage() || [];
      if (keyArr.length > 0) {
        var isAdd = true;
        for (var i = 0; i < keyArr.length; i++) {
          if (keyArr[i].textureName == item.textureName) {
            isAdd = false;   // 重复不添加
            break;
          }
        }
        if (isAdd) keyArr.unshift(item);
      } else {
        // 第一个
        keyArr[0] = item;
      }

      // 只保存最多8个
      if(keyArr.length > 8){
        keyArr.length = 8;
      }
      this.set(SEARCH_TEXTURE_KEY, keyArr);
    }
  };
  this.getTextureStorage = function (){
    return this.get(SEARCH_TEXTURE_KEY);
  };
  this.clearTextureStorage = function (){
    this.rm(SEARCH_TEXTURE_KEY);
  };

});