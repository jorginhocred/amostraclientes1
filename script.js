// Elementos DOM
const valorInicialInput = document.getElementById('valorInicial');
const parcelasSelect = document.getElementById('parcelas');
const bandeiraSelect = document.getElementById('bandeira');
const gerarPrintBtn = document.getElementById('gerarPrint');
const tabelaCorpo = document.getElementById('tabelaCorpo');
const printModal = document.getElementById('printModal');
const printContent = document.getElementById('printContent');
const downloadPrintBtn = document.getElementById('downloadPrint');
const closePrintBtn = document.getElementById('closePrint');
const closeModal = document.querySelector('.close');

// Variáveis globais
let currentSimulation = null;

// Taxas de juros
const taxasBanese = {
    1: 0.078, 2: 0.088, 3: 0.098, 4: 0.103, 5: 0.108, 6: 0.111,
    7: 0.122, 8: 0.125, 9: 0.135, 10: 0.1245, 11: 0.135, 12: 0.142,
    13: 0.168, 14: 0.178, 15: 0.182, 16: 0.188, 17: 0.198, 18: 0.202,
    19: 0.218, 20: 0.223, 21: 0.2345
};

const taxasVisaMaster = {
    1: 0.063, 2: 0.073, 3: 0.083, 4: 0.088, 5: 0.093, 6: 0.096,
    7: 0.107, 8: 0.11, 9: 0.12, 10: 0.1095, 11: 0.12, 12: 0.127,
    13: 0.153, 14: 0.163, 15: 0.167, 16: 0.173, 17: 0.183, 18: 0.187,
    19: 0.203, 20: 0.208, 21: 0.2195
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    calcularValores();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    valorInicialInput.addEventListener('input', calcularValores);
    parcelasSelect.addEventListener('change', calcularValores);
    bandeiraSelect.addEventListener('change', calcularValores);
    
    gerarPrintBtn.addEventListener('click', gerarPrint);
    downloadPrintBtn.addEventListener('click', downloadPrint);
    closePrintBtn.addEventListener('click', closePrintModal);
    closeModal.addEventListener('click', closePrintModal);
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === printModal) {
            closePrintModal();
        }
    });
}

// Obter taxa de juros
function obterTaxaJuros(parcela, bandeira) {
    if (bandeira === "visa-master") {
        return taxasVisaMaster[parcela] || 0.2195;
    } else {
        return taxasBanese[parcela] || 0.22;
    }
}

// Calcular valores - Corrigido conforme novas especificações
function calcularValorReceber(valorInicial, taxa) {
    // Valor a Receber (R$): valor digitado pelo usuario - (valor digitado pelo usuario * taxa)
    return (valorInicial - (valorInicial * taxa)).toFixed(2);
}

function calcularValorCobrar(valorInicial, taxa) {
    // Valor a Cobrar (R$): valor digitado pelo usuario + (valor digitado pelo usuario * taxa)
    return (valorInicial + (valorInicial * taxa)).toFixed(2);
}

function calcularParcelaRecebida(valorInicial, parcelas) {
    // Parcela Recebida (R$): valor digitado pelo usuario / pela qnt de parcela
    return (valorInicial / parcelas).toFixed(2);
}

function calcularParcelaPagar(valorInicial, taxa, parcelas) {
    // Parcela a Pagar (R$): (valor digitado + o juros referente a qnts de parcela) / pela qnt de parcela
    return ((valorInicial + (valorInicial * taxa)) / parcelas).toFixed(2);
}

// Formatar valor em Real
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Formatar porcentagem
function formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
}

