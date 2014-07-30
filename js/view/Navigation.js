
SixtyMins.View.Navigation = function(name) {
	
	this.setName(name);
	this.domElement 		= $("footer");
	
	// get a reference to the links
	var $navLinks 			= $('#primary-menu a');
	var $navLinksHolders	= $('#primary-menu li');
	
	this.performClick = function(index) {
		if(index >= 0 && index < $navLinks.length) {
			$($navLinks[index]).trigger('click');
		}
	}
	
	this.simulateClick = function(href, animate) {
		
		var $chosenLink = $navLinks.filter('[href="'+href+'"]');
		if(!$chosenLink.length) {
			$chosenLink = $navLinks.filter(':first')
		}
		$chosenLink.trigger('click', {preventPushState:true, animate:animate});
	}
	
	this.updateData = function(href, data, firstState) { 
	
		// locate the link
		var $chosenLink = $navLinks.filter('[href="'+href+'"]');
		
		// if we did
		if($chosenLink.length) {
			
			// get the Navigation controller to update the specific
			// section controller for us
			var pathSegments = data.replace(/\/$/, "").split("/");
			SixtyMins.Lookup.getController('Navigation').updateData($chosenLink.data('target'), {path:data, pathSegments:pathSegments, firstState:firstState});
		}
	
	}
	
	this.draw = function() {
		
		// now hijack the navigation links
		$navLinks.click(function(event, params){
			
			var $this 	= $(this),
				url		= $this.attr('href'),
				animate	= true;
				
			// allow an override of the push state
			if(params) {
				
				// check for the animation parameter
				if(params.animate !== null && params.animate !== undefined) {
					animate = params.animate;
				}
				
				if(params.preventPushState) {
					url = null;
				}
			}
			
			// remove the current links
			$navLinksHolders.removeClass('current');
		
			// add it to the parent of this anchor
			$this.closest('li').addClass('current');
			
			// parse out the ID from the markup
			// and pass this through to the controller
			SixtyMins.Lookup.getController('Navigation').change($this.data('target'), url, animate);
			
			// stop propagation, etc
			return false;
			
		});
	}
}

SixtyMins.View.Navigation.prototype = new SixtyMins.View.Base();