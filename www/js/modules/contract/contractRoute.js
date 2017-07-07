/**
 * Created by rain on 2016/11/7.
 */
djEShopApp.config(function ($stateProvider) {
  $stateProvider
      .state('my-contract', {
        url: 'contract/my-contract',
        controller: 'MyContractCtrl',
        cache:false,
        templateUrl: 'templates/modules/contract/my-contract.html'
      })
      .state('contract-detail', {
        url: 'contract/contract-detail',
        controller: 'ContractDetailCtrl',
        templateUrl: 'templates/modules/contract/contract-detail.html',
        cache:false,
        params:{
          contractId:null
        }
      })

});
