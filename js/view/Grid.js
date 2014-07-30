
SixtyMins.View.Grid = function(name) {
	
	var thumbSizes = {
			
			PreviousSegments : {width:302, height:166},
			Correspondents : {width:302, height:166}
	};
	
	// set name to Grid
	
	this.setName(name);
	this.domElement 		= $('<div class="grid-'+name+'"></div>');

	// variables
	var $wrapper  = this.domElement,
		$list 	  = $('ul' , this.domElement),
		$body 	  = $(document.body),
		thumbSize = { width : 300, height : 200},
		resizeCheckTimeout = null,
		gridWidth = 0,
		rowHeight = null
	;	


	/**
	 * Constructor
	 **/
	this.draw = function(type) {

		thumbSize = thumbSizes[type];
		
		rowHeight = 0;

		checkSize(true);

	};

	/**
	 * FIXME Resets the grid	 
	 **/
	this.clearOldGrid = function() {
		$('li', $list);
	};

	/**
	 * Adjusts the size of the video player
	 **/
	function checkSize (forceResize) {
		var newWidth = parseInt($list.width());
	
		if (newWidth != gridWidth || forceResize) {
			//console.log("RESIZE:",gridWidth,"->",newWidth);
			
			gridWidth = newWidth;
			
			adjustSize();
		}

	};

	/**
	 * Adjusts the size of the video player
	 **/
	function adjustSize () {
		
		var items = $('li', $list);

		if(items && items.length) {
			var minMarginH = 20;
			var marginH = 0;
			var marginV = 20;
			var rowLength = Math.floor(gridWidth/thumbSize.width);
			var space = gridWidth - rowLength*(thumbSize.width);
			
			if (space < (rowLength - 1) * minMarginH) {
				rowLength--;
				space = gridWidth - rowLength*(thumbSize.width);
			}
			
			marginH = space/(rowLength - 1);
			
			var tx = 0;
			var ty = 0;
			
			for (var i = 0; i < items.length; i++) {
				var $item = $(items[i]);
				
				if((i%rowLength==0) && (i!=0))
				{
					// next row
					tx = 0;
					ty += rowHeight + marginV;
				}
				
				$item.css({left:Math.round(tx), top:Math.round(ty)});
				tx += thumbSize.width + marginH;
			}
			
			// adjust size of background
			$wrapper.height(ty + rowHeight + marginV);
		}

	};

	/**
	 * Enables
	 **/
	function enable (){
		
		clearTimeout(resizeCheckTimeout);
		
		resizeCheckTimeout = setInterval(checkSize, 20);
	};
	
	/**
	 * Disabled the player
	 **/
	function disable (){
		
		clearTimeout(resizeCheckTimeout);

	};

}; // end of class

SixtyMins.View.Grid.prototype = new SixtyMins.View.Base();

		