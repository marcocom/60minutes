
SixtyMins.View.PreviousSegments = function(name) {
	
	this.setName(name);
	this.domElement = $("#previous-segments");
	this.openedTab = 'recent';
	
	var me = this;
	
	var rootURL = '/htdocs/60minutesapp/previous-segments/';
	var preloader = this.domElement.find('.preloader');		
	var $filterBar = this.domElement.find('.filter-bar');
	
	var currentId = -1;
	
	
	this.draw = function() {
	    $filterBar.bind('click', callbacks.navClickHandler);
	}
	
	this.showPreloader = function() {
		
		// preloader.addClass('active');
		preloader.fadeTo(250,1);

	}
	
	this.hidePreloader = function() {
		
		// preloader.removeClass('active');
		preloader.fadeOut(250);
	
    }
	
    var callbacks = {
            
        navClickHandler : function(e){
            
            var $target = $(e.target);
            
            // we check if user clicked a button
            if($target.is('a'))
            {
                currentId = $target.data('id');
                
                // clear active classes and add it to current element
                $('li', $filterBar).removeClass('active');
                
                // set active class on current element
                $target.parent().addClass('active');
                
                //Push the state                
                SixtyMins.RouteManager.pushState(null,null, rootURL + $target.data('friendly-url'));              
                
                me.openedTab = $target.data('friendly-url');
                
                SixtyMins.Lookup.getController('PreviousSegmentsGrid').showCategory(currentId);
                
                e.preventDefault();
            }
        }
    };	
	
	
	
	/**
	 * Returns the id of the active tab
	 */    
    this.getActiveTabId = function(){
        return $filterBar.find('nav ul li.active a').data('id');  
    }  
    
    /**
     * Sets the active tab
     */ 	
    this.setActiveTab = function(id){        
        
        me.openedTab = $filterBar.find('nav ul li a[data-id='+id+']').data('friendly-url');
        
        currentId = id;
        // clear active classes and add it to current element
        $('li', $filterBar).removeClass('active');
                       
        //Selecting the correct one
        $filterBar.find('nav ul li a[data-id='+id+']').parent().addClass('active');
            
    }
    
    /**
     * Finds an element by an attribute
     */
    this.findElementByAttr = function(attr, value){
        return this.domElement.find('['+attr+'='+value+']');   
    }
}

SixtyMins.View.PreviousSegments.prototype = new SixtyMins.View.Base();