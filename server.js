#!/usr/bin/env node

var addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

///////////////////////////////////////////////////////////////////////////////

/*
 * Exemplo Express.
 */

var express = require('express');
var fs      = require('fs');

var app = express();

app.get('/env', function(req, res){
  var content = 'Version: ' + process.version + '\n<br/>\n' +
                'Env: {<br/><pre>';

  var vars = Object.keys(process.env).sort();
  for (var i in vars) {
     content += '   ' + vars[i] + ': ' + process.env[vars[i]] + '\n';
  }
  content += '}\n</pre><br/>\n'
  res.send(content);
  res.send('<html>\n' +
           '  <head><title>Node.js Process Env</title></head>\n' +
           '  <body>\n<br/>\n' + content + '</body>\n</html>');
});

app.get('/health', function(req, res) {
  res.send('1')
});

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(fs.readFileSync('./index.html'));
});

app.listen(port, addr);

console.log("App express em %s:%s", addr, port);

///////////////////////////////////////////////////////////////////////////////

/*
 * Exemplo WebSocket.
 *
 * Para usar, descomente a linha com a dependencia do modulo "ws"
 * no arquivo package.js e comente o exemplo de express acima.
 */
/*
var ws  = require('ws');
var wss = new ws.Server({host: addr, port: port});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('received: %s', message);
    ws.send('replay: "' + message + '"');
  });

  ws.on('close', function(code, message) {
    console.log('disconnected');
  });
});

console.log("WebSocket escutando em ws://%s:%s", addr, port);
*/

///////////////////////////////////////////////////////////////////////////////

/* Tratadores de sinais */

var terminator = function(sig) {

  if (typeof sig === "string") {
    console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
    process.exit(1);
  }
  console.log('%s: Node server stopped.', Date(Date.now()) );
};

process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
  process.on(element, function() { terminator(element); });
});

