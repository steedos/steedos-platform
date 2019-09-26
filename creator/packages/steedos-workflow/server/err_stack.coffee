process.on 'uncaughtException', (err)->
	console.log "---------------------uncaughtException----------------------------"
	console.log(err.stack);
	throw err;
	console.log "---------------------uncaughtException end----------------------------"
