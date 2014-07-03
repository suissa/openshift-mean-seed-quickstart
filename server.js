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

/*
 * Exemplo Mongoose.
 * Referencia: http://mongoosejs.com/docs/index.html
 */
/*
var mongoose = require('mongoose');

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
  var mongodburl = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
} else {
  var mongodburl = 'mongodb://127.0.0.1/gato';
}

mongoose.connect(mongodburl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Conexao aberta com MongoDB: %s', mongodburl);

  // define nosso schema
  var gatoSchema = mongoose.Schema({
    name: String
  });

  // cria metodo "falar" no model
  gatoSchema.methods.falar = function () {
    return "Miau nome é " + this.name + '\n';
  }

  // instancia o model
  var Gato = mongoose.model('Gato', gatoSchema)

  //
  // Tratamento de requisicoes
  //

  // registra um gato
  // POST /gato/<nome>
  app.post(/^\/gato\/(\w+)/, function(req, res) {
    var name = req.params[0];
    var gato = new Gato({ name: name });
    gato.save()
    res.send(gato.falar());
  });

  // busca um gato
  // GET /gato/<nome>
  app.get(/^\/gato\/(\w+)/, function(req, res) {
    var name = req.params[0];
    Gato.findOne({name: name}, function (err, gato) {
      if (err || !gato) {
        res.status(404).send('404 Cat Not Found\n');
      } else {
        res.send(gato.falar());
      }
    });
  });

  // mostra todos os gatos
  // GET /gatos
  app.get('/gatos', function(req, res) {
    Gato.find(function (err, gatos) {
      res.send(gatos.map(function (g) { return g.name }).join(', ') + '\n');
    });
  });
});
*/

///////////////////////////////////////////////////////////////////////////////

/*
 * Exemplo WebSocket.
 * Referencia: http://einaros.github.io/ws/
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

/*
  Exemplo WebSocket cliente.
  Referencia: http://www.html5rocks.com/pt/tutorials/websockets/basics/

  var ws = new WebSocket('ws://' + location.hostname + ':8000');

  ws.onopen = function () {
    ws.send('Ping'); // Send the message 'Ping' to the server
  };

  // Loga erros
  ws.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };

  // Loga mensagem do servidor
  ws.onmessage = function (e) {
    console.log('Server: ' + e.data);
  };

  // Envia mensagem para o servidor
  ws.send("Alo mundo!");
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

