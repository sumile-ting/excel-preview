!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';

    // Default options
    var pluginName = "excelPreview",

        defaults = {
            height: 500
        };

    // Constructor, initialise everything you need here
    var Plugin = function (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        defaults = this.settings;
        this.init();
    };

    // Plugin methods and shared properties
    Plugin.prototype = {
        // Reset constructor - http://goo.gl/EcWdiy
        constructor: Plugin,

        init: function () {
            var e = this;
            $(e.element).prev('input[type=file]').fileinput({
                language: 'zh',
                showUpload: false,
                dropZoneEnabled: false,
                hideThumbnailContent: true,
                showPreview: false,
                allowedFileExtensions: ['xlsx'],
                elErrorContainer: '#kartik-file-errors',
                // showRemove: false
            }).on('change', function (file) {
                e.excelPreview(file);
            })
        },
        excelPreview: function (file) {
            var e = this;
            loadFile(file, e.element);
            $(e.element).prev('input[type=file]').fileinput('refresh');
            return true;
        }
    }


    function loadFile(event, ele) {
        let file = event.target.files;
        if(file.length == 0)return;
        var fileReader = new FileReader();
        fileReader.onload = (ev) => {
            try {
              var data = ev.target.result,
                workbook = XLSX.read(data, {
                            type: 'binary',
                            cellStyles: true
                }), // 以二进制流方式读取得到整份excel表格对象
                persons = []; // 存储获取到的数据
            } catch (e) {
              console.log('文件类型不正确');
              return;
            }

            //所有表名
            var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

            initTabs(ele, sheetNames, workbook);

            // //根据表名获取对应某张表
            // var worksheet = workbook.Sheets[sheetNames[0]];
        }
        fileReader.readAsBinaryString(file[0]);
    }

    function initTabs(ele, sheetNames, workbook) {
        $(ele).empty().append(`<div class="box box-default">
                    <div class="excel-box">
                        <ul class="nav nav-tabs" role="tablist">
                        </ul>
                        <div class="tab-content" >
                            <div role="tabpanel" class="tab-pane active">
                                
                            </div>
                        </div>
                    </div>
                </div>`);

        sheetNames.forEach(sheet => {
            let tabNav = $(ele).find(".nav-tabs");
            let nav = $(`<li role="presentation"><a role="tab" data-toggle="tab">${sheet}</a></li>`);
            nav.find('a').on('click', (e) => {
                tabChange($(e.target), workbook, tabNav);
            });
            tabNav.append(nav);
            tabChange(tabNav.find(' li:first > a'), workbook, tabNav);
            tabNav.find("li:first").addClass('active');
        })
    }

    function getTableData(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
            var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
            headers.push({
                field: 'column_' + C,
                title: 'column_' + C
            })
        }
        let datas = [];
        for(let rowIndex = range.s.r; rowIndex <= range.e.r; ++rowIndex) {
            let data = {};
            for (let colIndex = range.s.c; colIndex <= range.e.c; ++colIndex) { /* walk every column in the range */
                var cell = sheet[XLSX.utils.encode_cell({ c: colIndex, r: rowIndex })]; /* find the cell in the first row */
                data['column_' + colIndex] = XLSX.utils.format_cell(cell);
            }
            datas.push(data);
        }

        return {
            columns: headers,
            data: datas
        }
    }

    function mergeCell(merge, $table) {
        let rowspan = Math.abs(merge.e.r - merge.s.r + 1);
        let colspan = Math.abs(merge.e.c - merge.s.c + 1);
        $table.bootstrapTable('mergeCells', {
            index: merge.s.r,
            field: 'column_' + merge.s.c,
            rowspan: rowspan,
            colspan: colspan
        });
    }

    function mergeCells(worksheet, $table) {
        var merges = worksheet['!merges'];
        if (!merges) { return; }
        merges.forEach((merge, index) => {
            mergeCell(merge, $table);
        })
    }

    /**
     * key = AA2, start: A1, end = AA8, return {r: 1, c: 26}
     * @param {*} key
     * @param {*} start
     * @param {*} end
     */
    function getRowColIndex(key, start) {
        start = CUSTOM_UTIL.splitRC(start);
        key = CUSTOM_UTIL.splitRC(key);
        let col = key.c - start.c ;
        let row = CUSTOM_UTIL.computeR(key.r, start.r);
        return {
            r: col,
            c: row
        }
    }

    function setCellStyle(rowColIndex, style, $table) {
        var cellDom = $table.find("tbody").find('tr:eq(' + rowColIndex.r + ')').find('td:eq(' + rowColIndex.c + ')');
        if(style.font) {
            cellDom.css('fontWeight', style.font.bold ? 'bold' : 'normal');
            if(style.font.color) {
                style.font.color.rgb = style.font.color.rgb == 'FFFFFF' ? 'FF000000' : style.font.color.rgb;
                cellDom.css('color', CUSTOM_UTIL.rgbaToRgb(style.font.color.rgb));
            }
        }
        if (style.fill && style.fill.fgColor) {
            cellDom.css('backgroundColor', CUSTOM_UTIL.rgbaToRgb(style.fill.fgColor));
        }
        if (style.alignment && style.alignment.horizontal) {
            let alignMap = {'bottom': 'left', 'center': 'center', 'top': 'right'};
            cellDom.css('textAlign', alignMap[style.alignment.horizontal]);
        }
    }

    function setStyles(worksheet, $table) {
        var range = worksheet['!ref'].split(":");
        var start = range[0], end = range[1];
        for(let key in worksheet) {
            if(key >= start && key <= end) {
                var rowColIndex = getRowColIndex(key, start, end);
                var style = worksheet[key].s;
                if(!style) {return;}
                setCellStyle(rowColIndex, style, $table);
            }
        }
    }

    function loadTabContent(sheetName, workbook, $table) {
        var worksheet = workbook.Sheets[sheetName];
        var tableConf = {
            height: defaults.height,
            showHeader: false
        };
        var tableData = getTableData(worksheet);
        $.extend(tableConf, tableData)
        $table.bootstrapTable(tableConf);
        setStyles(worksheet, $table);
        mergeCells(worksheet, $table);
    }


    function tabChange(target, workbook, tabNav) {
        let sheetName = target.html();
        tabNav.find("li").removeClass('active');
        target.parent('li').addClass('active');
        let $table = $(`<div class="table-container"><table></table></div>`);
        tabNav.next('div.tab-content').find('.tab-pane').empty().append($table);
        loadTabContent(sheetName, workbook, $table.find('table'));
    }

    // Create the jQuery plugin
    $.fn[ pluginName ] = function (options) {
        // Do a deep copy of the options - http://goo.gl/gOSSrg
        options = $.extend(true, {}, defaults, options);

        return this.each(function () {
            var $this = $(this);
            // Create a new instance for each element in the matched jQuery set
            // Also save the instance so it can be accessed later to use methods/properties etc
            // e.g.
            //    var instance = $('.element').data('plugin');
            //    instance.someMethod();

            if ( !$.data( $this, "plugin_" + pluginName ) ) {
                    $.data( $this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
        });
    };

    // Expose defaults and Constructor (allowing overriding of prototype methods for example)
    $.fn[ pluginName ].defaults = defaults;
    $.fn[ pluginName ].Plugin = Plugin;
});

