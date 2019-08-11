
'use strict';

const fs = require('fs');
const util = require('util');
const net = require('net');
const client = new net.Socket();
//172.16.1.18
//localhost
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

client.connect(3001, 'localhost', () => {
  console.log('Wassup!');
});
const loadFile = (file) => readFile(file);
const saveFile = (file, buffer) => writeFile(file, buffer);
const convertBuffer = buffer => Buffer.from(buffer.toString().trim().toUpperCase());
const alterFile = (file) => {
 console.log('file 27 :', file);
 return loadFile(file)
  .then(contents => convertBuffer(contents))
  .then(buffer => saveFile(file, buffer))
  .then( () => client.write(`save ${file}`) && client.end())
  .catch( error => client.write(`${error}`) && client.end())
};
let file = process.argv.slice(2).shift();
alterFile(file);