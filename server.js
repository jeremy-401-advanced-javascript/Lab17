"use strict";

const net = require("net");

const port = process.env.PORT || 3001;
const server = net.createServer();

server.listen(port, () => console.log(`Server up on ${port}`));

let allowedEvents = ["save", "err"];

let socketPool = {};

server.on("connection", socket => {
  const id = `Socket-${Math.random()}`;
  socketPool[id] = socket;
  console.log("Welcome ", id);
  socket.on("data", (buffer) => dispatchEvent(buffer));
  socket.on("close", () => {
    delete socketPool[id];
  });
});

let dispatchEvent = buffer => {
  console.log("incomning buffer", buffer);
  let text = buffer.toString().trim();
  let [event, playload] = text.split(/\s+(.*)/);

  console.log(event, playload);

  if (allowedEvents.includes(event)) {
    let obj = { event, playload };
    console.log(obj)
    let text = JSON.stringify(obj);
    console.log(text)
    for (let socket in socketPool) {
      socketPool[socket].write(text);
    }
  } else {
    console.log(`IGNORE ${event}`);
  }
};

// 'use strict';

// const net = require('net');

// const port = process.env.PORT || 3001;
// const server = net.createServer();

// server.listen(port, () => console.log(`Server up on ${port}`) );
// let allowedEvents = ['save','err'];

// let socketPool = {};

// server.on('connection', (socket) => {
//   const id = `Socket-${Math.random()}`;
//   socketPool[id] = socket;
//   console.log("Welcome", id);
//   socket.on('data', (buffer) => dispatchEvent(buffer));
//   socket.on('close', () => {
//     delete socketPool[id];
//   });
// });

// let dispatchEvent = (buffer) => {
//   let text = buffer.toString().trim();
//   let [event,payload] = text.split(/\s+(.*)/);

//   // Push to the pool that matches the event name
//   if ( allowedEvents.includes(event) ) {

//     let eventPayload = {event,payload};

//     for (let socket in socketPool) {
//       socketPool[socket].write(JSON.stringify(eventPayload));
//     }
//   }
//   else {
//     console.log(`IGNORE ${event}`);
//   }
// };
