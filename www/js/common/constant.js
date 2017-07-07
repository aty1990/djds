var server = 'http://djec.hngangxin.com';  // 测试环境 ??
// var server = 'http://www.gangxiaoer.com';  // 正式环境
// var server = 'http://ecdev.hngangxin.com';  // 开发dev 环境
//var server = 'http://172.16.17.197:8080';     // 高老板机器
// var server = 'http://127.0.0.1:9080';
//  var server = 'http://172.16.17.161:8090';   // 侯工机器

djEShopApp
  .constant('SERVER_URL', server)
  .constant('SERVER_API_URL', server + '/api/1.0/')
  .constant('PAGE_SIZE', 10);
