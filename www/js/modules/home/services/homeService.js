djEShopServices.service('homeService', function (httpUtil) {

  /*// 获取广告页
  this.getAdvBanners = function () {
    return httpUtil.get('page/banner');
  };

  // 获取综合指数
  this.getIndexOfAll = function () {
    return httpUtil.get('page/pageIndex');
  };

  // 获取品类
  this.getVarieties = function () {
    return httpUtil.get('page/variety');
  };

  // 获取热点
  this.getNews = function () {
    return httpUtil.get('news/hot?typeNo=fn_recommend');
  };*/

  // 首页各种数据一次获取
  this.getHomeData = function (){
    return httpUtil.get('home');
  };

  // 获取 推荐品牌
  this.getFactoryRecommendDetail= function (){
    return httpUtil.get('home/factoryRecommendDetail');
  };

  // 获取 优质资源
  this.getRecommends= function (){
    return httpUtil.get('home/getRecommends');
  };

    // 获取 小二数据
    this.getXiaoerData= function (){
        return httpUtil.get('home/getXiaoerData');
    };
 
});
