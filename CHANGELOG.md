# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-23

### 🎉 Lançamento Inicial

#### ✨ Adicionado
- **Interceptação Completa**: Sistema completo de interceptação de requisições HTTP
- **Logging Avançado**: Sistema de logging com níveis configuráveis (debug, info, warn, error)
- **Métricas de Performance**: Coleta automática de estatísticas por rota em tempo real
- **Auditoria de Segurança**: Logging detalhado para compliance e auditoria
- **Detecção Proativa**: Identificação automática de requisições lentas (>1000ms)
- **TypeScript Nativo**: Suporte completo com tipagens e autocomplete
- **Logger Personalizado**: Integração com sistemas externos (Winston, Bunyan, etc.)
- **Proteção contra Ataques**: Limite configurável de payload para prevenir ataques DoS
- **Zero Dependências**: Biblioteca leve sem dependências externas

#### 🔧 Funcionalidades Técnicas
- Análise automática de corpo de requisições JSON
- Captura de IP do cliente e User-Agent
- Medição precisa de duração de requisições
- Sistema singleton para coleta centralizada de métricas
- Tratamento robusto de erros
- Suporte a middleware personalizado via callbacks

#### 📊 Sistema de Métricas
- Contador de requisições por rota
- Duração mínima, máxima e média por endpoint
- Timestamp da última requisição
- API para acesso às métricas via `MetricsCollector.getInstance()`

#### 🛡️ Recursos de Segurança
- Logging de auditoria com IPs, headers e payloads
- Proteção contra payloads excessivamente grandes
- Detecção de streaming malicioso
- Logs estruturados para análise de segurança

#### 🧪 Qualidade e Testes
- Workflow CI/CD completo no GitHub Actions
- Testes em múltiplas versões do Node.js (16, 18, 20)
- Verificação automática de tipos TypeScript
- Testes de importação CommonJS
- Cobertura de casos de uso reais

#### 📚 Documentação
- README profissional com exemplos detalhados
- Comentários JSDoc completos no código
- Exemplos de uso para diferentes cenários
- Guias de migração de outras bibliotecas
- Documentação de todas as interfaces TypeScript

### 🔧 Configurações Suportadas
- `parseBody`: Análise do corpo da requisição (padrão: true)
- `maxBodySize`: Tamanho máximo do payload (padrão: 1MB)
- `enableLogging`: Ativa logging detalhado (padrão: true)
- `logLevel`: Nível de logging (padrão: 'info')
- `enablePerformanceMonitoring`: Métricas de performance (padrão: true)
- `enableAuditLogging`: Auditoria de segurança (padrão: false)
- `customLogger`: Logger personalizado (opcional)
- `onRequest`: Callback personalizado (opcional)

### 📋 Compatibilidade
- **Node.js**: 16.x ou superior
- **Express.js**: 4.x e 5.x
- **TypeScript**: 4.x ou superior
- **Ambientes**: Desenvolvimento, teste e produção

---

## Como Contribuir

Para contribuir com este projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Versioning

Usamos [SemVer](http://semver.org/) para versionamento. Para as versões disponíveis, veja as [tags neste repositório](https://github.com/elSilveira/advanced-http-request-interceptor/tags).

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 