jQuery excelPreview Plugin (https://github.com/sumile-ting/excel-preview)
==========================

选择一个excel文件，将所选得excel表格展示在页面上

Install excel-preview and dependencies
=====================================
```bash
npm install excel-preview --save
```

Include jquery and table2excel in your page
------------------------------------------
```html
<script src="node_modules/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap-table/dist/bootstrap-table.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js" type="text/javascript"></script>
<script src="node_modules/xlsx-style/dist/xlsx.full.min.js" type="text/javascript"></script>
<script src="js/dist/excel-preview.min.js"></script>
<link rel="stylesheet" href="css/excel-preview.css">
```

Using the plugin
================
```html
<input type="file" name="file">
<div id="yourExcelTable"></div>
```

```javascript
$("#yourExcelTable").excelPreview({});
```

[index.html](https://github.com/sumile-ting/excel-preview/blob/master/index.html)

Contains a simple HTML file to demonstrate the plugin.

[dist/](https://github.com/sumile-ting/excel-preview/tree/master/js/dist)
This is where the generated files are stored once gulp runs.

[gulpfile.js](https://github.com/sumile-ting/excel-preview/blob/master/gulpfile.js)
Contains all automated tasks using fulp.


[package.json](https://github.com/sumile-ting/excel-preview/blob/master/package.json)
Specify all dependencies loaded via Node.JS.

Check NPM for more details.

License
=======
MIT License
