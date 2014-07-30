
SixtyMins.Model.Base = function() {

	// data object holder
	var data = {},
		that = this;
	
	//Specific categories for the previous segments
	var categories = [];
		categories['504143'] = '60 Minutes: Business';
		categories['504144'] = '60 Minutes: Entertainment';
		categories['504145'] = '60 Minutes: Health & Science';
		categories['504146'] = '60 Minutes: Newsmakers';
		categories['504147'] = '60 Minutes: Politics';
		categories['504148'] = '60 Minutes: Sports';
		categories['505147'] = '60 Minutes: Nature';
		
	//Specific categories for the overtime segments	
    var overtimeCategories = [];    
		overtimeCategories['504865'] = '60 Minutes Overtime: Rewind';
		overtimeCategories['504864'] = '60 Minutes Overtime: Overtime Original';
		overtimeCategories['504863'] = '60 Minutes Overtime: Correspondent Candids';
 
//		overtimeCategories['504904'] = '60 Minutes Overtime: Preview';
//      overtimeCategories['504483'] = '60 Minutes / Vanity Fair Polls'; 
	     
	// urls for api access
	this.urls = 
		{
			thisWeek : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&categoryIds=504143,504144,504145,504146,504147,504148,504483,504865&viewType=json',
			overTime : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&categoryIds=504143,504144,504145,504146,504147,504148,504483,504865&viewType=json',
			//previousSegments : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&categoryIds=504143%2C504144%2C504145%2C504146%2C504147%2C504148%2C504483%2C504865&orderBy=createDate&sortDesc=true&start=0&limit=20&viewType=json',
			previousSegments : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&categoryIds=504143,505147&orderBy=productionDate&sortDesc=true&start=0&viewType=json',
			OTListing : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&categoryIds=504143,504144,504145,504146,504147,504148,504483,504865&viewType=json',
			correspondents : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&categoryIds=504143%2C504144%2C504145%2C504146%2C504147%2C504148%2C504483%2C504865&limit=20&orderBy=productionDate&sortDesc=true&cast=Bob+Simon&viewType=json',
			videoDetail : 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&videoIds=50103780&viewType=json'
		};	


    this.months = [
                    "January", 
                    "February", 
                    "March", 
                    "April", 
                    "May", 
                    "June", 
                    "July", 
                    "August", 
                    "September", 
                    "October", 
                    "November", 
                    "December"
                 ];
                 
    this.shortMonths = [
                    "Jan", 
                    "Feb", 
                    "Mar", 
                    "Apr", 
                    "May", 
                    "Jun", 
                    "Jul", 
                    "Aug", 
                    "Sep", 
                    "Oct", 
                    "Nov", 
                    "Dec"
                 ];                 
	/**
	 * Constructor
	 **/
	this.initialize = function() {
		// uncomment to test a certain connection
		// this.testConnection("http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&categoryIds=504143,504144,504145,504146,504147,504148,504483,504865&viewType=json");

	};

	/**
	 * Make the ajax call
	 **/
	this.retrieveData = function (_url, _callback, _context, _key) {
			
		//console.log(_url);	
			
		var xhr = $.ajax({
			url : _url,
			dataType : "jsonp",
			success : function(result) {
				
				// temp
				// console.log("----");
				// console.log(JSON.parse(JSON.stringify(result)));

				// store the data
				that.setData(result);
				
				// console.log(that,result,_context);

				if($.isFunction(_callback)){
					_callback.apply( _context, [that.getData(_key)] );
				}
			}
		});
		
		return xhr;
	};

	/**
	 * Setter
	 **/
	this.setData = function(_data) {
		data = $.extend(data, _data);
	};

	/**
	 * Getter
	 **/
	this.getData = function(_key) {		
		// TODO make the _key param more flexible
		return _key ? data[_key] : data;
	};
	
	/**
	 * Get categories
	 */
    this.getCategory = function(_key) {
        return categories[_key];
    };
    
    /**
     * Returns all the categories
     */    
    this.getCategoriesIds = function(){
        var ids = [];
        for(var i in categories){
            ids.push(i);
        }
        return ids;
    }
    
    /**
     * Get Overtim categories
     */
    this.getOvertimeCategory = function(_key) {
        return overtimeCategories[_key];
    };
    
    
    /**
     * Returns all the overtime categories
     */    
    this.getOvertimeCategoriesIds = function(){
        var ids = [];
        for(var i in overtimeCategories){
            ids.push(i);
        }
        return ids;
    }    
    
    
    /**
     * Returns a month name based on the index
     */    
    this.getMonth = function(monthIndex){
        return this.months[monthIndex];
    }
    
    /**
     * Returns a short month name based on the index
     */    
    this.getShortMonth = function(monthIndex){
        return this.shortMonths[monthIndex];
    }    
    
}; // end of class