// Calcular e atualizar tabela
function calcularValores() {
    const valorInicial = parseFloat(valorInicialInput.value) || 0;
    const parcelaSelecionada = parcelasSelect.value;
    const bandeira = bandeiraSelect.value;
    
    tabelaCorpo.innerHTML = "";

    for (let i = 1; i <= 21; i++) {
        const taxa = obterTaxaJuros(i, bandeira);
        const row = document.createElement('tr');
        
        // Destacar linha selecionada
        if (parcelaSelecionada && parseInt(parcelaSelecionada) === i) {
            row.classList.add('selected-row');
        }
        
        if (valorInicial > 0) {
            const valorReceber = calcularValorReceber(valorInicial, taxa);
            const valorCobrar = calcularValorCobrar(valorInicial, taxa);
            const parcelaReceber = calcularParcelaRecebida(valorInicial, i);
            const parcelaCobrar = calcularParcelaPagar(valorInicial, taxa, i);

            row.innerHTML = `
                <td><strong>${i}x</strong></td>
                <td class="highlight-rate">${formatPercentage(taxa)}</td>
                <td class="highlight-value">${formatCurrency(valorReceber)}</td>
                <td class="highlight-value">${formatCurrency(valorCobrar)}</td>
                <td>${formatCurrency(parcelaReceber)}</td>
                <td>${formatCurrency(parcelaCobrar)}</td>
            `;
        } else {
            row.innerHTML = `
                <td><strong>${i}x</strong></td>
                <td class="highlight-rate">${formatPercentage(taxa)}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;
        }
        
        tabelaCorpo.appendChild(row);
    }
}

// Gerar print
function gerarPrint() {
    const valorInicial = parseFloat(valorInicialInput.value);
    const parcelas = parcelasSelect.value;
    const bandeira = bandeiraSelect.value;
    
    if (!valorInicial || !parcelas) {
        alert('Por favor, preencha o valor inicial e selecione o número de parcelas.');
        return;
    }
    
    if (valorInicial <= 0 || parseInt(parcelas) < 1 || parseInt(parcelas) > 21) {
        alert('Por favor, insira um valor inicial válido e número de parcelas entre 1 e 21.');
        return;
    }
    
    const taxa = obterTaxaJuros(parseInt(parcelas), bandeira);
    const valorReceber = calcularValorReceber(valorInicial, taxa);
    const valorCobrar = calcularValorCobrar(valorInicial, taxa);
    const parcelaReceber = calcularParcelaRecebida(valorInicial, parseInt(parcelas));
    const parcelaCobrar = calcularParcelaPagar(valorInicial, taxa, parseInt(parcelas));
    
    currentSimulation = {
        valorInicial,
        parcelas: parseInt(parcelas),
        bandeira,
        taxa,
        valorReceber,
        parcelaReceber,
        valorCobrar,
        parcelaCobrar
    };
    
    generatePrintContent();
    printModal.style.display = 'block';
}

// Gerar conteúdo do print
function generatePrintContent() {
    const sim = currentSimulation;
    const bandeiraTexto = sim.bandeira === 'visa-master' ? 'Visa/Master' : 'Banese';
    
    printContent.innerHTML = `
        <div class="print-header">
            <div class="print-logo">
                <img src="jorginhocred_logo.png" alt="Jorginho Cred" class="print-logo-image">
            </div>
            <div class="print-title">Jorginho Cred</div>
            <div class="print-subtitle">Realizando Sonhos</div>
        </div>
        
        <div class="print-section-title">
            <h2>Simulação de Empréstimo</h2>
        </div>
        
        <div class="print-section print-highlight">
            <h3>Se você passa ${formatCurrency(sim.valorInicial)}</h3>
            <div class="print-info">
                <div class="print-item">
                    <span class="print-label">Você recebe:</span>
                    <span class="print-value">${formatCurrency(sim.valorReceber)}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Parcela a Pagar:</span>
                    <span class="print-value">${sim.parcelas}x ${formatCurrency(sim.parcelaReceber)}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Taxa:</span>
                    <span class="print-value">${formatPercentage(sim.taxa)} (${bandeiraTexto})</span>
                </div>
            </div>
        </div>
        
        <div class="print-section print-highlight">
            <h3>Se você quer receber ${formatCurrency(sim.valorInicial)}</h3>
            <div class="print-info">
                <div class="print-item">
                    <span class="print-label">Você passa:</span>
                    <span class="print-value">${formatCurrency(sim.valorCobrar)}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Parcela a Pagar:</span>
                    <span class="print-value">${sim.parcelas}x ${formatCurrency(sim.parcelaCobrar)}</span>
                </div>
                <div class="print-item">
                    <span class="print-label">Taxa:</span>
                    <span class="print-value">${formatPercentage(sim.taxa)} (${bandeiraTexto})</span>
                </div>
            </div>
        </div>
        
        <div class="print-contact">
            <p><i class="fas fa-phone"></i> Contato: (75) 98134-2511</p>
            <p><i class="fas fa-envelope"></i> E-mail: jorginhocred@email.com</p>
            <p><i class="fab fa-instagram"></i> Instagram: @jorginhocred</p>
            <p><i class="fab fa-whatsapp"></i> WhatsApp: (75) 98134-2511</p>
            <p><i class="fas fa-clock"></i> Horário: Segunda a Sexta 8h às 18h, Sábado 8h às 12h</p>
        </div>
    `;
}

// Download do print
function downloadPrint() {
    if (!currentSimulation) return;
    
    const canvas = document.getElementById('screenshotCanvas');
    canvas.width = 200;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    html2canvas(printContent, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 0.7,
        width: 200,
        height: 300,
        scrollX: 0,
        scrollY: 0,
        logging: false
    }).then(canvasImg => {
        ctx.drawImage(canvasImg, 0, 0, canvas.width, canvas.height);
        
        const link = document.createElement('a');
        link.download = `jorginhocred_simulacao_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // Mostrar canvas temporariamente
        canvas.style.display = 'block';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 2000);
        
    }).catch(err => {
        console.error('Erro ao gerar screenshot:', err);
        alert('Ocorreu um erro ao gerar o print. Tente novamente.');
    });
}

// Fechar modal
function closePrintModal() {
    printModal.style.display = 'none';
}

// Smooth scroll para navegação
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

// Adicionar efeitos visuais
function addVisualEffects() {
    // Efeito de hover nas linhas da tabela
    const tableRows = document.querySelectorAll('#tabelaSimulacao tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Chamar efeitos visuais após carregar a página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addVisualEffects, 500);
});

