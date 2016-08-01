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

### Options

**totalRecords**: '=', total number of your items  
**pageSize**: '=', maximum records of every page, default 10  
**pageDisplayNumber**: '=', number of pages to display in the pagination list, default 5, page 1 to 5  
**autoReset**: '=', init the pagination at the beginning, usually you should broadcast the event to notify the pagination to initialize, if your data is loaded by ajax, default: false  
**prevText**: '@', set your custom text, html tag supported  
**nextText**: '@'  
**firstText**: '@'  
**lastText**: '@'

### Events

**pageChange**: the directive will `$emit` this event when user click on different a page  
**resetPagination**: you should `$broadcast` this event to notify the directive to reset the pagination ui,
 if the `autoReset` is `false`(default), you also need to broadcast this for the first time(after you load async data),
 otherwise it will initialize the ui at the beginning without emit this event.  
  
### Demo

`npm install`,
Then open `index.html` in `demo` dir
  
### License

**MIT**
