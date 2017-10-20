const net = require('net');


const socket = new net.Socket();


socket.connect(8111, () => {
    console.log('Client połączony');
});

socket.on('data', (data) => {
    console.log(data.toString());

    console.log(socket.address());

    socket.write('TEST\n');
    
})

socket.on('end', () => {
    console.log('Client odłączony');
});

socket.on('error', (err) => {
    console.log(err);
});

// const client = net.createConnection(8111, () => {
//     console.log('Client połączony');
// });

// client.on('data', (data) => {
//     console.log(data.toString());

//   //  client.write('otrzymałem');

// });

// client.on('end', () => {
//     console.log('Client odłączony');
// });