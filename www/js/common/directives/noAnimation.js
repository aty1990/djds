djEShopDirectives.directive('noAnimation', function ($animate) {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $animate.enabled(element, false);
    }
  };

});