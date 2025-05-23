import { Request, Response, NextFunction } from 'express'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type RequestInterceptorOptions = {
  /**
   * Define se deve analisar o corpo da requisição
   */
  parseBody?: boolean
  
  /**
   * Define o tamanho máximo do corpo da requisição (em bytes)
   */
  maxBodySize?: number
  
  /**
   * Função de callback para processar a requisição interceptada
   */
  onRequest?: (req: Request, parsedData: RequestInfo) => void
  
  /**
   * Habilita logging detalhado
   */
  enableLogging?: boolean
  
  /**
   * Nível de logging
   */
  logLevel?: LogLevel
  
  /**
   * Habilita monitoramento de performance
   */
  enablePerformanceMonitoring?: boolean
  
  /**
   * Habilita logging de auditoria (IPs, headers, etc.)
   */
  enableAuditLogging?: boolean
  
  /**
   * Função personalizada de logging
   */
  customLogger?: (level: LogLevel, message: string, data?: any) => void
}

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

// Sistema de métricas global
class MetricsCollector {
  private static instance: MetricsCollector;
  private routeMetrics: Map<string, RouteMetrics> = new Map();
  
  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }
  
  updateMetrics(route: string, duration: number, timestamp: string) {
    const key = route;
    const existing = this.routeMetrics.get(key);
    
    if (existing) {
      existing.count++;
      existing.totalDuration += duration;
      existing.averageDuration = existing.totalDuration / existing.count;
      existing.minDuration = Math.min(existing.minDuration, duration);
      existing.maxDuration = Math.max(existing.maxDuration, duration);
      existing.lastRequest = timestamp;
    } else {
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
  
  getMetrics(): Record<string, RouteMetrics> {
    return Object.fromEntries(this.routeMetrics);
  }
  
  getRouteMetrics(route: string): RouteMetrics | undefined {
    return this.routeMetrics.get(route);
  }
}

// Sistema de logging avançado
class HttpLogger {
  private logLevel: LogLevel;
  private customLogger?: (level: LogLevel, message: string, data?: any) => void;
  
  constructor(logLevel: LogLevel = 'info', customLogger?: (level: LogLevel, message: string, data?: any) => void) {
    this.logLevel = logLevel;
    this.customLogger = customLogger;
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
  
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }
  
  log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;
    
    if (this.customLogger) {
      this.customLogger(level, message, data);
    } else {
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
  
  logRequest(requestInfo: RequestInfo) {
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
  
  logAudit(requestInfo: RequestInfo) {
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
  
  logPerformance(route: string, duration: number) {
    if (duration > 1000) {
      this.log('warn', `Slow request detected: ${route} took ${duration}ms`);
    } else {
      this.log('debug', `Performance: ${route} completed in ${duration}ms`);
    }
  }
}

/**
 * Middleware para interceptar e analisar requisições HTTP
 */
export function requestInterceptor(options: RequestInterceptorOptions = {}) {
  const {
    parseBody = true,
    maxBodySize = 1024 * 1024, // 1MB por padrão
    onRequest,
    enableLogging = true,
    logLevel = 'info',
    enablePerformanceMonitoring = true,
    enableAuditLogging = false,
    customLogger
  } = options

  const logger = new HttpLogger(logLevel, customLogger);
  const metricsCollector = MetricsCollector.getInstance();

  return function(req: Request, res: Response, next: NextFunction) {
    // Guarda a hora de início para calcular a duração
    const startTime = Date.now()
    
    // Informações básicas da requisição
    const requestInfo: RequestInfo = {
      method: req.method,
      url: req.url,
      path: req.path || req.url.split('?')[0],
      headers: req.headers,
      query: req.query,
      params: req.params,
      timestamp: new Date().toISOString(),
      clientIp: req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'],
      body: undefined,
      contentLength: parseInt(req.headers['content-length'] || '0', 10)
    }
    
    // Se não quiser analisar o corpo, processa imediatamente
    if (!parseBody) {
      requestInfo.duration = Date.now() - startTime;
      requestInfo.bodySize = 0;
      
      // Logging
      if (enableLogging) {
        logger.logRequest(requestInfo);
      }
      
      if (enableAuditLogging) {
        logger.logAudit(requestInfo);
      }
      
      // Métricas de performance
      if (enablePerformanceMonitoring) {
        metricsCollector.updateMetrics(requestInfo.path, requestInfo.duration, requestInfo.timestamp);
        logger.logPerformance(requestInfo.path, requestInfo.duration);
      }
      
      if (onRequest) {
        onRequest(req, requestInfo);
      }
      
      return next()
    }
    
    // Verifica se o corpo é muito grande
    if (requestInfo.contentLength && requestInfo.contentLength > maxBodySize) {
      logger.log('warn', `Request rejected: payload too large (${requestInfo.contentLength} bytes)`, {
        url: requestInfo.url,
        clientIp: requestInfo.clientIp,
        maxAllowed: maxBodySize
      });
      return res.status(413).json({ error: 'Payload too large' })
    }
    
    // Captura o corpo da requisição
    let body = ''
    
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
      
      // Verifica se o corpo se tornou muito grande durante o streaming
      if (body.length > maxBodySize) {
        logger.log('warn', `Request stream terminated: payload exceeded limit during streaming`, {
          url: requestInfo.url,
          clientIp: requestInfo.clientIp,
          actualSize: body.length,
          maxAllowed: maxBodySize
        });
        req.destroy()
        return res.status(413).json({ error: 'Payload too large' })
      }
    })
    
    req.on('end', () => {
      try {
        // Calcula a duração
        requestInfo.duration = Date.now() - startTime
        requestInfo.bodySize = body.length;
        
        // Tenta analisar o corpo como JSON
        if (body && req.headers['content-type']?.includes('application/json')) {
          try {
            requestInfo.body = JSON.parse(body)
          } catch (parseError) {
            requestInfo.body = body;
            logger.log('warn', `Failed to parse JSON body for ${requestInfo.url}`, {
              error: parseError,
              bodyPreview: body.substring(0, 100)
            });
          }
        } else {
          requestInfo.body = body
        }
        
        // Logging detalhado
        if (enableLogging) {
          logger.logRequest(requestInfo);
        }
        
        // Logging de auditoria
        if (enableAuditLogging) {
          logger.logAudit(requestInfo);
        }
        
        // Métricas de performance
        if (enablePerformanceMonitoring) {
          metricsCollector.updateMetrics(requestInfo.path, requestInfo.duration, requestInfo.timestamp);
          logger.logPerformance(requestInfo.path, requestInfo.duration);
        }
        
        // Chama o callback se fornecido
        if (onRequest) {
          onRequest(req, requestInfo)
        }
        
        // Continua para o próximo middleware
        next()
      } catch (error) {
        logger.log('error', `Error processing request ${requestInfo.url}`, error);
        next(error)
      }
    })
    
    req.on('error', (error: Error) => {
      logger.log('error', `Request error for ${requestInfo.url}`, {
        error: error.message,
        clientIp: requestInfo.clientIp
      });
      next(error)
    })
  }
}

// Exporta o coletor de métricas para uso externo
export { MetricsCollector, HttpLogger } 