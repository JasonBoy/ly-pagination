
angular.module('demo', ['lyTable', 'lyPagination'])
    .controller('Demo', function($scope) {
      $scope.columns = [
        {
          field: 'name',
          name: 'Username',
          formatter: simpleFormatter
        },
        {
          field: 'age',
          name: 'Age',
          formatter: simpleFormatter
        },
        {
          field: 'address',
          name: 'Address',
          autoEscape: true,
          formatter: simpleFormatter,
          cssClass: 'text-center',
          headCssClass: 'text-center',
          testClick: function(rowData, rowindex, columnindex) {
            console.log(arguments);
          }
        }
      ];
      var temps = [];
      for(var i = 1; i< 133; i++) {
        var temp = {
          name: 'jason',
          age: i,
          address: '<p>shanghai china 2</p>'
        };
        temps.push(temp);
      }
      $scope.data = temps.slice(0, 10);
      $scope.prevText = 'prev';
      $scope.nextText = 'next';
      $scope.totalRecords = temps.length;
      $scope.pageSize = 5;
      $scope.currentPage = 1;
      $scope.autoReset = true;
      $scope.hideFirst = false;
      $scope.pageDisplayNumber = 5;
      $scope.$broadcast('resetPagination', $scope.totalRecords);
      $scope.$on('pageChange', function (e, currentPage) {
        $scope.currentPage = currentPage;
        var startIndex = (currentPage - 1) * $scope.pageSize;
        var endIndex = startIndex + $scope.pageSize;
        $scope.data = temps.slice(startIndex, endIndex);
      });
      $scope.postInit = function(ele) {
        console.log('postInit');
      };

      function simpleFormatter(fieldData, rowData, columnDefinition) {
        return fieldData;
      }
    });
