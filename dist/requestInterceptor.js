"use strict";
/**
 * 🚀 Advanced HTTP Request Interceptor
 *
 * Biblioteca profissional para interceptação, monitoramento e logging avançado
 * de requisições HTTP em aplicações Express.js
 *
 * @author Eduardo Luiz da Silveira
 * @version 1.0.0
 * @license MIT
 * @description Middleware Express completo com:
 * - ✅ Interceptação total de requisições HTTP
 * - ✅ Sistema de logging avançado com níveis configuráveis
 * - ✅ Métricas de performance por rota em tempo real
 * - ✅ Auditoria automática para compliance e segurança
 * - ✅ Detecção proativa de requisições lentas
 * - ✅ Suporte completo ao TypeScript
 * - ✅ Zero dependências externas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLogger = exports.MetricsCollector = void 0;
exports.requestInterceptor = requestInterceptor;
/**
 * 📊 Sistema de Coleta de Métricas (Singleton)
 *
 * Responsável por coletar, armazenar e fornecer estatísticas
 * de performance das requisições HTTP em tempo real.
 *
 * @class MetricsCollector
 * @pattern Singleton
 * @description Garante uma única instância para coleta centralizada de métricas
 */
class MetricsCollector {
    constructor() {
        this.routeMetrics = new Map();
    }
    /**
     * Retorna a instância singleton do coletor de métricas
     * @returns {MetricsCollector} Instância única do coletor
     */
    static getInstance() {
        if (!MetricsCollector.instance) {
            MetricsCollector.instance = new MetricsCollector();
        }
        return MetricsCollector.instance;
    }
    /**
     * Atualiza as métricas para uma rota específica
     *
     * @param route - Caminho da rota (ex: '/api/users')
     * @param duration - Duração da requisição em milissegundos
     * @param timestamp - Timestamp da requisição
     * @description Calcula automaticamente min, max, média e contador
     */
    updateMetrics(route, duration, timestamp) {
        const key = route;
        const existing = this.routeMetrics.get(key);
        if (existing) {
            // Atualiza métricas existentes
            existing.count++;
            existing.totalDuration += duration;
            existing.averageDuration = existing.totalDuration / existing.count;
            existing.minDuration = Math.min(existing.minDuration, duration);
            existing.maxDuration = Math.max(existing.maxDuration, duration);
            existing.lastRequest = timestamp;
        }
        else {
            // Cria nova entrada de métricas
            this.routeMetrics.set(key, {
                count: 1,
                totalDuration: duration,
                averageDuration: duration,
                minDuration: duration,
                maxDuration: duration,
                lastRequest: timestamp
            });
        }
    }
    /**
     * Retorna todas as métricas coletadas
     * @returns {Record<string, RouteMetrics>} Objeto com métricas por rota
     */
    getMetrics() {
        return Object.fromEntries(this.routeMetrics);
    }
    /**
     * Retorna métricas de uma rota específica
     * @param route - Caminho da rota
     * @returns {RouteMetrics | undefined} Métricas da rota ou undefined se não existir
     */
    getRouteMetrics(route) {
        return this.routeMetrics.get(route);
    }
}
exports.MetricsCollector = MetricsCollector;
/**
 * 📝 Sistema de Logging Avançado
 *
 * Gerencia todo o sistema de logging da biblioteca com:
 * - Níveis configuráveis de log
 * - Formatação automática de mensagens
 * - Suporte a loggers personalizados
 * - Logs específicos para requisições, auditoria e performance
 *
 * @class HttpLogger
 * @description Sistema profissional de logging para aplicações em produção
 */
