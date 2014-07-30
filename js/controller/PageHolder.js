
SixtyMins.Controller.PageHolder = function() {


	var $pages 			= $(".page"),
		$logo			= $("#top-logo"),
		$logoImg		= $logo.find('img'),
		current 		= null,
		animating 		= false,
		queue			= [],
		that			= this,
		subcontrollers	= [ 'ThisWeek',
							'PreviousSegments',
							'SixtyMinsOvertime',
							'Correspondents' ]
	;

	// set up the variables we need
	var callbacks = {
		transitionEnd: function(event) {

			// remove the callback
			$(this).unbind('webkitTransitionEnd', callbacks.transitionEnd);

			animating = false;

			if(queue.length) {

				// get the id, clear the queue
				var newID = queue[queue.length-1];
				queue = [];

				that.slideTo(newID);

			} else if(current) {

				var currentController = SixtyMins.Lookup.getController(subcontrollers[current-1]);

				if($.isFunction(currentController.onShow)) {
					currentController.onShow();
				}
			}
		},
		onLogoClick:function(event) {
			SixtyMins.Lookup.getView('Navigation').performClick(0);
		}
	};

	// ensure the logo click takes us back to
	// the first subview
	$logoImg.click(callbacks.onLogoClick);

	this.slideTo = function(target, animate) {

		// kill any playing video
		SixtyMins.Lookup.getController('Video').hideVideo();

		// close the panel if it is open
		SixtyMins.Lookup.getController('VideoSidebar').close();

		// ignore repeat clicks
		if(target === current) {

			callbacks.transitionEnd.apply($pages[current-1]);
			return;
		}

		// add the transition class
		if(animate) {
			$pages.addClass('transition');
		}

		// force the back button to hide
		$logo.removeClass('show-back');

		if( target == 1 || target == 3) {
			$logo.removeClass('active');
		}
		else {
			$logo.addClass('active');
		}

	    // only animate if we're not doing so
		// already, otherwise queue
		if(!animating) {

			animating = true;

			// locate the page
			for(var i = 0; i < $pages.length; i++) {
				var $page 	= $($pages[i]),
					id 		= $page.data('id');

				// remove any existing callbacks for the transition
				$page.unbind('webkitTransitionEnd', callbacks.transitionEnd);

				if(id !== current) {
					$page.removeClass('transition');
				} else if(current) {

					$page.removeClass('inactive');
					// notify the current controller that it is being hidden
					var currentController = SixtyMins.Lookup.getController(subcontrollers[id-1]);
					if(currentController && $.isFunction(currentController.onHide)) {
						currentController.onHide();
					}
				}

				if(id < target) {
					$page.css({left: '-100%'});
				}
				else if (id > target) {
					$page.css({left: '100%'});
				}
				else if (id === target) {

				  var nextController = SixtyMins.Lookup.getController(subcontrollers[id-1]);

				  if(nextController && $.isFunction(nextController.onBeforeShow)) {
            nextController.onBeforeShow();
          }

					if(animate) {
						$page.addClass('transition');
						$page.bind('webkitTransitionEnd', callbacks.transitionEnd);
					}
					else {
						// call the callback directly
						current = target;
						callbacks.transitionEnd.apply($pages[i]);
					}

					$page.css({left: '0%'});
				}
			}
			current = target;
		}
		else {
			queue.push(target);
		}
	}

	this.postInitialize = function() {

		// we need to init the four main sections
		for(var i = 0; i < subcontrollers.length; i++) {
			SixtyMins.ControllerManager.initialize(subcontrollers[i]);
		}

	}

	this.updateData = function(target, data) {
		SixtyMins.Lookup.getController(subcontrollers[target-1]).updateData(data);
	}
}

SixtyMins.Controller.PageHolder.prototype = new SixtyMins.Controller.Base();