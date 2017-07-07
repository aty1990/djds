/**
 * Created by aty on 2017/5/27
 */
djEShopApp.config(function ($stateProvider) {
    $stateProvider.state('info', {
        url: 'information/info',
        controller: 'InfoCtrl',
        templateUrl: 'templates/modules/information/information.html',
        cache:false
        /*params:{
            query:{}
        }*/
    })
});