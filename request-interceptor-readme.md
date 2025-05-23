# Request Interceptor

Uma biblioteca simples para interceptar e analisar requisições HTTP em aplicações Express.

[![NPM Version](https://img.shields.io/npm/v/request-interceptor.svg)](https://www.npmjs.com/package/request-interceptor)
[![License](https://img.shields.io/npm/l/request-interceptor.svg)](https://github.com/seunome/request-interceptor/blob/master/LICENSE)

## Sumário

- [Instalação](#instalação)
- [Características](#características)
- [Uso Básico](#uso-básico)
- [Opções](#opções)
- [Estrutura do Objeto requestInfo](#estrutura-do-objeto-requestinfo)
- [Exemplos Avançados](#exemplos-avançados)
- [Suporte a TypeScript](#suporte-a-typescript)
- [Compatibilidade](#compatibilidade)
- [Resolução de Problemas](#resolução-de-problemas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

### Via NPM

```bash
npm install request-interceptor
```

### Via Yarn

```bash
yarn add request-interceptor
```

### Dependências

Esta biblioteca requer:
- Node.js >= 12.x
- Express.js >= 4.x

## Características

- ✅ Intercepta requisições HTTP
- ✅ Analisa o corpo da requisição automaticamente
- ✅ Limita o tamanho do corpo da requisição
- ✅ Fornece informações detalhadas sobre a requisição
- ✅ Permite processamento personalizado através de callbacks
- ✅ Compatível com TypeScript
- ✅ Leve e com performance otimizada
- ✅ Fácil integração com Express.js
- ✅ Sem dependências extras

## Uso Básico

### CommonJS

```javascript
const express = require('express');
const { requestInterceptor } = require('request-interceptor');

const app = express();

// Aplicar o middleware de interceptação
app.use(requestInterceptor({
  parseBody: true,
  maxBodySize: 1024 * 1024, // 1MB
  onRequest: (req, requestInfo) => {
    console.log(`Requisição recebida: ${requestInfo.method} ${requestInfo.url}`);
    console.log(`Corpo da requisição:`, requestInfo.body);
    console.log(`Duração: ${requestInfo.duration}ms`);
  }
}));

// Suas rotas aqui
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

### ES Modules / TypeScript

```typescript
import express from 'express';
import { requestInterceptor } from 'request-interceptor';

const app = express();

// Aplicar o middleware de interceptação
app.use(requestInterceptor({
  parseBody: true,
  maxBodySize: 1024 * 1024, // 1MB
  onRequest: (req, requestInfo) => {
    console.log(`Requisição recebida: ${requestInfo.method} ${requestInfo.url}`);
    console.log(`Corpo da requisição:`, requestInfo.body);
    console.log(`Duração: ${requestInfo.duration}ms`);
  }
}));

// Suas rotas aqui
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

## Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `parseBody` | boolean | `true` | Se deve analisar o corpo da requisição |
| `maxBodySize` | number | `1048576` (1MB) | Tamanho máximo do corpo da requisição em bytes |
| `onRequest` | function | undefined | Função chamada com as informações da requisição |

## Estrutura do Objeto requestInfo

```typescript
{
  method: string;       // Método HTTP (GET, POST, etc.)
  url: string;          // URL da requisição
  headers: object;      // Cabeçalhos HTTP
  query: object;        // Parâmetros de consulta
  params: object;       // Parâmetros de rota
  timestamp: string;    // Data e hora ISO
  clientIp: string;     // IP do cliente
  body: any;            // Corpo da requisição
  duration: number;     // Duração da requisição em ms
}
```

## Exemplos Avançados

### 1. Logging de requisições para arquivo

```javascript
const express = require('express');
const fs = require('fs');
const { requestInterceptor } = require('request-interceptor');

const app = express();
const logStream = fs.createWriteStream('requests.log', { flags: 'a' });

app.use(requestInterceptor({
  onRequest: (req, requestInfo) => {
    const logEntry = `[${requestInfo.timestamp}] ${requestInfo.method} ${requestInfo.url} - IP: ${requestInfo.clientIp} - Duration: ${requestInfo.duration}ms\n`;
    logStream.write(logEntry);
  }
}));

app.listen(3000);
```

### 2. Filtragem de requisições por rota

```javascript
const express = require('express');
const { requestInterceptor } = require('request-interceptor');

const app = express();

// Interceptação apenas para rotas específicas
app.use('/api', requestInterceptor({
  onRequest: (req, requestInfo) => {
    console.log(`API Request: ${requestInfo.method} ${requestInfo.url}`);
  }
}));

app.listen(3000);
```

### 3. Monitoramento de desempenho

```javascript
const express = require('express');
const { requestInterceptor } = require('request-interceptor');

const app = express();
const requestStats = {
  count: 0,
  totalDuration: 0,
  maxDuration: 0,
  slowRequests: []
};

app.use(requestInterceptor({
  onRequest: (req, requestInfo) => {
    // Atualiza estatísticas
    requestStats.count++;
    requestStats.totalDuration += requestInfo.duration;
    
    // Rastreia requisições lentas (>500ms)
    if (requestInfo.duration > 500) {
      requestStats.slowRequests.push({
        url: requestInfo.url,
        method: requestInfo.method,
        duration: requestInfo.duration,
        timestamp: requestInfo.timestamp
      });
    }
    
    // Atualiza a duração máxima
    if (requestInfo.duration > requestStats.maxDuration) {
      requestStats.maxDuration = requestInfo.duration;
    }
  }
}));

// Rota para exibir estatísticas
app.get('/stats', (req, res) => {
  const avgDuration = requestStats.count > 0 
    ? requestStats.totalDuration / requestStats.count 
    : 0;
    
  res.json({
    totalRequests: requestStats.count,
    averageDuration: avgDuration.toFixed(2) + 'ms',
    maxDuration: requestStats.maxDuration + 'ms',
    slowRequests: requestStats.slowRequests.slice(-10) // últimas 10 requisições lentas
  });
});

app.listen(3000);
```

## Suporte a TypeScript

Esta biblioteca inclui definições de tipo TypeScript. Você pode usar as seguintes interfaces em seu código:

```typescript
import { RequestInterceptorOptions } from 'request-interceptor';

const options: RequestInterceptorOptions = {
  parseBody: true,
  maxBodySize: 2 * 1024 * 1024, // 2MB
  onRequest: (req, requestInfo) => {
    // seu código aqui
  }
};
```

## Compatibilidade

- ✅ Express 4.x e 5.x
- ✅ Node.js 12.x e superior
- ✅ TypeScript 4.x e superior

## Resolução de Problemas

### O corpo da requisição não está sendo capturado

Certifique-se de que:
1. A opção `parseBody` está configurada como `true` (padrão)
2. A requisição tem um `Content-Type` apropriado (como `application/json`)
3. O tamanho do corpo não excede o `maxBodySize` configurado

### Erro "Payload too large"

Este erro ocorre quando o corpo da requisição excede o tamanho máximo definido em `maxBodySize`. Soluções:

1. Aumente o valor de `maxBodySize` ao inicializar o middleware
2. Reduza o tamanho do corpo nas requisições do cliente

```javascript
// Aumentar o limite para 10MB
app.use(requestInterceptor({
  maxBodySize: 10 * 1024 * 1024
}));
```

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

Por favor, certifique-se de atualizar os testes conforme apropriado.

## Licença

MIT 