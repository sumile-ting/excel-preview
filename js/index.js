(function() {
	'use strict';
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

	function mergeCell(merge) {
		let rowspan = Math.abs(merge.e.r - merge.s.r + 1);
		let colspan = Math.abs(merge.e.c - merge.s.c + 1);
		$('#table').bootstrapTable('mergeCells', {
			index: merge.s.r, 
			field: 'column_' + merge.s.c,
			rowspan: rowspan, 
			colspan: colspan
		});
	}

	function mergeCells(worksheet) {
		var merges = worksheet['!merges'];
		if (!merges) { return; }
		merges.forEach((merge, index) => {
			mergeCell(merge);
		})
	}

	//TODO 
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

	function setCellStyle(rowColIndex, style) {
		var cellDom = $("#table > tbody").find('tr:eq(' + rowColIndex.r + ')').find('td:eq(' + rowColIndex.c + ')');
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

	function setStyles(worksheet) {
		var range = worksheet['!ref'].split(":");
		var start = range[0], end = range[1];
		for(let key in worksheet) {
			if(key >= start && key <= end) {
				var rowColIndex = getRowColIndex(key, start, end);
				var style = worksheet[key].s;
				if(!style) {return;}
				setCellStyle(rowColIndex, style);
			}
		}
	}

	function loadTabContent(sheetName, workbook) {
		var worksheet = workbook.Sheets[sheetName];
		var tableConf = {
			height: 600,
			showHeader: false
		};
		var tableData = getTableData(worksheet);
		$.extend(tableConf, tableData)
		$('#table').bootstrapTable(tableConf);
		setStyles(worksheet);
		mergeCells(worksheet);
	}


	function tabChange(target, workbook) {
		let sheetName = target.html();
		$("#tabNav > li").removeClass('active');
		target.parent('li').addClass('active');
		$("#tabPanel").empty().append('<div class="table-container"><table id="table"></table></div>');
		loadTabContent(sheetName, workbook);
		// $("#tabPanel").html(sheetName);
	}

	function initTabs(sheetNames, workbook) {
		$("#tabNav").empty();
		$("#tabPanel").empty();
		sheetNames.forEach(sheet => {
			let nav = $(`<li role="presentation"><a role="tab" data-toggle="tab">${sheet}</a></li>`);
			nav.find('a').on('click', (e) => {
				tabChange($(e.target), workbook);
			});
			$("#tabNav").append(nav);
			tabChange($("#tabNav > li:first > a"), workbook);
			$("#tabNav > li:first").addClass('active');
		})
	}

	function loadFile(e) {
		let file = e.target.files;
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

			initTabs(sheetNames, workbook);

		    // //根据表名获取对应某张表
		    // var worksheet = workbook.Sheets[sheetNames[0]];
		}
 		fileReader.readAsBinaryString(file[0]);
	}

	$(function() {
		$("#file").on('change', function(e) {
			loadFile(e);
		})	
	})

})()