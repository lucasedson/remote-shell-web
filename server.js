const express = require('express');
const WebSocket = require('ws');
const { exec } = require('child_process');
const app = express();
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

// Servindo o frontend (pode ser um arquivo HTML simples, como o que discutimos mais tarde)
app.use(express.static('public'));

// Configuração do WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  
  // Quando o servidor receber um comando do cliente, ele executa o comando no shell
  ws.on('message', (data) => {
    // Certifique-se de que o comando recebido seja uma string
    const command = data.toString(); // Converte o Buffer em string

    console.log('Comando recebido: ', command);
    
    // Executa o comando no shell
    exec(command, (error, stdout, stderr) => {
      if (error) {
        ws.send(`Erro: ${error.message}`);
        return;
      }
      if (stderr) {
        ws.send(`stderr: ${stderr}`);
        return;
      }
      ws.send(stdout); // Envia o resultado de volta para o cliente
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
