gular.module('WindowShop.orders').
controller('OrderDocumentController', ['$scope', '$window', '$http', '$mdDialog', 'HttpUtils', 'DateUtils', 'PaginationUtils', 'StringUtils', 'SessionStorage', 'FileSaver', 'InteractionsUtils', 'ErrorUtils', function($scope, $window, $http, $mdDialog, HttpUtils, DateUtils, PaginationUtils, StringUtils, SessionStorage, FileSaver, InteractionsUtils, ErrorUtils) {
​
    // ===================================================================================
    // register functions
    // ===================================================================================
    $scope.httpRequests = $http.pendingRequests;
    $scope.downloadOrderDocument = downloadOrderDocument;
    $scope.openOrderAsCart = openOrderAsCart;
    $scope.showDocumentDetails = showDocumentDetails;
    $scope.duplicateDocument = duplicateDocument;
    $scope.loadData = loadData;
    $scope.saveDocumentAsOffer = saveDocumentAsOffer;
    $scope.saveDocumentAsOrder = saveDocumentAsOrder;
    $scope.pageNumber = 0;
    $scope.closeDialog = closeDialog;
​
    $scope.translations = {
      OFFER: "${commonsTranslations['OFFER']}",
      CLIENT_ORDER: "${commonsTranslations['CLIENT_ORDER']}",
      OFFER_short: "${commonsTranslations['OFFER_short']}",
      CLIENT_ORDER_short: "${commonsTranslations['CLIENT_ORDER_short']}",
    };
​
    // ===================================================================================
    // run methods
    // ===================================================================================
    loadOrderDocuments();
​
    // ===================================================================================
    // load orders data
    // ===================================================================================
​
    function showDocumentDetails(document) {
      document.displayDetails = !document.displayDetails;
      if(document.displayDetails) {
        document.clonedDocument = {};
        document.clonedDocument.clientName = document.clientName;
        document.clonedDocument.firstName = document.firstName;
        document.clonedDocument.lastName = document.lastName;
        document.clonedDocument.email = document.email;
        document.clonedDocument.phone = document.phone;
        document.clonedDocument.address = document.address;
        document.clonedDocument.aptNumber = document.aptNumber;
        document.clonedDocument.postCode = document.postCode;
        document.clonedDocument.city = document.city;
      }
    }
​
    function duplicateDocument(document, clonedDocument) {
      var request = {
          uuid: document.uuid,
          update: true,
          documentType: 'CLIENT_ORDER',
          clientName: clonedDocument.clientName,
          email: clonedDocument.email,
          phone: clonedDocument.phone,
          firstName: clonedDocument.firstName,
          lastName: clonedDocument.lastName,
          address: clonedDocument.address,
          aptNumber: clonedDocument.aptNumber,
          postCode: clonedDocument.postCode,
          city: clonedDocument.city,
      };
      var requestPromise = HttpUtils.prepareHttpPut('/order/duplicate', request, SessionStorage.getSessionId(), SessionStorage.getToken(), "${commonsTranslations['ServerBusyTitle']}", "${commonsTranslations['ServerBusyMessage']}", 'page=' + $scope.pageNumber + '&size=' + 10 + '&sort=id,desc');
      requestPromise.then(
          function(answer) {
            $scope.itemsData = answer.data.content;
            for(var index = 0; index < $scope.itemsData.length; index++) {
              var item = $scope.itemsData[index];
              item.addDateTime = DateUtils.formatDate(item.addDateTime);
              item.displayDetails = false;
            }
            $scope.totalPages = answer.data.totalPages;
            $scope.pages = PaginationUtils.getPaginationArray($scope.pageNumber, answer.data.totalPages);
            // display message
            displaySnackMessage('INFO', "${commonsTranslations['DocumentWasSaved']}");
          },
          function(error) {
            ErrorUtils.handleRequestError(error);
          }
      );
    }
​
    function saveDocumentAsOffer(document, clonedDocument) {
      var request = {
          uuid: document.uuid,
          documentType: 'OFFER',
          clientName: clonedDocument.clientName,
          email: clonedDocument.email,
          phone: clonedDocument.phone,
          firstName: clonedDocument.firstName,
          lastName: clonedDocument.lastName,
          address: clonedDocument.address,
          aptNumber: clonedDocument.aptNumber,
          postCode: clonedDocument.postCode,
          city: clonedDocument.city,
      };
      var requestPromise = HttpUtils.prepareHttpPut('/order/update', request, SessionStorage.getSessionId(), SessionStorage.getToken(), "${commonsTranslations['ServerBusyTitle']}", "${commonsTranslations['ServerBusyMessage']}", 'page=' + $scope.pageNumber + '&size=' + 10 + '&sort=id,desc');
      requestPromise.then(
          function(answer) {
            $scope.itemsData = answer.data.content;
            for(var index = 0; index < $scope.itemsData.length; index++) {
              var item = $scope.itemsData[index];
              item.addDateTime = DateUtils.formatDate(item.addDateTime);
              item.displayDetails = false;
            }
            $scope.totalPages = answer.data.totalPages;
            $scope.pages = PaginationUtils.getPaginationArray($scope.pageNumber, answer.data.totalPages);
            // display message
            displaySnackMessage('INFO', "${commonsTranslations['DocumentWasSaved']}");
          },
          function(error) {
            ErrorUtils.handleRequestError(error);
          }
      );
    }
​
    function saveDocumentAsOrder(document, clonedDocument) {
      var request = {
          uuid: document.uuid,
          documentType: 'CLIENT_ORDER',
          clientName: clonedDocument.clientName,
          email: clonedDocument.email,
          phone: clonedDocument.phone,
          firstName: clonedDocument.firstName,
          lastName: clonedDocument.lastName,
          address: clonedDocument.address,
          aptNumber: clonedDocument.aptNumber,
          postCode: clonedDocument.postCode,
          city: clonedDocument.city,
      };
      var requestPromise = HttpUtils.prepareHttpPut('/order/duplicate', request, SessionStorage.getSessionId(), SessionStorage.getToken(), "${commonsTranslations['ServerBusyTitle']}", "${commonsTranslations['ServerBusyMessage']}", 'page=' + $scope.pageNumber + '&size=' + 10 + '&sort=id,desc');
      requestPromise.then(
          function(answer) {
            $scope.itemsData = answer.data.content;
            for(var index = 0; index < $scope.itemsData.length; index++) {
              var item = $scope.itemsData[index];
              item.addDateTime = DateUtils.formatDate(item.addDateTime);
              item.displayDetails = false;
            }
            $scope.totalPages = answer.data.totalPages;
            $scope.pages = PaginationUtils.getPaginationArray($scope.pageNumber, answer.data.totalPages);
            // display message
            displaySnackMessage('INFO', "${commonsTranslations['DocumentWasSaved']}");
          },
          function(error) {
            ErrorUtils.handleRequestError(error);
          }
      );
    }
​
    function loadOrderDocuments() {
        loadData(0);
    }
​
    function loadData(pageNumber) {
      $scope.pageNumber = pageNumber;
      if ($scope.pageNumber == undefined) {
          $scope.pageNumber = 0;
      }
      var promise = HttpUtils.prepareHttpGet('/order', 'page=' + $scope.pageNumber + '&size=' + 10 + '&sort=id,desc', SessionStorage.getSessionId(), SessionStorage.getToken(), "${commonsTranslations['ServerBusyTitle']}", "${commonsTranslations['ServerBusyMessage']}");
      promise.then(
          function(answer) {
              $scope.itemsData = answer.data.content;
              for(var index = 0; index < $scope.itemsData.length; index++) {
                var item = $scope.itemsData[index];
                item.addDateTime = DateUtils.formatDate(item.addDateTime);
                item.downloadUrl = "/secure/${dealer.accessUrl}/document?access_token=" +  SessionStorage.getToken() + "&doc_id=" + item.uuid;
                item.displayDetails = false;
              }
              $scope.totalPages = answer.data.totalPages;
              $scope.pages = PaginationUtils.getPaginationArray($scope.pageNumber, answer.data.totalPages);
          },
          function(error) {
            ErrorUtils.handleRequestError(error);
          }
      );
    }
​
    // ===================================================================================
    // user actions
    // ===================================================================================
​
    function downloadOrderDocument(order) {
      var request = {
          uuid: order.uuid
      };
      // display dialog
      $mdDialog.show(
        {
          template:
          '<md-dialog aria-label="${commonsTranslations['DownloadDocument']}">' +
          '<md-dialog-content class="md-dialog-content">' +
          ' <h2 class="md-title">${commonsTranslations['DownloadDocument']}</h2>' +
         '  <div layout="column" style="padding-top: 20px;">' +
         '    <md-input-container class="md-block" flex-gt-sm>' +
         '        <label>${commonsTranslations['Language']}</label>' +
         '        <md-select ng-model="request.language">' +
         '          <md-option ng-repeat="language in languages" value="{{ language }}">' +
         '            {{ language }}' +
         '        </md-select>' +
         '          </md-option>' +
         '      </md-input-container>' +
         '  </div>' +
         ' </md-dialog-content>' +
         '    <md-dialog-actions>' +
         '       <md-button ng-click="closeDialog()" class="md-primary">${commonsTranslations['Cancel']}</md-button>' +
         '       <md-button ng-click="doDownloadOrderDocument()" class="md-primary">${commonsTranslations['Download']}</md-button>' +
         '    </md-dialog-actions>' +
         '</md-dialog>',
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
          controller: function($scope) {
​
            $scope.doDownloadOrderDocument = doDownloadOrderDocument;
            $scope.request = request;
            $scope.languages = ['PL', 'DE', 'FR', 'EN'];
            function doDownloadOrderDocument() {
              var requestPromise = HttpUtils.prepareHttpDownload('/order/download', request, SessionStorage.getSessionId(), SessionStorage.getToken(), "${commonsTranslations['ServerBusyTitle']}", "${commonsTranslations['ServerBusyMessage']}");
              requestPromise.then(
                  function(response) {
                      var blob = new Blob([response.data], {
                          type: 'application/pdf'
                      });
                      FileSaver.saveAs(blob, getSavedOrderPdfFileName(order.clientName, order.email));
                  }
              );
            }
         },
      });
    }
​
    function closeDialog() {
      $mdDialog.cancel();
    }
​
    function openOrderAsCart(order) {
      var request = {
          uuid: order.uuid
      };
      var requestPromise = HttpUtils.prepareHttpPut('/cart/restore', request, SessionStorage.getSessionId(), SessionStorage.getToken(), "${commonsTranslations['ServerBusyTitle']}", "${commonsTranslations['ServerBusyMessage']}");
      requestPromise.then(
        function(answer) {
            $window.location.href = '/${urls['cart']}';
        },
        function(error) {
          ErrorUtils.handleRequestError(error);
        }
      );
    }
​
    // ===================================================================================
    // helper functions
    // ===================================================================================
​
    function getSavedOrderPdfFileName(clientName, email) {
        var date = new Date();
        if (StringUtils.isNullOrEmpty(clientName)) {
            return email + '_' + DateUtils.formatDate(date) + '.pdf';
        }
        return clientName + '_' + DateUtils.formatDate(date) + '.pdf';
    }
​
}]);