var djEShopControllers = angular.module('djEShopApp.controllers', []),
    djEShopServices = angular.module('djEShopApp.services', []),
    djEShopDirectives = angular.module('djEShopApp.directives', []),
    djEShopFilters = angular.module('djEShopApp.filters', []);

var djEShopApp = angular.module('djEShopApp', [
  'ionic',
  'ngCordova',
  'djEShopApp.controllers',
  'djEShopApp.services',
  'djEShopApp.directives',
  'djEShopApp.filters',
  'ionic-native-transitions',
  'ionic-timepicker',
  'ionic-datepicker'
])

    .run(function ($ionicPlatform, $rootScope, $state, $ionicHistory, $ionicNativeTransitions, LoginInfoUtil) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          if (ionic.Platform.isAndroid()) {
            window.StatusBar.overlaysWebView(true);
            window.StatusBar.backgroundColorByHexString("#ff6917");
          } else {
            window.StatusBar.styleLightContent();
          }
          window.StatusBar.show();
        }

        if (navigator.splashscreen) {
          navigator.splashscreen.hide();
        }

        var cannotBackRouters = [
          'tab.home',
          'tab.myConcern',
          'tab.mine'
        ];

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          if (LoginInfoUtil.needLogin(toState.name)) {
            event.preventDefault();
            $ionicNativeTransitions.stateGo('login'/*, {removeBackView: true}*/);
          }
          else if (~cannotBackRouters.indexOf(toState.name)) {
            $ionicHistory.nextViewOptions({
              //disableAnimate: true,
              disableBack: true
            });
          }
        });
      });
    })

    // config initial arguments
    .config(function ($ionicConfigProvider) {
      $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left').previousTitleText(false);
      $ionicConfigProvider.form.checkbox('circle').toggle('large');
      $ionicConfigProvider.tabs.style('standard').position('bottom');
      $ionicConfigProvider.navBar.alignTitle('center');

      //禁用IOS swipe back功能
      $ionicConfigProvider.views.swipeBackEnabled(false);
    })

    // config ionic native transition
    .config(function ($ionicNativeTransitionsProvider) {
      $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 200, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
      });

      $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
      });

      $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
      });
    })

    // config arguments about http
    .config(function ($httpProvider) {
      $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};

      var handleRequestParams = function (paramObj) {
        var query = '', i, name, value, fullSubName, subName, subValue, innerObj;

        for (name in paramObj) {
          value = paramObj[name];

          if (angular.isArray(value)) {
            for (i = 0; i < value.length; i++) {
              subValue = value[i];
              fullSubName = `${name}[${i}]`;
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += handleRequestParams(innerObj) + '&';
            }
          }
          else if (angular.isObject(value)) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = `${name}.${subName}`;
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += handleRequestParams(innerObj) + '&';
            }
          }
          else if (value != null) {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }

        return query.length > 0 ? query.substr(0, query.length - 1) : query;
      };

      $httpProvider.defaults.transformRequest = [function (paramObj) {
        return angular.isObject(paramObj) && String(paramObj) !== '[object File]'
            ? handleRequestParams(paramObj) : paramObj;
      }];
    })

    // config routers of tabs
    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider

          .state('ads', {
            url: '/ads',
            templateUrl: 'templates/modules/advertisement/advertisement.html',
            controller: 'AdsCtrl'
          })

          .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
          })

          .state('tab.home', {
            url: '/home',
            templateUrl: 'templates/modules/home/home.html',
            controller: 'HomeCtrl',
            nativeTransitions: {
              type: "fade",
              duration: 100
            }
          })

          .state('tab.myConcern', {
            url: '/myConcern',
            cache: false,
            templateUrl: 'templates/modules/myConcern/my-concern.html',
            controller: 'MyConcernCtrl',
            nativeTransitions: {
              type: "fade",
              duration: 100
            }
          })

          .state('tab.shopping-cart', {
            url: '/shopping-cart',
            templateUrl: 'templates/modules/shopping-cart/shopping-cart.html',
            controller: 'ShoppingCartCtrl',
            cache: false,
            nativeTransitions: {
              type: "fade",
              duration: 100
            }
          })

          .state('tab.mine', {
            url: '/mine',
            cache: false,
            templateUrl: 'templates/modules/mine/mine.html',
            controller: 'MineCtrl',
            nativeTransitions: {
              type: "fade",
              duration: 100
            }
          });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/ads');

    })

    // config initial arguments of ionic-timepicker
    .config(function (ionicTimePickerProvider) {
      var now = new Date();
      ionicTimePickerProvider.configTimePicker({
        inputTime: ((now.getHours() * 60 * 60) + (now.getMinutes() * 60)),
        format: 24,
        step: 10,
        setLabel: '确定',
        closeLabel: '取消'
      });
    })

    // config initial arguments of ionic-datepicker
    .config(function (ionicDatePickerProvider, ionicTimePickerProvider) {
      ionicDatePickerProvider.configDatePicker({
        setLabel: '确定',
        todayLabel: '今天',
        closeLabel: '取消',
        mondayFirst: false,
        weeksList: ["日", "一", "二", "三", "四", "五", "六"],
        monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        templateType: 'popup',
        showTodayButton: false,
        dateFormat: 'yyyy/MM/dd',
        closeOnSelect: true
      });

      ionicTimePickerProvider.configTimePicker({
        inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
        format: 24,
        step: 10,
        setLabel: '确定',
        closeLabel: '取消'
      });
    });
