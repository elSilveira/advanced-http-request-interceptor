# 🚀 Landing Page - Advanced HTTP Request Interceptor

Esta é a landing page oficial do **Advanced HTTP Request Interceptor**, uma biblioteca profissional para interceptação e monitoramento de requisições HTTP em Node.js.

## 📁 Estrutura dos Arquivos

```
landing/
├── index.html      # Página principal com design responsivo
├── styles.css      # Estilos modernos com tema dark
├── script.js       # Funcionalidades interativas
├── server.js       # Servidor local para desenvolvimento
└── README.md       # Este arquivo
```

## 🌐 GitHub Pages

Esta landing page está configurada para ser automaticamente deployada no GitHub Pages através do workflow em `.github/workflows/pages.yml`.

### Como Funciona

1. **Redirecionamento**: O arquivo `index.html` na raiz redireciona para `landing/index.html`
2. **Jekyll**: O arquivo `.nojekyll` desabilita o processamento Jekyll
3. **Configuração**: O `_config.yml` define configurações específicas para o GitHub Pages
4. **Deploy Automático**: Push para `main` ou `master` triggera o deploy automaticamente

## 🛠️ Desenvolvimento Local

Para testar a landing page localmente:

```bash
cd landing
node server.js
```

Acesse: http://localhost:8080

## ✨ Recursos da Landing Page

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tema Dark**: Visual moderno com gradientes e animações
- **Código Interativo**: Exemplos de código com syntax highlighting
- **Demo ao Vivo**: Simulação de requisições HTTP em tempo real
- **Instalação Fácil**: Comandos NPM/Yarn com botão de copiar
- **Performance**: Otimizada para carregamento rápido

## 🎨 Customização

### Cores e Temas
As variáveis CSS estão centralizadas no início do `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --accent-color: #ffd700;
    --bg-dark: #0a0a0a;
    --text-light: #ffffff;
}
```

### Conteúdo
Edite o `index.html` para modificar:
- Textos e descrições
- Exemplos de código
- Links e URLs
- Metadados SEO

## 📱 Responsividade

A landing page é totalmente responsiva com breakpoints para:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px  
- **Mobile**: < 768px

## 🔧 Configuração do GitHub Pages

Para configurar em seu próprio repositório:

1. **Fork/Clone** este repositório
2. **Configure** no GitHub: Settings → Pages → Source: "GitHub Actions"
3. **Push** para a branch main
4. **Acesse** em: `https://seu-usuario.github.io/nome-do-repositorio`

## 🚀 Deploy Manual

Se preferir deploy manual sem GitHub Actions:

1. Configure o GitHub Pages para usar a branch `main` e pasta `/` (root)
2. O redirecionamento automático direcionará para `/landing/index.html`

## 📈 Analytics e SEO

A página inclui:
- Meta tags otimizadas para SEO
- Open Graph para redes sociais
- Schema.org structured data
- Sitemap automático via Jekyll

## 🤝 Contribuição

Para contribuir com melhorias na landing page:

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

**Desenvolvido com ❤️ por elSilveira** 