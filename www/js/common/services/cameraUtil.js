djEShopServices.service('CameraUtil', function ($ionicPlatform, $cordovaCamera, $rootScope, $ionicPopup) {

  var that = this;

  $ionicPlatform.ready(function () {
    if (!window.Camera) {
      console.warn('Camera plugin is not loaded');
      return;
    }

    var defaults = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 600,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      popoverOptions: CameraPopoverOptions
    };

    var getPictureByCamera = function (option) {
      defaults.sourceType = Camera.PictureSourceType.CAMERA;
      option = angular.extend(defaults, option || {});
      return $cordovaCamera.getPicture(option);
    };

    var getPictureByPhotoLibrary = function (option) {
      defaults.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      option = angular.extend(defaults, option || {});
      return $cordovaCamera.getPicture(option);
    };

    var popup = null,
      scope = $rootScope.$new();

    scope.getPictureByCamera = function () {
      getPictureByCamera(scope.opts).then(function (imageData) {
        var image = 'data:image/jpeg;base64,' + imageData;
        if (angular.isFunction(scope.cb)) {
          scope.cb(image);
        }
      }).finally(popup.close);
    };

    scope.getPictureByPhoneLibrary = function () {
      getPictureByPhotoLibrary(scope.opts).then(function (imageData) {
        var image = 'data:image/jpeg;base64,' + imageData;
        if (angular.isFunction(scope.cb)) {
          scope.cb(image);
        }
      }).finally(popup.close);
    };

    that.show = function (cb, opts) {
      scope.cb = cb;
      scope.opts = opts;

      var tpl = '<div class="list text-center">'
        + '<a class="item" on-tap="getPictureByCamera()">拍照上传</a>'
        + '<a class="item" on-tap="getPictureByPhoneLibrary()">本地上传</a>'
        + '<a class="item" on-tap="closePopup()">关闭</a>'
        + '</div>';

      popup = $ionicPopup.show({
        title: '选择照片',
        scope: scope,
        template: tpl
      });

      scope.closePopup = popup.close;
    };

  });

});
