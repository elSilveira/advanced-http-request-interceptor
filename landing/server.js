const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 - Arquivo não encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Página não encontrada</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px;
                                background: #0f0f23;
                                color: white;
                            }
                            h1 { color: #6366f1; }
                            a { color: #6366f1; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - Página não encontrada</h1>
                        <p>O arquivo solicitado não foi encontrado.</p>
                        <a href="/">← Voltar para a página inicial</a>
                    </body>
                    </html>
                `);
            } else {
                // 500 - Erro interno do servidor
                res.writeHead(500);
                res.end('Erro interno do servidor');
            }
        } else {
            // Sucesso
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Landing page rodando em http://localhost:${PORT}`);
    console.log(`📝 Arquivos servidos da pasta: ${__dirname}`);
    console.log('\n🎨 Recursos da landing page:');
    console.log('   ✅ Design moderno e responsivo');
    console.log('   ✅ Animações suaves e interativas');
    console.log('   ✅ Demo ao vivo da biblioteca');
    console.log('   ✅ Exemplos de código com syntax highlighting');
    console.log('   ✅ Seção de instalação com botões de cópia');
    console.log('   ✅ Links para GitHub e NPM');
    console.log('\nPressione Ctrl+C para encerrar o servidor.');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso!');
        process.exit(0);
    });
}); 