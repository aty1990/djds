djEShopDirectives.directive('adjustResize', function ($timeout) {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      //if (element[0].tagName == "ION-CONTENT") {
        var oldBottom = window.getComputedStyle(element[0], null).bottom;

        window.addEventListener('native.keyboardshow', function (event) {
          element[0].style.bottom = event.keyboardHeight + 'px';
        });

        window.addEventListener('native.keyboardhide', function (event) {
          $timeout(function () {
            element[0].style.bottom = oldBottom;
          }, 300, false);
        });
      // } else {
      //   console.error('合法的标签名只能是: ION-CONTENT, 而当前指令的标签名是: ' + element[0].tagName);
      // }
    }
  };

});