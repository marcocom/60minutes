
(function(window, document, undefined){
	
	var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
		chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1,
		hash = window.location.hash.indexOf('bad_browser') > -1;  

	if(!chrome && !hash){
		window.location = 'http://www.cbsnews.com/htdocs/60minutesapp/browser.html';
	}
	if(hash){
		history.pushState(null,null,'http://www.cbsnews.com/htdocs/60minutesapp/');	
	}

})(window, document);
