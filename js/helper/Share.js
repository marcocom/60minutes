
SixtyMins.Share = new function() {
  
  /**
   * The configuration for share links
   */
  
  var CONFIG = {
    
    title: "60 Minutes - Chrome App",
    url:   "https://chrome.google.com/webstore/detail/imjhdahelgojehmfmkmdfjcpfbglbfmj"
    
  }
  
  /**
   * Patterns for the services
   */
  
  var SERVICES = {
    
    facebook: "http://www.facebook.com/sharer.php?u=${url}&t=${title}",
    twitter:  "http://twitter.com/home?status=${title}: ${url}",
    buzz:     "http://www.google.com/reader/link?title=${title}&url=${url}",
    link:     "mailto:name@domain.com?subject=${title}&body=${url}"
    
  };
  
  /**
   * Store references to elements to process
   */
  
  var $root = $("#share");
  var $items = $("li", $root);
  
  /**
   * Create a public API
   */
  
  var api = {};
  
  /**
   * Initialises all share links
   */
  
  api.init = function() {
    
    var item;
    var link;
    
    $items.each(function() {
      
      // Grab the item and it's class (service type)
      
      item = $(this);
      type = $(this).attr("class");
      
      // Get the pattern for this service from the dictionary
      
      link = SERVICES[ type ];
      
      if( typeof(link) !== "undefined" ) {
        
        // Replace the hoos with real data
        
        link = link.replace( /\${title}/gi, encodeURIComponent( CONFIG.title ) );
        link = link.replace( /\${url}/gi, encodeURIComponent( CONFIG.url ) );
        
        // Set the href on any links inside this item
        
        $('a', item).attr( "href", link );
      }
      
    });
    
  }
  
  return api;
}

/**
 * When the document is loaded, correct the paths for share links
 */

$(document).ready(function() {
  SixtyMins.Share.init();
});