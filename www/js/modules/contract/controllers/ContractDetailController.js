/**
 * Created by rain on 2016/11/7.
 */
djEShopControllers.controller('ContractDetailCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicActionSheet, $stateParams, ContractService) {

  /**
   * 查看明细
   */
  ContractService.showContractInfo({contractId:$stateParams.contractId}).then((result) => {
    $scope.contractInfo = result;
  })




});
