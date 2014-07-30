
SixtyMins.Model.CorrespondentsGrid = function() {
    
    var url = "http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&categoryIds=504143%2C504144%2C504145%2C504146%2C504147%2C504148%2C504483%2C504865%2C18561&start={{start}}&limit=20&orderBy=productionDate&sortDesc=true&cast={CORRESPONDANT}&viewType=json"

	var data = [
		{
			"id" : 10,
			"thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Steve_Kroft-big.png", 
			"title" : "Steve Kroft",
			"count" : 12,
			"url" : "steve+kroft",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Steve_Kroft-big.png",
            "description" : "Steve Kroft was named a \"60 Minutes\" correspondent in May 1989 and delivered his first report that September. The 2010-11 season is his 22nd on the broadcast. "			
			      			
		},
        {
            "id" : 80,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Lesley_Stahl-big.png", 
            "title" : "Lesley Stahl",
            "count" : 1,
            "url" : "lesley+stahl",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Lesley_Stahl-big.png",
            "description" : "Lesley Stahl has been a \"60 Minutes\" correspondent since March 1991. The 2010-11 season marks her 20th on the broadcast."                                
        },		
		{
			"id" : 100,
			"thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Scott_Pelley-big.png", 
			"title" : "Scott Pelley",
			"count" : 127,
			"url" : "scott+pelley",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Scott_Pelley-big.png",
            "description" : "Scott Pelley is the  anchor and managing editor of the \"CBS Evening News\", and has been a \"60 Minutes\" correspondent since 2004. Previously, he served as a correspondent for \"60 Minutes II\" and as Chief White House Correspondent for the \"CBS Evening News.\""            						
		},
        {
            "id" : 40,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Bob_Simons-big.png", 
            "title" : "Bob Simon",
            "count" : 2,
            "url" : "bob+simon",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Bob_Simons-big.png",
            "description" : "Bob Simon, the most honored journalist in international reporting, has been contributing regularly to \"60 Minutes\" since 1996. He was also a correspondent for all seven seasons of \"60 Minutes II,\" from January 1999 to June 2005, after which he became a full-time \"60 Minutes\" correspondent. The 2010-11 season is his 15th on the broadcast."                         
        },
        {
            "id" : 90,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Morley_Safer-big.png", 
            "title" : "Morley Safer",
            "count" : 18,
            "url" : "morley+safer",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Morley_Safer-big.png",
            "description" : "Morley Safer has been a \"60 Minutes\" correspondent since December 1970. The 2010-11 season marks his 41st on the broadcast."                     
        },
        /*
        {
            "id" : 60,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Katie_Couric-big.png",
            "title" : "Katie Couric",
            "count" : 35,
            "url" : "katie+couric",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Katie_Couric-big.png",
            "description" : "Katie Couric is the anchor and managing editor of the \"CBS Evening News with Katie Couric,\" a \"60 Minutes\" correspondent and anchor of CBS News primetime specials."            
                        
        },
        */    
        {
            "id" : 70,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Lara_Logan-big.png",
            "title" : "Lara Logan",
            "count" : 22,
            "url" : "lara+logan",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Lara_Logan-big.png",
            "description" : "Lara Logan's bold reporting from war zones over the past 18 years has earned her a prominent spot among the world's best foreign correspondents. Her five-segment series on U.S. Marines on patrol in Afghanistan for the \"CBS Evening News\" was recently named an RTDNA/Edward R. Murrow Award winner."            
                                    
        },
        {
            "id" : 50,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Byron_Pitts-big.png", 
            "title" : "Byron Pitts",
            "count" : 15,
            "url" : "byron+pitts",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Byron_Pitts-big.png",
            "description" : "Byron Pitts was named a contributor to \"60 Minutes\" and chief national correspondent for \"The CBS Evening News with Katie Couric\" in January 2009. He had been a national correspondent since February 2006. "                     
        },
        {
            "id" : 20,
            "thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Anderson_Cooper-big.png", 
            "title" :"Anderson Cooper",
            "count" : 3,
            "url" : "anderson+cooper",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Anderson_Cooper-big.png",
            "description" : "Anderson Cooper, anchor of CNN's \"Anderson Cooper 360˚,\" contributes reports to CBS News' \"60 Minutes\" through an agreement between CNN and CBS News. He remains a full-time employee of CNN."         
        },                                    		
		{
			"id" : 30,
			"thumbURL" : "/htdocs/60minutesapp/media/photos/correspondents/Andy_Rooney-big.png", 
			"title" : "Andy Rooney",
			"count" : 22,
			"url" : "andy+rooney",
            "bigImageURL" : "/htdocs/60minutesapp/media/photos/correspondents/Andy_Rooney-big.png",
            "description" : "Andy Rooney is known to millions for \"A Few Minutes with Andy Rooney,\" his wry, humorous and sometimes controversial essays - now numbering over 1,000 - that have been the signature end-piece of \"60 Minutes\" for decades. "            		
		}
	];
	
    this.months=[
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
	
	
	
	/**
	 * Setter
	 **/
	this.setData = function (_sampleData) {
		data = _sampleData;
	};

	/**
	 * Getter
	 **/
	this.getData = function() {
		return data;
	};
	
	/**
	 * Gets the data for the specific correspondant's grid
	 */
	this.getCorrespondantGridData = function(correspondant, callback, context, start){
        // Check for a start ID
        start = (start != false && typeof(start) != "undefined") ? start : 0;
        // Concatenate categoryId
        var targetURL = url.replace("{{start}}",start); 
	    targetURL = targetURL.replace('{CORRESPONDANT}',correspondant);	    
	    this.retrieveData(targetURL, callback, context, "CNETResponse");    
	}


}; // end of class

SixtyMins.Model.CorrespondentsGrid.prototype = new SixtyMins.Model.Base();