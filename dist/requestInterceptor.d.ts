import { Request, Response, NextFunction } from 'express';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type RequestInterceptorOptions = {
    /**
     * Define se deve analisar o corpo da requisição
     */
    parseBody?: boolean;
    /**
     * Define o tamanho máximo do corpo da requisição (em bytes)
     */
    maxBodySize?: number;
    /**
     * Função de callback para processar a requisição interceptada
     */
    onRequest?: (req: Request, parsedData: RequestInfo) => void;
    /**
     * Habilita logging detalhado
     */
    enableLogging?: boolean;
    /**
     * Nível de logging
     */
    logLevel?: LogLevel;
    /**
     * Habilita monitoramento de performance
     */
    enablePerformanceMonitoring?: boolean;
    /**
     * Habilita logging de auditoria (IPs, headers, etc.)
     */
    enableAuditLogging?: boolean;
    /**
     * Função personalizada de logging
     */
    customLogger?: (level: LogLevel, message: string, data?: any) => void;
};
interface RequestInfo {
    method: string;
    url: string;
    path: string;
    headers: any;
    query: any;
    params: any;
    timestamp: string;
    clientIp: string | undefined;
    userAgent: string | undefined;
    body: any;
    duration?: number;
    contentLength?: number;
    bodySize?: number;
}
interface RouteMetrics {
    count: number;
    totalDuration: number;
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
    lastRequest: string;
}
declare class MetricsCollector {
    private static instance;
    private routeMetrics;
    static getInstance(): MetricsCollector;
    updateMetrics(route: string, duration: number, timestamp: string): void;
    getMetrics(): Record<string, RouteMetrics>;
    getRouteMetrics(route: string): RouteMetrics | undefined;
}
declare class HttpLogger {
    private logLevel;
    private customLogger?;
    constructor(logLevel?: LogLevel, customLogger?: (level: LogLevel, message: string, data?: any) => void);
    private shouldLog;
    private formatMessage;
    log(level: LogLevel, message: string, data?: any): void;
    logRequest(requestInfo: RequestInfo): void;
    logAudit(requestInfo: RequestInfo): void;
    logPerformance(route: string, duration: number): void;
}
/**
 * Middleware para interceptar e analisar requisições HTTP
 */
export declare function requestInterceptor(options?: RequestInterceptorOptions): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export { MetricsCollector, HttpLogger };
