jQuery excelPreview Plugin (https://github.com/sumile-ting/excel-preview)
==========================

选择一个excel文件，将所选得excel表格展示在页面上

Install excel-preview and dependencies
=====================================
```bash
npm install excel-preview --save
```

Include jquery and excel-preview in your page
------------------------------------------
```html
<script src="node_modules/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap-table/dist/bootstrap-table.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap-fileinput/js/fileinput.min.js" type="text/javascript"></script>
<script src="node_modules/bootstrap-fileinput/js/locales/zh.js" type="text/javascript"></script>
<script src="node_modules/xlsx-style/dist/xlsx.full.min.js" type="text/javascript"></script>
<script src="js/dist/excel-preview.min.js"></script>
<link rel="stylesheet" href="node_modules/bootstrap-table/dist/bootstrap-table.min.css">
<link href="node_modules/bootstrap-fileinput/css/fileinput.min.css"  rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="css/excel-preview.css">
```

Using the plugin
================
```html
<input type="file" name="file">
<div id="yourExcelTable"></div>
<div id="kartik-file-errors"></div> /** error message*/
```

```javascript
$("#yourExcelTable").excelPreview({});
```

Using the plugin in webpack
===========================
you should include these codes in your entry.
```
    import '../node_modules/bootstrap/dist/js/bootstrap.min';
    import 'bootstrap-table';
    import 'bootstrap-fileinput';
    import '../node_modules/excel-preview/js/dist/excel-preview.min';
```
include below codes in webpack.config
```

        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery'
        })
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