class HttpLogger {
    /**
     * Cria uma nova instância do logger
     * @param logLevel - Nível mínimo de logging
     * @param customLogger - Função personalizada de logging (opcional)
     */
    constructor(logLevel = 'info', customLogger) {
        this.logLevel = logLevel;
        this.customLogger = customLogger;
    }
    /**
     * Verifica se uma mensagem deve ser registrada baseado no nível
     * @param level - Nível da mensagem
     * @returns {boolean} true se deve registrar, false caso contrário
     */
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
    /**
     * Formata uma mensagem de log com timestamp e dados
     * @param level - Nível da mensagem
     * @param message - Mensagem principal
     * @param data - Dados adicionais (opcional)
     * @returns {string} Mensagem formatada
     */
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (data) {
            return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
        }
        return baseMessage;
    }
    /**
     * Registra uma mensagem de log
     * @param level - Nível da mensagem
     * @param message - Mensagem principal
     * @param data - Dados adicionais (opcional)
     */
    log(level, message, data) {
        if (!this.shouldLog(level))
            return;
        if (this.customLogger) {
            // Usa logger personalizado se fornecido
            this.customLogger(level, message, data);
        }
        else {
            // Usa console padrão
            const formattedMessage = this.formatMessage(level, message, data);
            switch (level) {
                case 'error':
                    console.error(formattedMessage);
                    break;
                case 'warn':
                    console.warn(formattedMessage);
                    break;
                case 'debug':
                    console.debug(formattedMessage);
                    break;
                default:
                    console.log(formattedMessage);
            }
        }
    }
    /**
     * Registra informações de uma requisição HTTP
     * @param requestInfo - Dados estruturados da requisição
     */
    logRequest(requestInfo) {
        const logData = {
            method: requestInfo.method,
            url: requestInfo.url,
            path: requestInfo.path,
            clientIp: requestInfo.clientIp,
            userAgent: requestInfo.userAgent,
            duration: requestInfo.duration,
            bodySize: requestInfo.bodySize,
            timestamp: requestInfo.timestamp
        };
        this.log('info', `HTTP Request: ${requestInfo.method} ${requestInfo.url}`, logData);
    }
    /**
     * Registra informações de auditoria detalhadas
     * @param requestInfo - Dados completos da requisição
     * @description Usado para compliance, segurança e auditoria
     */
    logAudit(requestInfo) {
        const auditData = {
            timestamp: requestInfo.timestamp,
            method: requestInfo.method,
            url: requestInfo.url,
            clientIp: requestInfo.clientIp,
            userAgent: requestInfo.userAgent,
            headers: requestInfo.headers,
            body: requestInfo.body,
            duration: requestInfo.duration
        };
        this.log('info', `AUDIT: ${requestInfo.method} ${requestInfo.url} from ${requestInfo.clientIp}`, auditData);
    }
    /**
     * Registra informações de performance
     * @param route - Rota da requisição
     * @param duration - Duração em milissegundos
     * @description Detecta automaticamente requisições lentas (>1000ms)
     */
    logPerformance(route, duration) {
        if (duration > 1000) {
            this.log('warn', `Slow request detected: ${route} took ${duration}ms`);
        }
        else {
            this.log('debug', `Performance: ${route} completed in ${duration}ms`);
        }
    }
}
exports.HttpLogger = HttpLogger;
/**
 * 🔧 Middleware Principal - Interceptador de Requisições HTTP
 *
 * Esta é a função principal da biblioteca que cria o middleware Express
 * para interceptar e monitorar todas as requisições HTTP.
 *
 * @param options - Configurações do interceptador
 * @returns {Function} Middleware Express
 *
 * @example
 * ```javascript
 * const { requestInterceptor } = require('advanced-http-request-interceptor');
 *
 * app.use(requestInterceptor({
 *   enableLogging: true,
 *   enablePerformanceMonitoring: true,
 *   onRequest: (req, requestInfo) => {
 *     console.log(`📥 ${requestInfo.method} ${requestInfo.url}`);
 *   }
 * }));
 * ```
 */
