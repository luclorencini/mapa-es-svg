/*!
 * Copyright (c) 2025 - Luciano Lorencini - disponível em: https://github.com/luclorencini/mapaSvg.js
 * Licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.
 */

/**
 * Objeto responsável pela manipulação de um arquivo SVG contendo o mapa do Espírito Santo.
 * Este objeto encapsula funcionalidades para interagir com os elementos SVG, como os traçados dos municípios 
 * e seus respectivos nomes. Ele permite manipular visualmente o mapa, como alterar cores, esconder/exibir municípios 
 * e modificar os estilos dos nomes dos municípios, além de lidar com eventos de interação, como hover.
 *
 * Funcionalidades principais:
 * - Inicialização do mapa SVG com eventos de hover e interação.
 * - Manipulação de traçados (caminhos) de municípios, incluindo alteração de cor e visibilidade.
 * - Manipulação de nomes dos municípios, incluindo alteração de cor, estilo (negrito) e visibilidade.
 * - Eventos interativos para destacar municípios ao passar o mouse.
 * 
 * @type {Object}
 */
const mapaSvg = {
    /**
     * Lista de todos os elementos 'path' que representam os traçados dos municípios.
     * @type {NodeListOf<SVGPathElement>}
     */
    tracados: null,

    /**
     * Lista de todos os elementos de texto que representam os nomes dos municípios.
     * @type {NodeListOf<SVGTextElement | SVGGElement>}
     */
    nomes: null,

    /**
     * Elemento SVG que contém o mapa.
     * @type {SVGSVGElement}
     */
    svgElement: null,

    /**
     * Inicializa o manipulador do mapa SVG, configurando os elementos e eventos de interação.
     * @param {SVGSVGElement} svgElement - O elemento SVG que contém o mapa dos municípios.
     */
    init(svgElement) {

        if (!svgElement) {
            console.error('mapaSvg - init: elemento SVG não informado');
            return;
        }

        this.svgElement = svgElement;

        // Pega todos os elementos 'path' de municípios
        mapaSvg.tracados = this.svgElement.querySelectorAll("#tracados path");

        // Pega todos os elementos de nomes de municípios, seja um 'text' ou um 'grupo' de textos
        mapaSvg.nomes = this.svgElement.querySelectorAll('#nomes > *');

        // Ajusta labels dos nomes dos municípios para não atrapalhar o mouseover
        this.nomes.forEach(label => {
            label.style.pointerEvents = 'none';
        });
    },

//-------------------------------------------------------------------
// IDEIA PARA NOVA API DA LIB - V 1.1.0
//-------------------------------------------------------------------

    //método que seta o município de uma vez só (vai chamar os demais abaixo)
    setLocalidade(id, { corFundo, corBorda, tracadoCss, nomeCor, nomeNegrito, nomeCss }){},

    setLocalidadeHover(id, { corFundo, corBorda, tracadoCss, nomeCor, nomeNegrito, nomeCss }){},
    

    getCorFundo(id) {},

    setCorFundo(id, cor) {},

    getCorBorda(id) {},

    setCorBorda(id, cor) {},
    
    getTracadoCss(id){},
    
    setTracadoCss(id, nome){},

    getNomeCor(id){},
    
    setNomeCor(id, cor){},

    isNomeNegrito(id){},
    
    setNomeNegrito(id, isNegrito){},

    getNomeCss(id){},

    setNomeCss(id, nome){},

    getTracadoElem(id) {},

    getNomeElem(id){}, 

//-------------------------------------------------------------------
    
};
