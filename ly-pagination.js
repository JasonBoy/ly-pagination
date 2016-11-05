/*!
 * @license MIT
 * Simple Angular Pagination Directive,
 * https://github.com/JasonBoy/ly-pagination
 */

;!(function (window, angular) {
  'use strict';
  var pagination = angular.module('lyPagination', []);
  var template = '<ul class="pagination ly-pagination">' +
      '<li>' +
      '<a href="" ng-click="goto(1)">' +
      '<span aria-hidden="true" ng-bind-html="trustHtml(firstText)"></span>' +
      '</a>' +
      '</li>' +
      '<li>' +
      '<a href="" aria-label="Previous" ng-click="prev()">' +
      '<span aria-hidden="true" ng-bind-html="trustHtml(prevText)"></span>' +
      '</a>' +
      '</li>' +
      '<li ng-show="inTheEnd">' +
      '<a href="" ng-click="goto(1)">1</a>' +
      '</li>' +
      '<li ng-show="inTheEnd && !hidePageTwo">' +
      '<a href="" ng-click="goto(2)">2</a>' +
      '</li>' +
      '<li ng-show="inTheEnd"><a href="">...</a></li>' +
      '<li ng-class="{active: currentPage === p}" ng-repeat="p in pages">' +
      '<a href="" ng-click="goto(p)">{{ p }}</a>' +
      '</li>' +
      '<li ng-show="outOfRange"><a href="">...</a></li>' +
      '<li ng-show="outOfRange">' +
      '<a href="" ng-click="goto(totalPages)">{{ totalPages }}</a>' +
      '</li>' +
      '<li>' +
      '<a href="" aria-label="Next" ng-click="next()">' +
      '<span aria-hidden="true" ng-bind-html="trustHtml(nextText)"></span>' +
      '</a>' +
      '</li>' +
      '<li>' +
      '<a href="" ng-click="goto(totalPages)">' +
      '<span aria-hidden="true" ng-bind-html="trustHtml(lastText)"></span>' +
      '</a>' +
      '</li>' +
      '</ul>';

  pagination.provider('lyPaginationConfig', function () {
    this.buttonTexts = {
      prevText: '&lt;',
      nextText: '&gt;',
      firstText: '&laquo;',
      lastText: '&raquo;'
    };

    this.setCustomButtonText = function(textObject) {
      for(var key in textObject) {
        if(textObject.hasOwnProperty(key) && !!textObject[key]) {
          this.buttonTexts[key] = textObject[key];
        }
      }
    };

    this.$get = function() {
      return this;
    };
  });

  pagination.directive('lyPagination', function () {
    return {
      restrict: 'EA',
      scope: {
        totalRecords: '=', //total records number
        pageSize: '=', //maximum records of every page
        pageDisplayNumber: '=', //number of pages to display in the pagination list
        autoReset: '=', //init the pagination at the beginning,
        // usually you should broadcast the event to notify the pagination to initialize
        // if your data is loaded by ajax
        prevText: '@', //set your custom text, html tag supported
        nextText: '@',
        firstText: '@',
        lastText: '@',
        name: '@', //will be prefixed to events to solve multi pagination within one page
        hideFirst: '=' //hide the 1-2 page button when user is in large pages ( which is > 3)
      },
      replace: true,
      template: template,
      controller: ['$scope', '$sce', 'lyPaginationConfig', function ($scope, $sce, lyPaginationConfig) {
        var leftPageNumber = $scope.pageDisplayNumber ? $scope.pageDisplayNumber : 5;
        var _name = $scope.name || '';
        var texts = lyPaginationConfig.buttonTexts;
        $scope.prevText = $scope.prevText || texts.prevText;
        $scope.nextText = $scope.nextText || texts.nextText;
        $scope.firstText = $scope.firstText || texts.firstText;
        $scope.lastText = $scope.lastText || texts.lastText;
        $scope.pages = [];

        $scope.trustHtml = function (input) {
          return $sce.trustAsHtml(input);
        };
        $scope.prev = function () {
          if ($scope.currentPage - 1 < 1) return;
          $scope.currentPage--;
          genPages();
        };
        $scope.next = function () {
          if ($scope.currentPage + 1 > $scope.totalPages) return;
          $scope.currentPage++;
          genPages();
        };
        $scope.goto = function (page) {
          if (page === $scope.currentPage) return;
          $scope.currentPage = page;
          genPages();
        };
        var _prefix = (_name ? (_name + '_') : '');
        var _resetEvent =  _prefix + 'resetPagination';
        var _changeEvent = _prefix + 'pageChange';

        $scope.$on(_resetEvent, function (event, totalRecords, pageSize) {
          $scope.totalRecords = totalRecords;
          pageSize = pageSize || event.targetScope.pageSize;
          recal(true, pageSize);
        });

        $scope.autoReset && recal();

        function recal(reset, pageSize) {
          var ps = pageSize || ($scope.pageSize ? $scope.pageSize : 10);
          $scope.totalPages = Math.ceil($scope.totalRecords / ps);
          $scope.currentPage = 1;
          genPages(reset);
        }

        function genPages(reset) {
          reset = !!reset;
          reset || $scope.$emit(_changeEvent, $scope.currentPage);
          var pages = $scope.pages;
          var cp = $scope.currentPage;
          if (!reset
              && pages.length > 0
              && includes(pages, cp)
              && pages[0] != cp
              && pages[pages.length - 1] != cp) {
            return;
          }
          $scope.pages = [];
          var total = $scope.totalPages;
          var middle = Math.ceil(leftPageNumber / 2);
          var comparator = cp >= middle ? middle : leftPageNumber;
          for (var i = -1 * (middle - 1); i < comparator; i++) {
            var t = cp + i;
            if (t <= 0) continue;
            if (t > total || $scope.pages.length >= leftPageNumber) break;
            $scope.pages.push(t);
          }
          $scope.outOfRange = !!($scope.pages[$scope.pages.length - 1] < $scope.totalPages
          || !includes($scope.pages, $scope.totalPages));
          var tempPages = $scope.pages;
          if (tempPages.length < leftPageNumber) {
            var remaining = leftPageNumber - tempPages.length;
            for (var ii = 0; ii < remaining; ii++) {
              if (tempPages[0] > 1) {
                tempPages.unshift(tempPages[0] - 1);
              }
            }
          }
          if (!$scope.hideFirst && cp > 3 && $scope.totalPages > leftPageNumber) {
            if(tempPages[0] >= 2) {
              $scope.inTheEnd = true;
              $scope.hidePageTwo = tempPages[0] === 2;
            } else {
              $scope.inTheEnd = false;
            }
          } else {
            $scope.inTheEnd = false;
          }
        }
      }]
    };
  });

  /**
   * simple Array.indexOf implementation, to support the freaking IE8
   * @param array
   * @param value
   * @returns {boolean}
   */
  function includes(array, value) {
    if(!array || array.length <= 0) return false;
    for(var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if(item == value) return true;
    }
    return false;
  }
})(window, window.angular);
