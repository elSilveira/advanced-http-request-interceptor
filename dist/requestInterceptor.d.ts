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
import { Request, Response, NextFunction } from 'express';
/**
 * Níveis de logging disponíveis
 * - debug: Informações detalhadas para desenvolvimento
 * - info: Informações gerais de operação
 * - warn: Avisos sobre situações potencialmente problemáticas
 * - error: Erros que requerem atenção imediata
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/**
 * Configurações do interceptador de requisições HTTP
 *
 * @interface RequestInterceptorOptions
 */
export type RequestInterceptorOptions = {
    /**
     * Define se deve analisar o corpo da requisição
     * @default true
     * @description Quando true, captura e analisa o body das requisições POST/PUT/PATCH
     */
    parseBody?: boolean;
    /**
     * Define o tamanho máximo do corpo da requisição (em bytes)
     * @default 1048576 (1MB)
     * @description Requisições maiores que este limite serão rejeitadas com erro 413
     */
    maxBodySize?: number;
    /**
     * Função de callback para processar a requisição interceptada
     * @param req - Objeto Request do Express
     * @param parsedData - Dados estruturados da requisição
     * @description Executada após cada requisição ser processada
     */
    onRequest?: (req: Request, parsedData: RequestInfo) => void;
    /**
     * Habilita logging detalhado
     * @default true
     * @description Quando true, registra todas as requisições no console ou logger personalizado
     */
    enableLogging?: boolean;
    /**
     * Nível de logging
     * @default 'info'
     * @description Define o nível mínimo de mensagens que serão registradas
     */
    logLevel?: LogLevel;
    /**
     * Habilita monitoramento de performance
     * @default true
     * @description Coleta métricas de duração, contadores e estatísticas por rota
     */
    enablePerformanceMonitoring?: boolean;
    /**
     * Habilita logging de auditoria (IPs, headers, etc.)
     * @default false
     * @description Registra informações detalhadas para auditoria de segurança e compliance
     */
    enableAuditLogging?: boolean;
    /**
     * Função personalizada de logging
     * @param level - Nível da mensagem
     * @param message - Mensagem principal
     * @param data - Dados adicionais (opcional)
     * @description Permite integração com sistemas de logging externos (Winston, Bunyan, etc.)
     */
    customLogger?: (level: LogLevel, message: string, data?: any) => void;
};
/**
 * Informações estruturadas sobre uma requisição HTTP
 *
 * @interface RequestInfo
 * @description Contém todos os dados relevantes sobre uma requisição processada
 */
interface RequestInfo {
    /** Método HTTP (GET, POST, PUT, DELETE, etc.) */
    method: string;
    /** URL completa da requisição incluindo query parameters */
    url: string;
    /** Path da rota (sem query parameters) */
    path: string;
    /** Headers da requisição */
    headers: any;
    /** Query parameters parseados */
    query: any;
    /** Parâmetros da rota (ex: /users/:id) */
    params: any;
    /** Timestamp ISO da requisição */
    timestamp: string;
    /** IP do cliente que fez a requisição */
    clientIp: string | undefined;
    /** User-Agent do cliente */
    userAgent: string | undefined;
    /** Corpo da requisição (quando parseBody: true) */
    body: any;
    /** Duração da requisição em milissegundos */
    duration?: number;
    /** Tamanho do content-length em bytes */
    contentLength?: number;
    /** Tamanho real do body processado em bytes */
    bodySize?: number;
}
/**
 * Métricas de performance por rota
 *
 * @interface RouteMetrics
 * @description Estatísticas detalhadas de performance para cada endpoint
 */
interface RouteMetrics {
    /** Número total de requisições para esta rota */
    count: number;
    /** Duração total acumulada em milissegundos */
    totalDuration: number;
    /** Duração média em milissegundos */
    averageDuration: number;
    /** Menor duração registrada em milissegundos */
    minDuration: number;
    /** Maior duração registrada em milissegundos */
    maxDuration: number;
    /** Timestamp da última requisição */
    lastRequest: string;
}
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
declare class MetricsCollector {
    private static instance;
    private routeMetrics;
    /**
     * Retorna a instância singleton do coletor de métricas
     * @returns {MetricsCollector} Instância única do coletor
     */
    static getInstance(): MetricsCollector;
    /**
     * Atualiza as métricas para uma rota específica
     *
     * @param route - Caminho da rota (ex: '/api/users')
     * @param duration - Duração da requisição em milissegundos
     * @param timestamp - Timestamp da requisição
     * @description Calcula automaticamente min, max, média e contador
     */
    updateMetrics(route: string, duration: number, timestamp: string): void;
    /**
     * Retorna todas as métricas coletadas
     * @returns {Record<string, RouteMetrics>} Objeto com métricas por rota
     */
    getMetrics(): Record<string, RouteMetrics>;
    /**
     * Retorna métricas de uma rota específica
     * @param route - Caminho da rota
     * @returns {RouteMetrics | undefined} Métricas da rota ou undefined se não existir
     */
    getRouteMetrics(route: string): RouteMetrics | undefined;
}
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
declare class HttpLogger {
    private logLevel;
    private customLogger?;
    /**
     * Cria uma nova instância do logger
     * @param logLevel - Nível mínimo de logging
     * @param customLogger - Função personalizada de logging (opcional)
     */
    constructor(logLevel?: LogLevel, customLogger?: (level: LogLevel, message: string, data?: any) => void);
    /**
     * Verifica se uma mensagem deve ser registrada baseado no nível
     * @param level - Nível da mensagem
     * @returns {boolean} true se deve registrar, false caso contrário
     */
    private shouldLog;
    /**
     * Formata uma mensagem de log com timestamp e dados
     * @param level - Nível da mensagem
     * @param message - Mensagem principal
     * @param data - Dados adicionais (opcional)
     * @returns {string} Mensagem formatada
     */
    private formatMessage;
    /**
     * Registra uma mensagem de log
     * @param level - Nível da mensagem
     * @param message - Mensagem principal
     * @param data - Dados adicionais (opcional)
     */
    log(level: LogLevel, message: string, data?: any): void;
    /**
     * Registra informações de uma requisição HTTP
     * @param requestInfo - Dados estruturados da requisição
     */
    logRequest(requestInfo: RequestInfo): void;
    /**
     * Registra informações de auditoria detalhadas
     * @param requestInfo - Dados completos da requisição
     * @description Usado para compliance, segurança e auditoria
     */
    logAudit(requestInfo: RequestInfo): void;
    /**
     * Registra informações de performance
     * @param route - Rota da requisição
     * @param duration - Duração em milissegundos
     * @description Detecta automaticamente requisições lentas (>1000ms)
     */
    logPerformance(route: string, duration: number): void;
}
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
export declare function requestInterceptor(options?: RequestInterceptorOptions): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export { MetricsCollector, HttpLogger };
