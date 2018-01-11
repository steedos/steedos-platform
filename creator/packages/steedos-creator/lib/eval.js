Creator.evalInContext = function(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { 
    	return eval(js); 
	}.call(context);
}
