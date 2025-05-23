/**
 * 🧪 Teste Rápido para Build/Publish
 * 
 * Este teste verifica se a biblioteca pode ser importada e usada corretamente
 * sem iniciar um servidor persistente, ideal para workflows de CI/CD.
 */

const express = require('express');
const { requestInterceptor, MetricsCollector, HttpLogger } = require('../dist');

console.log('🧪 Iniciando teste rápido da biblioteca...');

// Teste 1: Verificar se todas as exportações estão disponíveis
console.log('\n1. ✅ Verificando exportações...');
if (typeof requestInterceptor !== 'function') {
  throw new Error('requestInterceptor não é uma função');
}
if (typeof MetricsCollector !== 'function') {
  throw new Error('MetricsCollector não é uma função');
}
if (typeof HttpLogger !== 'function') {
  throw new Error('HttpLogger não é uma função');
}
console.log('   ✅ Todas as exportações estão corretas');

// Teste 2: Verificar se o middleware pode ser criado
console.log('\n2. ✅ Testando criação do middleware...');
const middleware = requestInterceptor({
  enableLogging: true,
  enablePerformanceMonitoring: true,
  enableAuditLogging: false
});
if (typeof middleware !== 'function') {
  throw new Error('requestInterceptor() não retornou uma função de middleware');
}
console.log('   ✅ Middleware criado com sucesso');

// Teste 3: Verificar sistema de métricas
console.log('\n3. ✅ Testando sistema de métricas...');
const metricsCollector = MetricsCollector.getInstance();
if (!metricsCollector || typeof metricsCollector.getMetrics !== 'function') {
  throw new Error('MetricsCollector não está funcionando corretamente');
}
console.log('   ✅ Sistema de métricas funcionando');

// Teste 4: Verificar sistema de logging
console.log('\n4. ✅ Testando sistema de logging...');
const logger = new HttpLogger('info');
if (!logger || typeof logger.log !== 'function') {
  throw new Error('HttpLogger não está funcionando corretamente');
}
console.log('   ✅ Sistema de logging funcionando');

// Teste 5: Verificar se pode ser usado com Express
console.log('\n5. ✅ Testando integração com Express...');
const app = express();
try {
  app.use(requestInterceptor({
    parseBody: true,
    enableLogging: false // Silencioso para o teste
  }));
  console.log('   ✅ Integração com Express funcionando');
} catch (error) {
  throw new Error(`Erro na integração com Express: ${error.message}`);
}

// Teste 6: Verificar configurações padrão
console.log('\n6. ✅ Testando configurações padrão...');
const defaultMiddleware = requestInterceptor();
if (typeof defaultMiddleware !== 'function') {
  throw new Error('Configurações padrão não funcionam');
}
console.log('   ✅ Configurações padrão funcionando');

console.log('\n🎉 Todos os testes passaram com sucesso!');
console.log('✅ A biblioteca está pronta para ser publicada');
console.log('📦 Imports: OK');
console.log('🔧 Middleware: OK'); 
console.log('📊 Métricas: OK');
console.log('📝 Logging: OK');
console.log('🚀 Express: OK');

process.exit(0); 