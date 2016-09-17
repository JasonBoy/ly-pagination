# ly-pagination
Simple Angular pagination directive

### Usage

`npm install ly-pagination --save`

In CommonJS environment:
`angular.module('yourApp', [require('ly-pagination')])`,
or in normal html, just load `ly-pagination.min.js` script in your html.  
Then in your page, add the tag in your html:
```
<ly-pagination total-records="totalRecords"
               page-size="pageSize"
               auto-reset="autoReset"
</ly-pagination>
```
[![ly-pagination-ui](https://github.com/JasonBoy/ly-pagination/blob/master/demo/img.png)](https://github.com/JasonBoy/ly-pagination/blob/master/demo/img.png)

### Global Config  
With 1.0.10+, you can config the button text(first, previous, next, last) with the `lyPaginationConfigProvider` without passing your custom text to directive every time.

```javascript
angular.module('demo', ['lyPagination'])
    .config(['lyPaginationConfigProvider', function(lyPaginationConfigProvider) {
      lyPaginationConfigProvider.setCustomButtonText({
        prevText: 'previous',
        nextText: 'next',
        firstText: 'first',
        lastText: 'last'
      });
    }])
    .controller('ctrl', function(){...});
```

### Options

**totalRecords**: '=', total number of your items  
**pageSize**: '=', maximum records of every page, default 10  
**pageDisplayNumber**: '=', number of pages to display in the pagination list, default 5, page 1 to 5  
**autoReset**: '=', init the pagination at the beginning, usually you should broadcast the event to notify the pagination to initialize, if your data is loaded by ajax, default: false  
**prevText**: '@', set your custom text, html tag supported  
**nextText**: '@'  
**firstText**: '@'  
**lastText**: '@'
**hideFirst**: '=', hide the 1-2 page button when user is in large pages ( which is > 3), default: false

### Events

**pageChange**: the directive will `$emit` this event when user click on different a page  
**resetPagination**: you should `$broadcast` this event to notify the directive to reset the pagination ui,
 if the `autoReset` is `false`(default), you also need to broadcast this for the first time(after you load async data),
 otherwise it will initialize the ui at the beginning without emit this event.
  `$scope.$broadcast('resetPagination', totalRecords, newPageSize);`

### Demo

`npm install`,
Then open `index.html` in `demo` dir

### License

**MIT**
