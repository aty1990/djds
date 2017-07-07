djEShopControllers.controller('AdsCtrl', function ($scope, $timeout, $ionicNativeTransitions, $ionicHistory) {

  var timeoutId;

  $scope.slideHasChanged = function (index) {
    if (index === 2) {
      timeoutId = $timeout(function () {
        $ionicNativeTransitions.stateGo('tab.home');
      }, 1499, false);
    } else {
      if (timeoutId) {
        $timeout.cancel(timeoutId);
      }
    }
  };

  $ionicHistory.nextViewOptions({
    /*disableAnimate: true,
    disableBack: true,*/
    historyRoot: true
  });

});