const express = require('express');
const { requestInterceptor } = require('../dist');

const app = express();

// Aplicar o middleware para todas as rotas
app.use(requestInterceptor({
  parseBody: true,
  maxBodySize: 1024 * 1024, // 1MB
  onRequest: (req, requestInfo) => {
    console.log('\n=== Detalhes da Requisição ===');
    console.log(`Método: ${requestInfo.method}`);
    console.log(`URL: ${requestInfo.url}`);
    console.log(`Timestamp: ${requestInfo.timestamp}`);
    console.log(`IP do Cliente: ${requestInfo.clientIp}`);
    console.log(`Duração: ${requestInfo.duration}ms`);
    console.log('Headers:', JSON.stringify(requestInfo.headers, null, 2));
    
    if (requestInfo.body) {
      console.log('Corpo:', JSON.stringify(requestInfo.body, null, 2));
    }
    
    console.log('===========================\n');
  }
}));

// Rota GET simples
app.get('/', (req, res) => {
  res.send('Servidor de teste para o Request Interceptor');
});

// Rota POST para testar a interceptação do corpo
app.post('/api/data', (req, res) => {
  res.json({
    success: true,
    message: 'Dados recebidos com sucesso',
    receivedData: req.body
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Faça algumas requisições para ver o interceptor em ação!');
  console.log('Exemplos:');
  console.log(`- GET: curl http://localhost:${PORT}/`);
  console.log(`- POST: curl -X POST -H "Content-Type: application/json" -d '{"name":"teste","value":123}' http://localhost:${PORT}/api/data`);
}); 