djEShopApp.config(function ($stateProvider) {

  $stateProvider
    .state('setting', {
      url: '/setting',
      templateUrl: 'templates/modules/mine/setting.html',
      controller: 'SettingCtrl'
    })
    .state('myBalance', {
      url: '/myBalance',
      cache: false,
      templateUrl: 'templates/modules/mine/my-balance.html',
      controller: 'MyBalanceCtrl'
    })

    .state('myEnjoy', {
      url: '/myEnjoy',
      templateUrl: 'templates/modules/mine/my-enjoy.html',
      cache: false,
      controller: 'MyEnjoyCtrl'
    })

    .state('personDetail', {
      url: '/personDetail',
      templateUrl: 'templates/modules/mine/person-detail.html',
      controller: 'PersonCtrl',
      cache: false/*,
       params: {
       personInfo: null,
       mbrList: null
       }*/
    })
    .state('updatePswd', {
      url: '/updatePswd',
      templateUrl: 'templates/modules/mine/update-pswd.html',
      controller: 'UpdatePswdCtrl',
      cache: false,
      params: {
        personInfo: null
      }
    })
    .state('updateMobile', {
      url: '/updateMobile',
      templateUrl: 'templates/modules/mine/update-mobile.html',
      controller: 'UpdateMobileCtrl',
      cache: false,
      params: {
        personInfo: null
      }
    })
    .state('updateEmail', {
      url: '/updateEmail',
      templateUrl: 'templates/modules/mine/update-email.html',
      controller: 'UpdateEmailCtrl',
      cache: false,
      params: {
        personInfo: null
      }
    })
    .state('companyDetail', {
      url: '/companyDetail/:cmpyId/:mbrId',
      templateUrl: 'templates/modules/mine/company-detail.html',
      controller: 'CompanyCtrl'/*,
       cache: false,
       params: {
       mbr: null
       }*/
    })
    .state('company-certify', {
      url: '/companyCertify',
      templateUrl: 'templates/modules/mine/company-certify.html',
      controller: 'CompanyCertifyCtrl'
    })
    .state('my-message', {
      url: '/myMessage',
      templateUrl: 'templates/modules/mine/my-message.html',
      controller: 'MyMessageCtrl',
      cache: false
    })
    .state('setting-accustom', {
      url: '/setting/accustom',
      templateUrl: 'templates/modules/mine/setting-accustom.html',
      controller: 'SettingAccustomCtrl'
    });

});
