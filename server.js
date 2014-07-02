#!/bin/env node

var express = require('express');
var fs      = require('fs');

var app = express();


/* Tratadores de requisicao */

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

/* Inicia o servidor */

var addr = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, addr);

console.log("App iniciado em %s:%s", addr, port);
