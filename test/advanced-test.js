const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { requestInterceptor, MetricsCollector, HttpLogger } = require('../dist');

// Sistema de logging para arquivo
const logFilePath = path.join(__dirname, 'requests.log');
const auditLogPath = path.join(__dirname, 'audit.log');

// Logger personalizado que escreve em arquivo
const customLogger = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  if (level === 'info' && message.includes('AUDIT:')) {
    // Log de auditoria em arquivo separado
    fs.appendFileSync(auditLogPath, logEntry + (data ? JSON.stringify(data, null, 2) + '\n' : ''));
  } else {
    // Log geral
    fs.appendFileSync(logFilePath, logEntry + (data ? JSON.stringify(data, null, 2) + '\n' : ''));
  }
  
  // Também mostra no console
  console.log(`${logEntry}${data ? JSON.stringify(data, null, 2) : ''}`);
};

// Configuração do servidor Express
const app = express();

// Aplicação do middleware interceptador com todas as funcionalidades habilitadas
app.use(requestInterceptor({
  parseBody: true,
  maxBodySize: 2 * 1024 * 1024, // 2MB
  enableLogging: true,
  logLevel: 'debug',
  enablePerformanceMonitoring: true,
  enableAuditLogging: true,
  customLogger,
  onRequest: (req, requestInfo) => {
    console.log(`\n🔍 INTERCEPTADO: ${requestInfo.method} ${requestInfo.url}`);
    console.log(`📊 Duração: ${requestInfo.duration}ms | Tamanho: ${requestInfo.bodySize || 0} bytes`);
    console.log(`🌐 IP: ${requestInfo.clientIp} | User-Agent: ${requestInfo.userAgent?.substring(0, 50)}...`);
  }
}));

// Rotas de teste para diferentes cenários
app.get('/api/fast', (req, res) => {
  res.json({ message: 'Rota rápida', timestamp: new Date().toISOString() });
});

app.get('/api/slow', async (req, res) => {
  // Simula uma operação lenta
  await new Promise(resolve => setTimeout(resolve, 1200));
  res.json({ message: 'Rota lenta (>1s)', timestamp: new Date().toISOString() });
});

app.post('/api/data', (req, res) => {
  res.json({
    success: true,
    message: 'Dados processados',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

app.put('/api/large-data', (req, res) => {
  res.json({
    success: true,
    message: 'Dados grandes processados',
    dataSize: JSON.stringify(req.body).length,
    timestamp: new Date().toISOString()
  });
});

// Rota para visualizar métricas de performance
app.get('/metrics', (req, res) => {
  const metricsCollector = MetricsCollector.getInstance();
  const metrics = metricsCollector.getMetrics();
  
  const formattedMetrics = Object.entries(metrics).map(([route, data]) => ({
    route,
    requestCount: data.count,
    averageDuration: `${data.averageDuration.toFixed(2)}ms`,
    minDuration: `${data.minDuration}ms`,
    maxDuration: `${data.maxDuration}ms`,
    lastRequest: data.lastRequest
  }));
  
  res.json({
    summary: {
      totalRoutes: Object.keys(metrics).length,
      totalRequests: Object.values(metrics).reduce((sum, m) => sum + m.count, 0)
    },
    routeMetrics: formattedMetrics
  });
});

// Rota para limpar logs
app.delete('/logs', (req, res) => {
  try {
    if (fs.existsSync(logFilePath)) fs.unlinkSync(logFilePath);
    if (fs.existsSync(auditLogPath)) fs.unlinkSync(auditLogPath);
    res.json({ message: 'Logs limpos com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao limpar logs' });
  }
});

// Iniciar o servidor
const server = app.listen(3000, () => {
  console.log('🚀 Servidor de testes avançados rodando na porta 3000');
  console.log('📝 Logs salvos em:', logFilePath);
  console.log('🔍 Logs de auditoria salvos em:', auditLogPath);
  console.log('\nExecutando testes automatizados...\n');
  
  // Executa os testes após o servidor iniciar
  runAdvancedTests().then(() => {
    console.log('\n✅ Todos os testes avançados executados!');
    console.log('\n📊 Para ver as métricas: curl http://localhost:3000/metrics');
    console.log('📄 Para ver os logs: cat ' + logFilePath);
    console.log('🔍 Para ver auditoria: cat ' + auditLogPath);
    console.log('\nTestes manuais disponíveis:');
    console.log('- Rota rápida:  curl http://localhost:3000/api/fast');
    console.log('- Rota lenta:   curl http://localhost:3000/api/slow');
    console.log('- POST dados:   curl -X POST -H "Content-Type: application/json" -d \'{"usuario":"teste","dados":[1,2,3]}\' http://localhost:3000/api/data');
    console.log('- Dados grandes: curl -X PUT -H "Content-Type: application/json" -d \'{"dados":"' + 'x'.repeat(1000) + '"}\' http://localhost:3000/api/large-data');
    console.log('- Métricas:     curl http://localhost:3000/metrics');
    console.log('\nPressione Ctrl+C para encerrar.');
  }).catch(err => {
    console.error('❌ Erro nos testes:', err);
    server.close();
    process.exit(1);
  });
});

// Função para executar testes automatizados avançados
async function runAdvancedTests() {
  // Espera para garantir que o servidor está pronto
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('🧪 1. Testando rota rápida...');
  await makeRequest('GET', '/api/fast');
  
  console.log('\n🧪 2. Testando rota lenta (para detectar performance)...');
  await makeRequest('GET', '/api/slow');
  
  console.log('\n🧪 3. Testando POST com dados estruturados...');
  await makeRequest('POST', '/api/data', {
    usuario: 'teste-automatico',
    dados: [1, 2, 3, 4, 5],
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  });
  
  console.log('\n🧪 4. Testando PUT com dados grandes...');
  await makeRequest('PUT', '/api/large-data', {
    dados: 'x'.repeat(500),
    array: new Array(100).fill('test-data'),
    nested: {
      level1: {
        level2: {
          data: 'dados aninhados'
        }
      }
    }
  });
  
  console.log('\n🧪 5. Fazendo múltiplas requisições para estatísticas...');
  for (let i = 0; i < 5; i++) {
    await makeRequest('GET', '/api/fast');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🧪 6. Testando JSON inválido...');
  await makeRequestRaw('POST', '/api/data', '{"invalid": json}');
  
  console.log('\n📊 7. Coletando métricas finais...');
  await makeRequest('GET', '/metrics');
}

// Função auxiliar para fazer requisições HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Advanced-Test-Client/1.0'
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
          console.log(`  ✅ Resposta: ${res.statusCode}`);
          resolve(parsedData);
        } catch (e) {
          console.log(`  ✅ Resposta: ${res.statusCode} (texto)`);
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`  ❌ Erro: ${error.message}`);
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Função para enviar dados raw (para testar JSON inválido)
function makeRequestRaw(method, path, rawData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Advanced-Test-Client/1.0'
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`  ✅ Resposta: ${res.statusCode}`);
        resolve(responseData);
      });
    });
    
    req.on('error', (error) => {
      console.error(`  ❌ Erro: ${error.message}`);
      reject(error);
    });
    
    req.write(rawData);
    req.end();
  });
} 