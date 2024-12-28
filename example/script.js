//----------------------------------------------
//funções de exemplo

function destacarGrandeVitoriaInterior() {

    mapaHandler.setAllTracados('#f0f4c3', '#9fa8da');

    const municipiosGV = [
        '3201308', //cariacica
        '3202207', //fundao
        '3202405', //guarapari
        '3205002', //serra
        '3205101', //viana
        '3205200', //vila velha
        '3205309', //vitoria
    ];

    municipiosGV.forEach(cod => {
        mapaHandler.setTracado(cod, "#bbdefb");
    });
}

function esconderTodosOsNomes() {
    mapaHandler.hideAllNomes();
}

function exibirTodosOsNomes() {
    mapaHandler.showAllNomes();
}

function exibirApenasLinhares() {

    mapaHandler.hideAllTracados();
    mapaHandler.showTracado('3203205');

    mapaHandler.hideAllNomes();
    mapaHandler.showNome('3203205');
}

function customizarColatina() {
    mapaHandler.setTracado('3201506', "#a5d6a7");
    mapaHandler.setNome('3201506', '#bf360c');
}

function customizarCachoeiro() {
    mapaHandler.setTracado('3201209', '#b39ddb', 'black');
    mapaHandler.setNome('3201209', '#ffee58', true);
}

//----------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    mapaHandler.init('svg');

    //Click: apenas mostra um alerta contendo o nome e o código IBGE do município
    mapaHandler.tracados.forEach(t => {
        t.addEventListener("click", () => {
            const munObj = municipioData.find(m => m.codigoIbge === t.id);
            alert(`${munObj.codigoIbge} - ${munObj.nome}`);
        });
    });

});

const mapaHandler = {

    tracados: null,
    nomes: null,
    corHover: "#fff59d",

    init(svgSelector, corHover) {

        const svgEl = document.querySelector(svgSelector);

        // Pega todos os elementos 'path' de municípios
        mapaHandler.tracados = svgEl.querySelectorAll("#tracados path");

        // Pega todos os elementos de nomes de municípios, seja um 'text' ou um 'grupo' de textos
        mapaHandler.nomes = svgEl.querySelectorAll('#nomes > *');

        // Seta cor de hover se informada
        if (corHover) this.corHover = corHover;

        this._configurarEventosDeHover();

    },

    _configurarEventosDeHover() {

        //Ajustes do mapa por traçado
        this.tracados.forEach(t => {

            //Mouse over: faz o município aparecer com uma cor de destaque
            t.addEventListener("mouseover", () => {

                // Armazena a cor original antes de alterar para a cor de hover
                const originalColor = t.getAttribute("fill");

                // Define o atributo fill para a cor de hover
                t.setAttribute("fill", this.corHover);

                // Armazena a cor original no próprio município, para usá-la depois
                t.setAttribute("data-original-color", originalColor);
            });

            //Mouse over: faz o município retornar para sua cor original, salva em 'mouseover'
            t.addEventListener("mouseout", () => {

                // Restaura a cor original do path
                const originalColor = t.getAttribute("data-original-color");

                // Volta à cor original que foi armazenada
                t.setAttribute("fill", originalColor);
            });
        });

        //Macete: ajusta labels dos nomes dos municípios para não atrapalhar o mouseover (senão, ao passar o mouse sobre o label, não ativa a cor do município)
        this.nomes.forEach(label => {
            label.style.pointerEvents = 'none';
        });
    },


    getTracado(codigoIbge) {
        let ret = null;
        this.tracados.forEach(t => {
            if (t.id == codigoIbge) {
                ret = t;
            }
        });
        return ret;
    },

    setTracado(codigoIbge, corFill, corStroke) {
        let t = this.getTracado(codigoIbge);
        if (!t) return;
        if (corFill) t.setAttribute("fill", corFill);
        if (corStroke) t.setAttribute("stroke", corStroke);
    },

    setAllTracados(corFill, corStroke) {
        mapaHandler.tracados.forEach(t => {
            this.setTracado(t.id, corFill, corStroke);
        });
    },

    hideTracado(codigoIbge) {
        let t = this.getTracado(codigoIbge);
        if (t) {
            t.style.display = 'none';
        }
    },

    hideAllTracados() {
        mapaHandler.tracados.forEach(t => {
            this.hideTracado(t.id);
        });
    },

    showTracado(codigoIbge) {
        let t = this.getTracado(codigoIbge);
        if (t) {
            t.style.display = '';
        }
    },

    showAllTracados() {
        mapaHandler.tracados.forEach(t => {
            this.showTracado(t.id);
        });
    },


    getNome(codigoIbge) {
        let ret = null;
        this.nomes.forEach(n => {
            if (n.id == codigoIbge) {
                ret = n;
            }
        });
        return ret;
    },

    setNome(codigoIbge, corHex, isNegrito) {

        //método interno que manipula diretamente o <text>
        const setTextAttrs = (elText, corHex, isNegrito) => {
            elText.setAttribute("stroke", corHex);
            elText.setAttribute("fill", corHex);
            if (isNegrito) {
                elText.setAttribute("font-weight", "bold");
            }
        }

        let nog = this.getNome(codigoIbge);
        if (!nog) return;

        //se o elemento for text, ajusta-o diretamente
        if (nog.tagName == 'text') {
            setTextAttrs(nog, corHex, isNegrito);
        }

        //se o elemento for group, obtém todos os texts contidos nele e os ajusta
        if (nog.tagName == 'g') {
            let texts = nog.querySelectorAll('text');

            texts.forEach(t => {
                setTextAttrs(t, corHex, isNegrito);                
            });
        }        
    },

    setAllNomes(corHex, isNegrito) {
        mapaHandler.nomes.forEach(n => {
            this.setNome(n.id, corHex, isNegrito);
        });
    },

    hideNome(codigoIbge) {
        let nog = this.getNome(codigoIbge);
        if (nog) {
            nog.style.display = 'none';
        }
    },

    hideAllNomes() {
        mapaHandler.nomes.forEach(n => {
            this.hideNome(n.id);
        });
    },

    showNome(codigoIbge) {
        let nog = this.getNome(codigoIbge);
        if (nog) {
            nog.style.display = '';
        }
    },

    showAllNomes() {
        mapaHandler.nomes.forEach(n => {
            this.showNome(n.id);
        });
    },
};

