const net = require('net');

const server = net.createServer((c) => {
    console.log('Client connected');
    
    c.on('end', () => {
        console.log('client disconected');
        server.getConnections((err, count) => {
            console.log(count);
        });
    
    });

    c.on('data', (data) => {
        console.log(data.toString());
    });

    c.write('Tekst hello\r\n');
    
    server.getConnections((err, count) => {
        console.log(count);
    });

});


server.on('error', (err) => {
    console.log(err);
});

server.listen(8111, () => {
    console.log('słucham');
});