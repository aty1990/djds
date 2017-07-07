djEShopApp.config(function ($stateProvider) {

  $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/modules/privilege/login.html',
        controller: 'LoginCtrl',
        cache: false,
        params: {
          removeBackView: null
        }
      })

      .state('register', {
        url: '/register',
        templateUrl: 'templates/modules/privilege/register.html',
        controller: 'RegisterCtrl',
        cache: false
      })

      .state('findPassword', {
        url: '/find-password',
        templateUrl: 'templates/modules/privilege/find-password.html',
        controller: 'FindPasswordCtrl',
        cache: false
      });
});