function requestInterceptor(options = {}) {
    // 🔧 Configuração com valores padrão
    const { parseBody = true, // Analisa o body por padrão
    maxBodySize = 1024 * 1024, // 1MB por padrão
    onRequest, // Callback personalizado (opcional)
    enableLogging = true, // Logging ativado por padrão
    logLevel = 'info', // Nível info por padrão
    enablePerformanceMonitoring = true, // Métricas ativadas por padrão
    enableAuditLogging = false, // Auditoria desativada por padrão
    customLogger // Logger personalizado (opcional)
     } = options;
    // 📝 Inicializa sistema de logging
    const logger = new HttpLogger(logLevel, customLogger);
    // 📊 Inicializa coletor de métricas
    const metricsCollector = MetricsCollector.getInstance();
    // 🚀 Retorna o middleware Express
    return function (req, res, next) {
        // ⏱️ Marca o início da requisição para calcular duração
        const startTime = Date.now();
        // 📋 Coleta informações básicas da requisição
        const requestInfo = {
            method: req.method,
            url: req.url,
            path: req.path || req.url.split('?')[0],
            headers: req.headers,
            query: req.query,
            params: req.params,
            timestamp: new Date().toISOString(),
            clientIp: req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for'],
            userAgent: req.headers['user-agent'],
            body: undefined,
            contentLength: parseInt(req.headers['content-length'] || '0', 10)
        };
        // 🚫 Se não quiser analisar o corpo, processa imediatamente
        if (!parseBody) {
            requestInfo.duration = Date.now() - startTime;
            requestInfo.bodySize = 0;
            // 📝 Logging da requisição
            if (enableLogging) {
                logger.logRequest(requestInfo);
            }
            // 🛡️ Logging de auditoria
            if (enableAuditLogging) {
                logger.logAudit(requestInfo);
            }
            // 📊 Coleta de métricas de performance
            if (enablePerformanceMonitoring) {
                metricsCollector.updateMetrics(requestInfo.path, requestInfo.duration, requestInfo.timestamp);
                logger.logPerformance(requestInfo.path, requestInfo.duration);
            }
            // 🔧 Executa callback personalizado
            if (onRequest) {
                onRequest(req, requestInfo);
            }
            return next();
        }
        // 🚨 Verifica se o corpo é muito grande (proteção contra ataques)
        if (requestInfo.contentLength && requestInfo.contentLength > maxBodySize) {
            logger.log('warn', `Request rejected: payload too large (${requestInfo.contentLength} bytes)`, {
                url: requestInfo.url,
                clientIp: requestInfo.clientIp,
                maxAllowed: maxBodySize
            });
            return res.status(413).json({ error: 'Payload too large' });
        }
        // 📦 Inicia captura do corpo da requisição
        let body = '';
        // 📡 Event listener para dados recebidos
        req.on('data', (chunk) => {
            body += chunk.toString();
            // 🛡️ Verifica se o corpo se tornou muito grande durante o streaming
            if (body.length > maxBodySize) {
                logger.log('warn', `Request stream terminated: payload exceeded limit during streaming`, {
                    url: requestInfo.url,
                    clientIp: requestInfo.clientIp,
                    actualSize: body.length,
                    maxAllowed: maxBodySize
                });
                req.destroy();
                return res.status(413).json({ error: 'Payload too large' });
            }
        });
        // ✅ Event listener para fim da transmissão
        req.on('end', () => {
            var _a;
            try {
                // ⏱️ Calcula a duração total da requisição
                requestInfo.duration = Date.now() - startTime;
                requestInfo.bodySize = body.length;
                // 🔍 Tenta analisar o corpo como JSON (se aplicável)
                if (body && ((_a = req.headers['content-type']) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
                    try {
                        requestInfo.body = JSON.parse(body);
                    }
                    catch (parseError) {
                        requestInfo.body = body;
                        logger.log('warn', `Failed to parse JSON body for ${requestInfo.url}`, {
                            error: parseError,
                            bodyPreview: body.substring(0, 100)
                        });
                    }
                }
                else {
                    requestInfo.body = body;
                }
                // 📝 Logging detalhado da requisição
                if (enableLogging) {
                    logger.logRequest(requestInfo);
                }
                // 🛡️ Logging de auditoria para compliance
                if (enableAuditLogging) {
                    logger.logAudit(requestInfo);
                }
                // 📊 Coleta de métricas de performance
                if (enablePerformanceMonitoring) {
                    metricsCollector.updateMetrics(requestInfo.path, requestInfo.duration, requestInfo.timestamp);
                    logger.logPerformance(requestInfo.path, requestInfo.duration);
                }
                // 🔧 Executa callback personalizado se fornecido
                if (onRequest) {
                    onRequest(req, requestInfo);
                }
                // ➡️ Continua para o próximo middleware
                next();
            }
            catch (error) {
                // 🚨 Tratamento de erros durante o processamento
                logger.log('error', `Error processing request ${requestInfo.url}`, error);
                next(error);
            }
        });
        // 🚨 Event listener para erros na requisição
        req.on('error', (error) => {
            logger.log('error', `Request error for ${requestInfo.url}`, {
                error: error.message,
                clientIp: requestInfo.clientIp
            });
            next(error);
        });
    };
}
