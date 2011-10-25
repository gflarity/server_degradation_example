var net = require('net');

var socket = net.createConnection(  1337, 'localhost' );

var onConnect = function onConnect( ) {
    
    
    //forever!?
    while( 1 ) {
        
        var time = new Date().getTime();
        if ( socket.write( '' + time + '\n' ) ) {
            //successfully passed of to the kernel   
        }
        else {
            //buffered in user space, the reader can't keep up!
            console.log('the reader can\'t keep up, exiting!');
            process.exit(0);
        }
        
    }
 
 
};

socket.on( 'connect', onConnect );
