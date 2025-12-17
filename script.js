document.addEventListener("DOMContentLoaded", () => {
    
    // Variável que vai guardar os dados vindos do JSON
    let allArtigos = [];

    const grid = document.getElementById("grid-artigos");
    const sortSelect = document.getElementById("sort-select");
    const filterSelect = document.getElementById("filter-pessoa");

    // 1. Função para carregar os dados do ficheiro JSON
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error("Não foi possível carregar o data.json");
            return response.json();
        })
        .then(data => {
            allArtigos = data; // Guarda os dados na nossa variável
            init();            // Arranca com a lógica do site
        })
        .catch(error => {
            console.error("Erro:", error);
            grid.innerHTML = '<p>Erro ao carregar os artigos. Verifica o ficheiro data.json.</p>';
        });

    // 2. Função de Inicialização (corre apenas quando o JSON chega)
    function init() {
        setupFilters();   // Cria as opções no menu
        updateDisplay();  // Mostra os artigos pela primeira vez

        // Ativa os ouvintes de eventos
        sortSelect.addEventListener('change', updateDisplay);
        filterSelect.addEventListener('change', updateDisplay);
    }

    // --- AS TUAS FUNÇÕES (IGUAIS, MAS USAM A VARIÁVEL 'allArtigos' CARREGADA) ---

    function renderArtigos(artigosToRender) {
        grid.innerHTML = ''; 

        if (artigosToRender.length === 0) {
            grid.innerHTML = '<p>Nenhum artigo encontrado.</p>';
            return;
        }

        artigosToRender.forEach(artigo => {
            const card = document.createElement('article');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${artigo.imagem}" alt="Imagem de ${artigo.nome}">
                <div class="card-content">
                    <h2>${artigo.nome}</h2>
                    <p class="price">${artigo.preco} €</p>
                    <a href="${artigo.url}" 
                       class="btn" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       aria-label="Ver detalhes de ${artigo.nome} (abre num novo separador)">
                        Ver Artigo
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function setupFilters() {
        // Agora usa a variável 'allArtigos' que foi preenchida pelo fetch
        const pessoasUnicas = [...new Set(allArtigos.map(a => a.pessoa))];
        
        pessoasUnicas.forEach(pessoa => {
            const option = document.createElement('option');
            option.value = pessoa;
            option.textContent = pessoa;
            filterSelect.appendChild(option);
        });
    }

    function updateDisplay() {
        const sortValue = sortSelect.value;
        const filterValue = filterSelect.value;

        // Filtragem baseada no valor selecionado
        let data = allArtigos.filter(artigo => artigo.pessoa === filterValue);

        // Ordenação por preço
        if (sortValue === 'asc') {
            data.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
        } else if (sortValue === 'desc') {
            data.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
        }
        
        renderArtigos(data);
    }
});