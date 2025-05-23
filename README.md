# Request Interceptor

Uma biblioteca completa para interceptar, analisar e monitorar requisições HTTP em aplicações Express com logging avançado, métricas de performance e auditoria.

[![NPM Version](https://img.shields.io/npm/v/request-interceptor.svg)](https://www.npmjs.com/package/request-interceptor)
[![License](https://img.shields.io/npm/l/request-interceptor.svg)](https://github.com/seunome/request-interceptor/blob/master/LICENSE)

## 🚀 Características Principais

- ✅ **Interceptação Completa**: Captura todas as requisições HTTP
- ✅ **Logging Detalhado**: Sistema de logging avançado com níveis configuráveis
- ✅ **Monitoramento de Performance**: Métricas por rota em tempo real
- ✅ **Captura Estruturada**: Análise inteligente do corpo das requisições
- ✅ **Métricas de Duração**: Estatísticas completas de tempo de resposta
- ✅ **Logging de Auditoria**: Registro detalhado de IPs, headers e dados para segurança
- ✅ **Logger Personalizado**: Suporte a sistemas de logging externos
- ✅ **TypeScript**: Suporte completo com tipagens
- ✅ **Zero Dependências**: Leve e eficiente

## 📦 Instalação

```bash
npm install request-interceptor
```

## 🔧 Uso Básico

```javascript
const express = require('express');
const { requestInterceptor } = require('request-interceptor');

const app = express();

app.use(requestInterceptor({
  enableLogging: true,
  enablePerformanceMonitoring: true,
  enableAuditLogging: true
}));

app.listen(3000);
```

## ⚙️ Configuração Completa

```javascript
const { requestInterceptor } = require('request-interceptor');

app.use(requestInterceptor({
  // Análise do corpo da requisição
  parseBody: true,
  maxBodySize: 2 * 1024 * 1024, // 2MB
  
  // Sistema de logging
  enableLogging: true,
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  
  // Monitoramento de performance
  enablePerformanceMonitoring: true,
  
  // Auditoria de segurança
  enableAuditLogging: true,
  
  // Logger personalizado
  customLogger: (level, message, data) => {
    // Sua implementação de logging
    console.log(`[${level}] ${message}`, data);
  },
  
  // Callback personalizado
  onRequest: (req, requestInfo) => {
    console.log(`${requestInfo.method} ${requestInfo.url} - ${requestInfo.duration}ms`);
  }
}));
```

## 📊 Monitoramento de Performance

### Coletando Métricas

```javascript
const { MetricsCollector } = require('request-interceptor');

// Rota para visualizar métricas
app.get('/metrics', (req, res) => {
  const metricsCollector = MetricsCollector.getInstance();
  const metrics = metricsCollector.getMetrics();
  
  res.json({
    totalRoutes: Object.keys(metrics).length,
    routeMetrics: metrics
  });
});
```

### Exemplo de Métricas Retornadas

```json
{
  "summary": {
    "totalRoutes": 5,
    "totalRequests": 12
  },
  "routeMetrics": [
    {
      "route": "/api/users",
      "requestCount": 150,
      "averageDuration": "45.67ms",
      "minDuration": "12ms",
      "maxDuration": "234ms",
      "lastRequest": "2025-05-23T06:11:14.955Z"
    }
  ]
}
```

## 📝 Sistema de Logging Avançado

### Logging para Arquivo

```javascript
const fs = require('fs');
const { requestInterceptor } = require('request-interceptor');

const customLogger = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  // Log geral
  fs.appendFileSync('requests.log', logEntry + JSON.stringify(data, null, 2) + '\n');
  
  // Log de auditoria separado
  if (message.includes('AUDIT:')) {
    fs.appendFileSync('audit.log', logEntry + JSON.stringify(data, null, 2) + '\n');
  }
};

app.use(requestInterceptor({
  enableLogging: true,
  enableAuditLogging: true,
  customLogger
}));
```

### Estrutura dos Logs

#### Log de Requisição
```json
{
  "method": "POST",
  "url": "/api/users",
  "path": "/api/users",
  "clientIp": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "duration": 45,
  "bodySize": 256,
  "timestamp": "2025-05-23T06:11:14.955Z"
}
```

#### Log de Auditoria
```json
{
  "timestamp": "2025-05-23T06:11:14.955Z",
  "method": "POST",
  "url": "/api/users",
  "clientIp": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "headers": {
    "authorization": "Bearer xxx",
    "content-type": "application/json"
  },
  "body": {
    "name": "João",
    "email": "joao@example.com"
  },
  "duration": 45
}
```

## 🛡️ Recursos de Segurança

### Detecção de Requisições Suspeitas

```javascript
app.use(requestInterceptor({
  enableAuditLogging: true,
  onRequest: (req, requestInfo) => {
    // Detecta requisições muito grandes
    if (requestInfo.bodySize > 1024 * 1024) {
      console.warn(`⚠️ Large request: ${requestInfo.bodySize} bytes from ${requestInfo.clientIp}`);
    }
    
    // Detecta requisições lentas
    if (requestInfo.duration > 1000) {
      console.warn(`⚠️ Slow request: ${requestInfo.duration}ms for ${requestInfo.url}`);
    }
    
    // Monitora IPs específicos
    if (requestInfo.clientIp === '192.168.1.100') {
      console.info(`👀 Monitoring IP: ${requestInfo.clientIp} - ${requestInfo.url}`);
    }
  }
}));
```

## 🧪 Exemplo Completo de Uso

```javascript
const express = require('express');
const fs = require('fs');
const { requestInterceptor, MetricsCollector } = require('request-interceptor');

const app = express();

// Logger personalizado
const logger = (level, message, data) => {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync('app.log', entry + (data ? JSON.stringify(data, null, 2) + '\n' : ''));
  console.log(entry, data || '');
};

// Aplicar interceptador
app.use(requestInterceptor({
  parseBody: true,
  maxBodySize: 5 * 1024 * 1024, // 5MB
  enableLogging: true,
  logLevel: 'debug',
  enablePerformanceMonitoring: true,
  enableAuditLogging: true,
  customLogger: logger,
  onRequest: (req, requestInfo) => {
    // Lógica personalizada aqui
    if (requestInfo.duration > 500) {
      logger('warn', `Slow request detected: ${requestInfo.url} took ${requestInfo.duration}ms`);
    }
  }
}));

// Suas rotas
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'João' }]);
});

app.post('/api/users', (req, res) => {
  res.json({ success: true, user: req.body });
});

// Rota de métricas
app.get('/health/metrics', (req, res) => {
  const metricsCollector = MetricsCollector.getInstance();
  res.json(metricsCollector.getMetrics());
});

app.listen(3000, () => {
  console.log('🚀 Servidor rodando com interceptador completo!');
});
```

## 📈 Casos de Uso

### 1. **API Monitoring**
- Monitoramento de performance de APIs
- Detecção de endpoints lentos
- Análise de padrões de uso

### 2. **Security Auditing**
- Log de todas as requisições para auditoria
- Rastreamento de IPs suspeitos
- Monitoramento de payloads grandes

### 3. **Debugging**
- Análise detalhada de requisições problemáticas
- Inspeção de headers e corpo das requisições
- Rastreamento de erros

### 4. **Analytics**
- Coleta de métricas de uso
- Análise de rotas mais utilizadas
- Estatísticas de performance

## 🔧 TypeScript

```typescript
import { requestInterceptor, RequestInterceptorOptions, MetricsCollector } from 'request-interceptor';

const options: RequestInterceptorOptions = {
  enableLogging: true,
  logLevel: 'info',
  enablePerformanceMonitoring: true,
  onRequest: (req, requestInfo) => {
    // Seu código aqui
  }
};

app.use(requestInterceptor(options));
```

## 🧪 Testando

Execute o teste completo:

```bash
# Teste básico
node test/test-interceptor.js

# Teste avançado com todas as funcionalidades
node test/advanced-test.js
```

O teste avançado demonstra:
- ✅ Logging detalhado em arquivo
- ✅ Monitoramento de performance
- ✅ Detecção de requisições lentas
- ✅ Captura de dados estruturados
- ✅ Logs de auditoria
- ✅ Métricas por rota
- ✅ Tratamento de JSON inválido

## 📄 Licença

MIT 