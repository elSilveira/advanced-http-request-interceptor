const express = require('express');
const http = require('http');
const { requestInterceptor } = require('../dist');

// Cria um registro de todas as requisições interceptadas
const requests = [];

// Configuração do servidor Express
const app = express();

// Aplica o middleware interceptador
app.use(requestInterceptor({
  parseBody: true,
  onRequest: (req, requestInfo) => {
    console.log(`\n[${requestInfo.timestamp}] Interceptada: ${requestInfo.method} ${requestInfo.url}`);
    requests.push(requestInfo);
  }
}));

// Rota de teste GET
app.get('/api/teste', (req, res) => {
  res.json({ message: 'GET bem-sucedido' });
});

// Rota de teste POST
app.post('/api/teste', (req, res) => {
  res.json({ 
    message: 'POST bem-sucedido',
    receivedData: req.body
  });
});

// Rota para visualizar as requisições interceptadas
app.get('/requests', (req, res) => {
  res.json(requests);
});

// Iniciar o servidor
const server = app.listen(3000, () => {
  console.log('Servidor de testes rodando na porta 3000');
  console.log('Executando testes automatizados...');
  
  // Executa os testes após o servidor iniciar
  runTests().then(() => {
    console.log('\n✅ Todos os testes executados com sucesso!');
    console.log('\nRequisições interceptadas:');
    console.table(requests.map(r => ({
      método: r.method,
      url: r.url,
      duração: r.duration + 'ms',
      corpo: r.body ? JSON.stringify(r.body).substring(0, 30) : 'N/A'
    })));
    
    console.log('\nO servidor continua em execução para testes manuais.');
    console.log('Para testar manualmente, tente estas requisições:');
    console.log('- GET:  curl http://localhost:3000/api/teste');
    console.log('- POST: curl -X POST -H "Content-Type: application/json" -d \'{"nome":"teste","valor":123}\' http://localhost:3000/api/teste');
    console.log('- VER:  curl http://localhost:3000/requests');
    console.log('\nPressione Ctrl+C para encerrar.');
  }).catch(err => {
    console.error('❌ Erro nos testes:', err);
    server.close();
    process.exit(1);
  });
});

// Função para executar os testes automatizados
async function runTests() {
  // Espera um pouco para garantir que o servidor está pronto
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('\n1. Testando requisição GET...');
  await makeRequest('GET', '/api/teste');
  
  console.log('\n2. Testando requisição POST com dados...');
  await makeRequest('POST', '/api/teste', { nome: 'teste automático', valor: 42 });
  
  console.log('\n3. Testando requisição com query params...');
  await makeRequest('GET', '/api/teste?param1=valor1&param2=valor2');
}

// Função auxiliar para fazer uma requisição HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          console.log(`  Resposta: ${res.statusCode} ${JSON.stringify(parsedData)}`);
          resolve(parsedData);
        } catch (e) {
          console.log(`  Resposta: ${res.statusCode} ${responseData}`);
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`  Erro: ${error.message}`);
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
} 