//extra - controle de zoom

const zoomControls = {

    scale: 1,
    mapa: document.querySelector('.map-container svg'),

    zoomIn() {
        this.scale += 0.2;
        this.applyZoom();
    },

    zoomOut() {
        this.scale -= 0.2;
        this.applyZoom();
    },

    zoomReset() {
        this.scale = 1;
        this.applyZoom();
    },

    applyZoom() {
        this.mapa.style.transform = `scale(${this.scale})`;
    }
}

// Array contendo todos os 78 municípios capixabas, usando o código IBGE como identificador
const municipioData = [
    { codigoIbge: '3200102', nome: 'Afonso Cláudio' },
    { codigoIbge: '3200169', nome: 'Água Doce do Norte' },
    { codigoIbge: '3200136', nome: 'Águia Branca' },
    { codigoIbge: '3200201', nome: 'Alegre' },
    { codigoIbge: '3200300', nome: 'Alfredo Chaves' },
    { codigoIbge: '3200359', nome: 'Alto Rio Novo' },
    { codigoIbge: '3200409', nome: 'Anchieta' },
    { codigoIbge: '3200508', nome: 'Apiacá' },
    { codigoIbge: '3200607', nome: 'Aracruz' },
    { codigoIbge: '3200706', nome: 'Atílio Vivacqua' },
    { codigoIbge: '3200805', nome: 'Baixo Guandú' },
    { codigoIbge: '3200904', nome: 'Barra de São Francisco' },
    { codigoIbge: '3201001', nome: 'Boa Esperança' },
    { codigoIbge: '3201100', nome: 'Bom Jesus do Norte' },
    { codigoIbge: '3201159', nome: 'Brejetuba' },
    { codigoIbge: '3201209', nome: 'Cachoeiro de Itapemirim' },
    { codigoIbge: '3201308', nome: 'Cariacica' },
    { codigoIbge: '3201407', nome: 'Castelo' },
    { codigoIbge: '3201506', nome: 'Colatina' },
    { codigoIbge: '3201605', nome: 'Conceição da Barra' },
    { codigoIbge: '3201704', nome: 'Conceição do Castelo' },
    { codigoIbge: '3201803', nome: 'Divino de São Lourenço' },
    { codigoIbge: '3201902', nome: 'Domingos Martins' },
    { codigoIbge: '3202009', nome: 'Dores do Rio Preto' },
    { codigoIbge: '3202108', nome: 'Ecoporanga' },
    { codigoIbge: '3202207', nome: 'Fundão' },
    { codigoIbge: '3202256', nome: 'Governador Lindenberg' },
    { codigoIbge: '3202306', nome: 'Guaçuí' },
    { codigoIbge: '3202405', nome: 'Guarapari' },
    { codigoIbge: '3202454', nome: 'Ibatiba' },
    { codigoIbge: '3202504', nome: 'Ibiraçu' },
    { codigoIbge: '3202553', nome: 'Ibitirama' },
    { codigoIbge: '3202603', nome: 'Iconha' },
    { codigoIbge: '3202652', nome: 'Irupi' },
    { codigoIbge: '3202702', nome: 'Itaguaçu' },
    { codigoIbge: '3202801', nome: 'Itapemirim' },
    { codigoIbge: '3202900', nome: 'Itarana' },
    { codigoIbge: '3203007', nome: 'Iúna' },
    { codigoIbge: '3203056', nome: 'Jaguaré' },
    { codigoIbge: '3203106', nome: 'Jerônimo Monteiro' },
    { codigoIbge: '3203130', nome: 'João Neiva' },
    { codigoIbge: '3203163', nome: 'Laranja da Terra' },
    { codigoIbge: '3203205', nome: 'Linhares' },
    { codigoIbge: '3203304', nome: 'Mantenópolis' },
    { codigoIbge: '3203320', nome: 'Marataízes' },
    { codigoIbge: '3203346', nome: 'Marechal Floriano' },
    { codigoIbge: '3203353', nome: 'Marilândia' },
    { codigoIbge: '3203403', nome: 'Mimoso do Sul' },
    { codigoIbge: '3203502', nome: 'Montanha' },
    { codigoIbge: '3203601', nome: 'Mucurici' },
    { codigoIbge: '3203700', nome: 'Muniz Freire' },
    { codigoIbge: '3203809', nome: 'Muqui' },
    { codigoIbge: '3203908', nome: 'Nova Venécia' },
    { codigoIbge: '3204005', nome: 'Pancas' },
    { codigoIbge: '3204054', nome: 'Pedro Canário' },
    { codigoIbge: '3204104', nome: 'Pinheiros' },
    { codigoIbge: '3204203', nome: 'Piúma' },
    { codigoIbge: '3204252', nome: 'Ponto Belo' },
    { codigoIbge: '3204302', nome: 'Presidente Kennedy' },
    { codigoIbge: '3204351', nome: 'Rio Bananal' },
    { codigoIbge: '3204401', nome: 'Rio Novo do Sul' },
    { codigoIbge: '3204500', nome: 'Santa Leopoldina' },
    { codigoIbge: '3204559', nome: 'Santa Maria de Jetibá' },
    { codigoIbge: '3204609', nome: 'Santa Teresa' },
    { codigoIbge: '3204658', nome: 'São Domingos do Norte' },
    { codigoIbge: '3204708', nome: 'São Gabriel da Palha' },
    { codigoIbge: '3204807', nome: 'São José do Calçado' },
    { codigoIbge: '3204906', nome: 'São Mateus' },
    { codigoIbge: '3204955', nome: 'São Roque do Canaã' },
    { codigoIbge: '3205002', nome: 'Serra' },
    { codigoIbge: '3205010', nome: 'Sooretama' },
    { codigoIbge: '3205036', nome: 'Vargem Alta' },
    { codigoIbge: '3205069', nome: 'Venda Nova do Imigrante' },
    { codigoIbge: '3205101', nome: 'Viana' },
    { codigoIbge: '3205150', nome: 'Vila Pavão' },
    { codigoIbge: '3205176', nome: 'Vila Valério' },
    { codigoIbge: '3205200', nome: 'Vila Velha' },
    { codigoIbge: '3205309', nome: 'Vitória' }
];