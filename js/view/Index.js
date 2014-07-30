
SixtyMins.View.Index = function(name) {
	
	this.setName(name);

	this.domElement = $("#wrapper");

	var that			= this,
		resizeTimeout	= 0
	;

	this.draw = function() {		

		onWindowResize();

		$(window).bind('resize', onWindowResize);
		
		$('footer').addClass('transition').css({
			opacity: 1
		})
		//.fadeIn("slow");
	
	};

	function onWindowResize() {		

		clearTimeout(resizeTimeout);
		
		resizeTimeout = setTimeout(function(){
			that.domElement.css({
				height : $(window).height() - 81
			});
		}, 30);
	};
}

SixtyMins.View.Index.prototype = new SixtyMins.View.Base();