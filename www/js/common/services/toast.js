djEShopServices
.factory('Toast', [
  '$rootScope',
  '$ionicBody',
  '$compile',
  '$timeout',
function ($rootScope, $ionicBody, $compile, $timeout) {

  var $ = angular.element,
    extend = angular.extend;

  var TOAST_TPL = '<div class="toast-container"><div class="toast-content">{{content}}</div></div>';

  var Toast = {
    show: show,
    _createToast: createToast
  };

  function createToast(options) {
    options = extend({
      scope: null,
      content: '',
      callback: angular.noop,
      duration: 2500
    }, options || {});

    var self = {
      scope: (options.scope || $rootScope).$new(),
      $element: $(TOAST_TPL)
    };

    extend(self.scope, {
      content: options.content
    });

    var phase = self.scope.$root.$$phase;
    if(phase == '$apply' || phase == '$digest'){
      $compile(self.$element.contents())(self.scope);
    }else{
      self.scope.$apply(function () {
        $compile(self.$element.contents())(self.scope);
      });
    }

    self.show = function () {
      $ionicBody.get().appendChild(self.$element[0]);
      $timeout(self.remove, options.duration, false);
    };

    self.remove = function () {
      self.$element.remove();
      self.scope.$destroy();
      (options.callback || angular.noop)();
    };

    return self;
  }

  function show(options, callback) {
    var toast;

    if (angular.isString(options)) {
      options = {
        content: options
      };
    }

    if (angular.isObject(options)) {
      if(!options.content){
        options.content = 'content参数为空';
      }
      if(angular.isFunction(callback)){
        options.callback = callback;
      }
      toast = createToast(options);
    } else {
      toast = createToast({
        content: '传入Toast的参数错误：' + options
      });
    }

    toast.show();
  }

  return Toast;

}]);
