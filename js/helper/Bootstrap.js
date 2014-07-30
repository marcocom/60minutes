SixtyMins.Bootstrap = new function() {
	
	this.init = function() {
	
		// Controllers
		// ---------------------
		// create the index
		SixtyMins.ControllerManager.initialize('Index');
	
		// create video
		SixtyMins.ControllerManager.initialize('Video');	

		// create the panel
		//SixtyMins.ControllerManager.initialize('Panel');
		
        // create the video sidebar
        SixtyMins.ControllerManager.initialize('VideoSidebar');		

		// switch on the logo
		$("#top-logo").addClass('enabled');
		$("#top-ot-logo").addClass('enabled');

		// $.ajax({
		// 	url : "http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&categoryIds=504143%2C504144%2C504145%2C504146%2C504147%2C504148%2C504483%2C504865&orderBy=createDate&sortDesc=true&start=0&limit=20&viewType=json",
		// 	dataType : "jsonp",
		// 	success : function(result) {
		// 		console.log("all categories: ", result);
		// 	}
		// });

		// set unselectable GUI items to prevent text selection
		$('.unselectable').bind('selectstart', false);

	};
	
};

$(document).ready(function() {
	
	SixtyMins.Bootstrap.init();
	
});