// Navegação mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header transparente no scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            header.style.background = 'rgba(15, 15, 35, 0.95)';
        }
    });
});

// Sistema de tabs para exemplos de código
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Adiciona active class ao botão clicado e painel correspondente
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Simulação de requisições para a demo
let logCount = 0;
const maxLogs = 10;

function simulateRequest(method, path) {
    const logsContainer = document.getElementById('demoLogs');
    const placeholder = logsContainer.querySelector('.log-placeholder');
    
    // Remove o placeholder na primeira requisição
    if (placeholder) {
        placeholder.remove();
    }
    
    // Cria uma nova entrada de log
    const logEntry = createLogEntry(method, path);
    logsContainer.appendChild(logEntry);
    
    // Remove logs antigos se necessário
    const allLogs = logsContainer.querySelectorAll('.demo-log-entry');
    if (allLogs.length > maxLogs) {
        allLogs[0].remove();
    }
    
    // Scroll para o final
    logsContainer.scrollTop = logsContainer.scrollHeight;
    
    logCount++;
}

function createLogEntry(method, path) {
    const timestamp = new Date().toISOString();
    const duration = Math.floor(Math.random() * 100) + 10; // 10-110ms
    const size = Math.floor(Math.random() * 1000) + 100; // 100-1100 bytes
    const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
    
    const entry = document.createElement('div');
    entry.className = 'demo-log-entry';
    entry.style.marginBottom = '0.5rem';
    entry.style.animation = 'fadeInUp 0.5s ease-out';
    
    entry.innerHTML = `
        <div class="log-line">
            <span class="timestamp" style="color: #71717a;">[${timestamp}]</span>
            <span class="level info" style="color: #6366f1;">[INFO]</span>
            <span class="message" style="color: #ffffff;">HTTP Request: ${method} ${path}</span>
        </div>
        <div class="log-line">
            <span class="metric" style="color: #f59e0b;">📊 Duration: ${duration}ms | Size: ${size} bytes</span>
        </div>
        <div class="log-line">
            <span class="metric" style="color: #f59e0b;">🌐 IP: ${ip} | User-Agent: Demo-Client/1.0</span>
        </div>
    `;
    
    return entry;
}

function clearLogs() {
    const logsContainer = document.getElementById('demoLogs');
    logsContainer.innerHTML = `
        <div class="log-placeholder">
            <i class="fas fa-play"></i>
            <p>Clique nos botões acima para simular requisições</p>
        </div>
    `;
    logCount = 0;
}

// Função para copiar texto para o clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showCopyFeedback();
    } catch (err) {
        // Fallback para browsers mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback();
    }
}

function showCopyFeedback() {
    // Cria um toast de confirmação
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = `
        <i class="fas fa-check"></i>
        <span>Copiado para a área de transferência!</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        animation: slideInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Animações de entrada quando elementos entram na viewport
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationName = 'fadeInUp';
                entry.target.style.animationDuration = '0.6s';
                entry.target.style.animationFillMode = 'both';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa elementos que devem animar
    document.querySelectorAll('.feature-card, .section-header, .install-steps').forEach(el => {
        observer.observe(el);
    });
}

// Efeito de digitação no terminal
function initTerminalTyping() {
    const commandElement = document.querySelector('.terminal-line .command');
    if (!commandElement) return;
    
    const command = commandElement.textContent;
    commandElement.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
        commandElement.textContent += command[i];
        i++;
        if (i >= command.length) {
            clearInterval(typing);
            // Inicia a animação dos logs após terminar de digitar
            setTimeout(() => {
                document.querySelectorAll('.terminal-output .log-entry').forEach((entry, index) => {
                    setTimeout(() => {
                        entry.style.opacity = '1';
                        entry.style.transform = 'translateY(0)';
                    }, index * 500);
                });
            }, 500);
        }
    }, 50);
}

// Contador animado para estatísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isSize = target.includes('KB');
        
        let finalValue;
        if (isPercentage) {
            finalValue = parseInt(target.replace('%', ''));
        } else if (isSize) {
            finalValue = parseInt(target.replace('KB', ''));
        } else {
            finalValue = parseInt(target);
        }
        
        let current = 0;
        const increment = finalValue / 60; // 60 frames para 1 segundo
        
        const updateCounter = () => {
            current += increment;
            if (current < finalValue) {
                let displayValue = Math.floor(current);
                if (isPercentage) displayValue += '%';
                else if (isSize) displayValue += 'KB';
                counter.textContent = displayValue;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target; // Valor final
            }
        };
        
        updateCounter();
    });
}

// Adiciona CSS para animações
const animationCSS = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .terminal-output .log-entry {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.5s ease;
    }
    
    .nav-links.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--surface);
        flex-direction: column;
        padding: 1rem 2rem;
        border-top: 1px solid var(--border-color);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
`;

// Adiciona o CSS de animações ao head
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// Inicializa tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initScrollAnimations();
    
    // Pequeno delay para garantir que os elementos estejam renderizados
    setTimeout(() => {
        initTerminalTyping();
        animateCounters();
    }, 1000);
});

// Adiciona efeito parallax suave no hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroAnimation = document.querySelector('.hero-animation');
    if (heroAnimation) {
        heroAnimation.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Documentation navigation
document.addEventListener('DOMContentLoaded', function() {
    // Documentation tabs functionality
    const docsNavItems = document.querySelectorAll('.docs-nav-item');
    const docsPanels = document.querySelectorAll('.docs-panel');
    
    docsNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetDoc = this.getAttribute('data-doc');
            
            // Remove active class from all nav items and panels
            docsNavItems.forEach(nav => nav.classList.remove('active'));
            docsPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetDoc);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Copy button functionality for code blocks
    document.querySelectorAll('pre code').forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copiar código';
        
        copyButton.addEventListener('click', function() {
            const code = codeBlock.textContent;
            copyToClipboard(code);
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.style.color = '#38a169';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i>';
                this.style.color = '';
            }, 2000);
        });
        
        // Position the button
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 