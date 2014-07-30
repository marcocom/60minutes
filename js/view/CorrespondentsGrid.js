
SixtyMins.View.CorrespondentsGrid = function(name) {
	
    //The margins of the view. Header bar and Footer Menu
    
    var TOP_MARGIN              = 66;
    var BOTTOM_MARGIN           = 81;
	
	// set name to Grid	
	this.setName(name);
	this.domElement 		= $('<div class="grid-wrapper"><ul class="clearfix"></ul></div>');

	// variables
	var $wrapper       = this.domElement,
		$list 	       = $('ul' , this.domElement),
		$body 	       = $(document.body),
		thumbSize      = {width:302, height:166},
		me		       = this,
		isInitialized  = false,
		isHidden       = false,
		data	       = null 
	;
	
	/**
	 * 
	 **/
	this.setData = function(dataSet) {
		data = dataSet;
	};
	
    this.resetScroll = function() {
        me.domElement.parent('.grid').scrollTop(0);            
    };
    
	/**
	 * 
	 **/
	this.draw = function() {
	    
	    if(!isInitialized){
	        
	        //Clear the grid
    	    this.clearGrid();

    		if(data && data.length)
    		{
    			var dataItem;
    			
    			for(var i = 0; i < data.length; i++)
    			{
    				dataItem = data[i];
                    
    				var subTitle = dataItem.subTitle ? '<span>'+dataItem.subTitle+'</span>' : '';
    				var elemStr = 	'<li><figure href="'+dataItem.url+'" data-id="'+dataItem.id+'" data-index="'+ i +'">'+
    									'<div class="thumb"></div>'+
    									'<div class="fake-thumb"><div></div></div>'+
    									'<figcaption>'+dataItem.title+'</figcaption>'+
    									/*'<figcaption>'+dataItem.title+'<p>Segments <span class="count">('+dataItem.count+')</span></p></figcaption>'+*/
    								'</figure></li>';
    				
    				$li = $(elemStr);
    								
    				$('.thumb', $li).css('background-image','url('+dataItem.thumbURL+')');
    				
    				$list.append($li);                
                    
                    var callback = function(obj,delay){                                     
                        obj.css('-webkit-transition-delay', delay + 's').css('opacity', '1' );
                                                    
                    };
              
                    setTimeout(callback, 300, $li, i/10);   
    				
    				$('figure', $li).bind('click',  callbacks.itemClickHandler);
    				$('figure', $li).bind('selectstart',  function(){ return false; });			
    				
    				
    			}
    			
    			isInitialized = true;
    			
    		    callbacks.resizeHandler();	
    		}
		
		}
	};

	/**
	 * 
	 **/
	this.clearGrid = function() {
		$list.empty();
	};

    /**
     * Function specific to this view for hiding the grid
     * @param animate {bool} - If it is true then we animate the element
     */
    this.hide = function(animate){
        
        var height = $wrapper.parent().height();           
        
        if(animate == false){
           me.domElement.parent().addClass('no-transition') 
        } else {
           me.domElement.parent().removeClass('no-transition')
        }        
                    
        me.domElement.parent().css('top',"-100%");
                     
        isHidden = true;
        
    };
    
    /**
     * Function specific to this view for showing the grid
     * @param animate {bool} - If it is true then we animate the element
     */    
    this.show = function(animate) {
        
        if(animate == false){
           me.domElement.parent().addClass('no-transition') 
        } else {
           me.domElement.parent().removeClass('no-transition')
        }    
               
        me.domElement.parent().css('top',"0px"); 
               
        isHidden = false;  
         
        callbacks.resizeHandler();      
        
    }
    
    
	/**
	 * Enables
	 **/
	function enable (){
		
		$(window).bind('resize', callbacks.resizeHandler);
	};
	
	var callbacks = {
		
			resizeHandler : function(e){

                var margin = 30;
                var contW = window.innerWidth - margin;
                var itemW = parseInt($($list.children()[0]).css('width'));
                
                var itemFullW = itemW + margin;
                var rowCount = Math.floor(contW / itemFullW);
                var rowW = rowCount * itemFullW; 
                                
                $list.width(rowW);
                var listHeight = $(window).height() - BOTTOM_MARGIN - TOP_MARGIN - parseInt($list.css('padding-top')) - parseInt($list.css('padding-bottom')) - parseInt($list.css('margin-top')) - parseInt($list.css('margin-bottom'));
                
                try{
                    me.domElement.parent().height(listHeight);    
                } catch(err){
                    
                }
						
			},
			
			itemClickHandler : function(e){								
                                   
                SixtyMins.RouteManager.pushState(null, null, $(this).attr('href'));                                	
				SixtyMins.Lookup.getController('Correspondents').showCorrespondentDetails($(this).attr('href'));
				
			},
			
			onTransitionEnd: function(){                
			    $(this).css('-webkit-transition-delay', '0s');
			    $(this).unbind('webkitTransitionEnd', callbacks.onTransitionEnd);
			}
	};
	
	/**
	 * Disabled
	 **/
	function disable (){
		this.show();
		$(window).unbind('resize', callbacks.resizeHandler);

	};
	
	enable();

}; // end of class

SixtyMins.View.CorrespondentsGrid.prototype = new SixtyMins.View.Base();