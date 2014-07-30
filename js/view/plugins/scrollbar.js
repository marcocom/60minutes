
(function ($) {

	$.fn.scrollbar = function (oCustomOptions) {
	
		// If no element found, then return immediately
		if (!this[0]) {
			return;
		};
		
		var oDefaults = {};
		
		var oOptions = $.extend(oDefaults, oCustomOptions || {});
		
		// Begin
		return this.each(function () {			
			// Containers
			var oScrollableItem,
				oScrollableItemHeight,
				oScrollbar,
				oScrubber,
				oMarkers,
				$textarea,
				oContainer,
				// Offset of the scrubber
				scrubberOffset,
				// Positions, dimensions of the scrollbar and content
				iScrollPosition,
				iContentPosition,
				iScrollbarWidth,
				iScrollbarHeight,
				ratio,
				paddingWidth,
				expandedWidth,
				collapsedWidth;								
			
			oContainer		= $(this);

			oScrollableItem	= $(this).find('ul');
			oScrollableItemHeight = oScrollableItem.height();
				
			// remove noJS class
			oContainer.removeClass('noJS');
					
			// Builds out the scrollbar
			BuildScrollbar();			

			// Bind the event listeners for the menu
			BindEvents();

			//** Instantiation _______________________________________________________ **//

			/**
			 * Starts the creation of the bar
			 * 
			 * @param {Object} oContainer
			 */
			function BuildScrollbar () {

				var sOrientation;

				// Determine the orientation of the scrollbar
				sOrientation = 'top: 0px;';
				
				// Add the scrollbar
				oContainer.append('<div class="scrollbar-small"><div class="scrollbar-small-bottom"></div></div>');
				
				// Get the scrollbar
				oScrollbar	= $('div.scrollbar-small', oContainer);
				
				//Change the height of the scrollbar so that it matches the textarea
				//height
				oScrollbar.css('height', oScrollableItemHeight + "px");
				 
				// Get the width of the scrollbar
				iScrollbarWidth		= oScrollbar.width();
				iScrollbarHeight	= oScrollbar.height();

				oScrubber	= BuildDynamicScrubber();
				
				// Now add the scrubber
				$('div.scrollbar-small', oContainer).append(oScrubber);
			
				// Set up our elements
				oScrubber	= $('div.scrubber', oScrollbar);
				
				//Calculate expanding and collapsing states of the textarea
				paddingWidth = 20;
				expandedWidth = oScrollableItem.width();
				collapsedWidth = oScrollableItem.width() - paddingWidth;																
			}

			function BuildDynamicScrubber () {
				
				var sScrubber			= '',
					iStretchLength		= null, 
					iScrubberLength		= null;
				
				iStretchLength = Math.floor(iScrollbarHeight/2);																		

				// Setup the markup with our new properties
				sScrubber	 = '<div class="scrubber" style="background: none; z-index: 100;">';
				sScrubber	+= '<div class="scrubber-start-y"></div>';
				sScrubber	+= '<div class="scrubber-stretch-y"></div>';
				sScrubber	+= '<div class="scrubber-end-y"></div>';				
				sScrubber	+= '</div>';
				
				return $(sScrubber);
				
			}

			
			//** Events ______________________________________________________________ **//

			function BindEvents () {
				
				oScrollableItem.keyup(function(e){
					onKeyup(e);
				});
				
				// Bind events to track when the user is over the carousel list
				oScrollableItem.hover(StartMouseWheel, StopMouseWheel);
								
				// Bind events for the scrollbar scrubber
				oScrubber.hover(function (e) {
					oScrubber.addClass('over');
				}, function (e) {
					oScrubber.removeClass('over');
				});
				
				oScrubber.mousedown(function (e) {
					oScrubber.addClass('down');
				});
				
				oScrollbar.bind('mousedown', function(e) {
					onScrollbarMouseDown(e);
					return false;
				});
				
			}

			function onKeyup(event){
				
				//Get the object and its height
				$textarea = $(event.target);
				var height = $textarea.height();												
					
				//The actual size of the content of the textarea
				var actualSize = event.target.scrollHeight;
				
				//The position of the scrubber
				var targetScrollPosition = 0;
				
				//Calculate the size of the scrollbar
				ratio = actualSize/height;							
				
				//If the height of the scroll is larger than 
				//the height of the element then it means that we
				//need to have a scroller
				//Toggle the scrollbar's visibility
				//If we need to scroll then we show the scrollbar					
				if(ratio > 1){
					
					//Calculate the position of the scrubber
					targetScrollPosition= Math.floor($textarea.scrollTop() / ratio);						
					
					//Calculate the size of the scrubber
					var scrubberHeight = Math.floor(height / ratio) - oScrubber.find('.scrubber-start-y').height() - oScrubber.find('.scrubber-end-y').height()
					
					//Change the size of the scrubber
					oScrubber
					.find('.scrubber-stretch-y')
					.height(scrubberHeight <= 0 ? 0 : scrubberHeight);																																																			
					
					//If the scrubber has reached it's minimum height then
					//don't move it down										
					if (height - targetScrollPosition >= oScrubber.height()) {					
						oScrubber.css('top', targetScrollPosition + "px");
					}			
					
					//Reposition the scroller incase that the height of the scroller 
					//in combination with the top attributes gets bigger than the entire
					//scroller					
					if(oScrubber.height() + parseInt(oScrubber.css('top'),10) >= iScrollbarHeight){
						oScrubber.css('top',(iScrollbarHeight - oScrubber.height()) + 'px');	
					}					
					
					//Show the scrollbar 
					oScrollbar.css('visibility','visible').stop().animate({opacity:1},300);
					
					//Make the textrea smaller so that the scrollbar can fit on the right					
					$textarea
					.css('margin-right', paddingWidth+"px")
					.css('width', (collapsedWidth) + "px");					
					
				} else {
					
					//Hide the scrollbar
					oScrollbar.stop().animate({opacity:0},300,'linear',function(){
						$(this).css('visibility','hidden');
					});		
					
					//Change the size of the textarea back to normal		
					$textarea
					.css('margin-right', "0px")
					.css('width', expandedWidth + "px");								
								
				}
			}

			function onScrollbarMouseDown (event) {
				
				// Do nothing if we are disabled
				if ($(this).hasClass('scrollbar-disabled')) {
					return;
				}
				
				// If the mouse is NOT pressed down on the scrubber, we need to move the scrubber to where the mouse currently is
				if(!$(oScrubber).hasClass('down')) {

					oScrubber.css('top', event.clientY - oScrollbar.offset().top - (oScrubber.height() * 0.5));
					
				}

				scrubberOffset = event.clientY - oScrubber.position().top;
				
				$(document).bind('mousemove', ScrollBarMouseMove);
				$(document).bind('mouseup',	ScrollBarMouseUp);
				
				// Trigger an initial update of content positioning to make sure it is in sync with where the scrubber is
				ScrollBarMouseMove(event);
					
			}

			function StartMouseWheel (event) {
				
				if (window.addEventListener) {
					
					if ($.browser.safari) {
						// Safari / Chrome
						window.addEventListener('mousewheel', MouseWheel, false);
						
					}
					else {
						// Mozilla
						window.addEventListener('DOMMouseScroll', MouseWheel, false);
					}
				}
				else {
					// IE
					window.mousewheel = document.mousewheel = MouseWheel;
				}
				
			}

			function StopMouseWheel (event) {
							
				if (window.addEventListener) {
					
					if ($.browser.safari) {
						// Safari / Chrome
						window.removeEventListener('mousewheel', MouseWheel, false);
					}
					else {
						// Mozilla
						window.removeEventListener('DOMMouseScroll', MouseWheel, false);
					}
					
				}
				else {
					// IE
					window.onmousewheel = document.onmousewheel = null;
				}
			}

			function MouseWheel (event) {
				
				// Update the current scrubber offset
				oScrubber	= $("div.scrubber", oScrollbar);

				scrubberOffset = event.clientY - oScrubber.position().top;

				//scrubberYOffset = event.clientY - oScrubber.position().top;
				
				var delta = 0;
				
				// For IE.
				if (!event) {
					event = window.event;
				}
				
				// IE/Opera.
				if (event.wheelDelta) { 
					delta = event.wheelDelta / 120;
					
					if (window.opera) {
						delta = -delta;
					}
				}
				
				// In Mozilla, sign of delta is different than in IE. Also, delta is multiple of 3.
				if (event.detail) {
					delta = -event.detail/3;
				}
				
				
				// If delta is nonzero, handle it. Basically, delta is now positive if wheel was scrolled up,
				// and negative, if wheel was scrolled down.
				if (delta) {
					
					var offset = delta > 0 ? -50 : 50;
					
					UpdateScroll(event.clientY + offset);	
					
				}
				
				// Prevent default mouse wheel functionality
				if(event.stopPropagation) event.stopPropagation();
				if(event.preventDefault) event.preventDefault();
				if(event.returnValue) event.returnValue = false;
				
				return false;
			}

			function ScrollBarMouseMove (event) {

				UpdateScroll(event.clientY);
				
			}

			function ScrollBarMouseUp (e) {
				
				oScrubber.removeClass('down');
				
				$(document).unbind('mousemove', ScrollBarMouseMove);
				$(document).unbind('mouseup', ScrollBarMouseUp);
								
			}

			function UpdateScroll (global) {
				
				var iScrollDistance,
					iScrollScale;;
					
					// Determine the height of the scrollbar
					iScrollDistance = oScrollbar.height();
					
					// Calculate the position to move the scrubber to (within max/min bounds)
					iScrollPosition = Math.max(Math.min(global - scrubberOffset, iScrollDistance - oScrubber.height()), 0);
					
					// Calculate the scroll scale, ranged from 0-1 where 1 is the full bottom scroll 
					iScrollScale	= iScrollPosition / (iScrollDistance - oScrubber.height());
					
					// Calculate the new position to move the content to [ y * ((totalHeight) - containerHeight ) ] 					
					iContentPosition = -iScrollScale * ((oScrollableItem.outerHeight(true)) - oScrollableItem.attr('scrollHeight'));
					
					oScrubber.css('top', iScrollPosition);																	
					oScrollableItem.animate( {scrollTop: iContentPosition}, 0);					
				
			}

			
			
		});
		
	};

})(jQuery);