
(function(window){
    var eventThrottle = {};
    eventThrottle.delay = 200,
    eventThrottle.timeout = false, 
    eventThrottle.run = function(cb){
        if(eventThrottle.timeout !== false){
           clearTimeout(eventThrottle.timeout);
        }  
        eventThrottle.timeout = setTimeout(function(){ eventThrottle.end(cb); }, eventThrottle.delay);
    },
    eventThrottle.end = function(cb){
        eventThrottle.timeout = false;
        if(typeof(cb) == "function")
            cb();
    };
    window.eventThrottle = eventThrottle;
})(window);