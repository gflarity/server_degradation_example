var net = require('net');


var GLOBAL_DELTA_AVERAGE = 0;

//everytime we get some data, we calculate the latency
var BUSY_LOOP_MAX = 0;
    
    var incrementBusyLoopGradually = function() {
        BUSY_LOOP_MAX = BUSY_LOOP_MAX + 100000;
    };
    
var print_delta_average = function() {
    
    console.log( 'busy loop size: ' + BUSY_LOOP_MAX + ', Latest average latency: ' + GLOBAL_DELTA_AVERAGE );    
}

setInterval(  print_delta_average, 1000 );

var onConnect = function onConnect( socket ) {

    socket.setEncoding( 'utf8' );

    setInterval( incrementBusyLoopGradually, 1000 );
    
    var onData = function onData( data ) {
        
        //this simulates the message broker 'thinking'... poorly 
        var foo = 0; 
        for ( var i = 0; i < BUSY_LOOP_MAX; i++ ) {            
            foo = i; //do something so this loop doesn't get optmized away for some reason
        }
        
        
        //many timestamps can actually be glommed together here, split them    
        var timestamps = data.split( '\n' );
        var now = new Date().getTime();
        for ( var i = 0; i < timestamps.length; i++ ) {
            var timestamp = timestamps[i];        
            
            if ( timestamp.length === 0 || timestamp.length < 13 ) {
                //we skip this one, normally I'd add partials together but I'm pressed for time   
                continue;
            }
            
            var delta = now - timestamp;

            //console.log('delta: ' + delta);
            //console.log( 'timestamp length: ' + timestamp.length ); 
            //running average, over time this will get longer and longer
            GLOBAL_DELTA_AVERAGE = Math.floor( ( GLOBAL_DELTA_AVERAGE + delta ) / 2 );
            
        }
    
        
    };
    
    socket.on( 'data', onData );
    
    
};

var server = net.createServer( onConnect );
server.listen(1337);
