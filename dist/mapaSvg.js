/*!
 * Copyright (c) 2025 - Luciano Lorencini - disponível em: https://github.com/luclorencini/mapaSvg.js
 * Licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.
 */

/**
 * Objeto responsável pela manipulação de um arquivo SVG contendo o mapa informado.
 * Este objeto encapsula funcionalidades para interagir com os elementos SVG, como os traçados das localidades
 * e seus respectivos nomes. Ele permite manipular visualmente o mapa, como alterar cores, esconder/exibir localidades 
 * e modificar o estilo dos seus nomes, além de lidar com eventos de interação, como hover.
 *
 * Funcionalidades principais:
 * - Inicialização do mapa SVG com eventos de hover e interação.
 * - Manipulação de traçados (caminhos) de localidades, incluindo alteração de cor e visibilidade.
 * - Manipulação de nomes das localidades, incluindo alteração de cor, estilo (negrito) e visibilidade.
 * - Eventos interativos para destacar localidades ao passar o mouse.
 * 
 * @type {Object}
 */
const mapaSvg = {
    /**
     * Lista de todos os elementos 'path' que representam os traçados das localidades.
     * @type {NodeListOf<SVGPathElement>}
     */
    tracados: null,

    /**
     * Lista de todos os elementos de texto que representam os nomes das localidades.
     * @type {NodeListOf<SVGTextElement | SVGGElement>}
     */
    nomes: null,

    /**
     * Elemento SVG que contém o mapa.
     * @type {SVGSVGElement}
     */
    svgElement: null,

    /**
     * Inicializa o manipulador do mapa SVG, configurando seus elementos internos.
     * @param {SVGSVGElement} svgElement - O elemento SVG que contém o mapa das localidades.
     */
    init(svgElement) {

        if (!svgElement) {
            console.error('mapaSvg - init: elemento SVG não informado');
            return;
        }

        this.svgElement = svgElement;

        // Pega todos os elementos 'path' de localidades
        mapaSvg.tracados = this.svgElement.querySelectorAll("#tracados path");

        // Pega todos os elementos de nomes de localidades, seja um 'text' ou um 'grupo' de textos
        mapaSvg.nomes = this.svgElement.querySelectorAll('#nomes > *');

        // Ajusta labels dos nomes das localidades para não atrapalhar o mouseover
        this.nomes.forEach(label => {
            label.style.pointerEvents = 'none';
        });
    },

    //TODO
    setLocalidade(id, { corFundo, corBorda, corNome, isNegrito, cssTracado, cssNome }) { },

    //TODO
    setAllLocalidades({ corFundo, corBorda, corNome, isNegrito, cssTracado, cssNome }) { },

    //TODO
    setLocalidadeHover(id, { corFundo, corBorda, corNome, isNegrito, cssTracado, cssNome }) { },

    //TODO
    setAllLocalidadesHover({ corFundo, corBorda, corNome, isNegrito, cssTracado, cssNome }) { },

    /**
     * Obtém a cor de fundo (atributo 'fill' do elemento '<path>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {string|null} A cor de fundo definida, ou null se não encontrado.
     */
    getCorFundo(id) {
        let t = this.getTracadoElem(id);
        return t ? t.getAttribute('fill') : null;
    },

    /**
     * Define a cor de fundo (atributo 'fill' do elemento '<path>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @param {string} cor - A cor de fundo da localidade.
     */
    setCorFundo(id, cor) {
        if (!id) return;
        if (!cor) return;
        let t = this.getTracadoElem(id);
        if (!t) return;
        t.setAttribute("fill", cor);
    },

    /**
     * Obtém a cor de borda (atributo 'stroke' do elemento '<path>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {string|null} A cor de borda definida, ou null se não encontrado.
     */
    getCorBorda(id) {
        let t = this.getTracadoElem(id);
        return t ? t.getAttribute('stroke') : null;
    },

    /**
     * Define a cor de borda (atributo 'stroke' do elemento '<path>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @param {string} cor - A cor de borda da localidade.
     */
    setCorBorda(id, cor) {
        if (!id) return;
        if (!cor) return;
        let t = this.getTracadoElem(id);
        if (!t) return;
        t.setAttribute("stroke", cor);
    },

    /**
     * Obtém a cor do nome (atributo 'fill' do elemento '<text>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {string|null} A cor do texto definida, ou null se não encontrado.
     */
    getCorNome(id) {
        if (!id) return;
        let tog = this.getNomeElem(id);
        if (!tog) return;

        let ret = '';

        this._executeInTog(
            (elText) => {
                ret = elText.getAttribute('fill');
            },
            tog
        );

        return ret;
    },

    /**
     * Define a cor do texto (atributos 'fill' e 'stroke' do elemento '<text>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @param {string} cor - A cor do texto da localidade.
     */
    setCorNome(id, cor) {
        if (!id) return;
        if (!cor) return;
        let tog = this.getNomeElem(id);
        if (!tog) return;

        this._executeInTog(
            (elText, cor) => {
                elText.setAttribute("fill", cor);
                elText.setAttribute("stroke", cor);
            },
            tog, cor
        );
    },

    /**
     * Verifica se o estilo de negrito está aplicado no texto de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {boolean} 
     *   - Retorna `true` se o estilo de negrito estiver aplicado (`font-weight: bold`).
     *   - Retorna `false` se o estilo de negrito não estiver aplicado ou se o elemento não for encontrado.
     */
    isNegrito(id) {
        if (!id) return;
        let tog = this.getNomeElem(id);
        if (!tog) return;

        let ret = '';

        this._executeInTog(
            (elText) => {
                ret = elText.getAttribute('font-weight');
            },
            tog
        );

        if (!ret) return false;
        if (ret === 'bold') return true;
        else return false;
    },

    /**
     * Define se o texto de uma localidade será exibido em negrito ou não (atributo 'font-weight' do elemento '<text>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @param {boolean} cor - A cor do texto da localidade.
     */
    /**
     * Aplica ou remove o estilo de negrito (atributo 'font-weight' do elemento '<text>') de uma localidade a partir do id informado.     
     * @param {string} id - O código IBGE, se for um município.
     * @param {boolean|null|undefined} isNegrito - Um valor booleano que determina se o estilo de negrito será aplicado:
     *   - `true` aplica o negrito (font-weight: bold).
     *   - `false` remove o negrito (font-weight: '').
     *   - `null` ou `undefined` não realiza nenhuma ação.
     */
    setNegrito(id, isNegrito) {
        if (isNegrito === null || isNegrito === undefined) return;
        let tog = this.getNomeElem(id);
        if (!tog) return;

        this._executeInTog(
            (elText, isNegrito) => {

                if (isNegrito === true) {
                    elText.setAttribute("font-weight", "bold");
                }
                else if (isNegrito === false) {
                    elText.setAttribute("font-weight", "");
                }
            },
            tog, isNegrito
        );
    },

    //TODO
    getTracadoCss(id) { },

    //TODO
    setTracadoCss(id, nome) { },

    //TODO
    getNomeCss(id) { },

    //TODO
    setNomeCss(id, nome) { },

    /**
     * Exibe o traçado de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     */
    showTracado(id) {
        let t = this.getTracadoElem(id);
        if (t) {
            t.style.display = '';
        }
    },

    /**
     * Exibe o nome de uma localidade a partir do código IBGE.
     * @param {string} id - O código IBGE, se for um município.
     */
    showNome(id) {
        let tog = this.getNomeElem(id);
        if (tog) {
            tog.style.display = '';
        }
    },

    /**
     * Esconde o traçado de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     */
    hideTracado(id) {
        let t = this.getTracadoElem(id);
        if (t) {
            t.style.display = 'none';
        }
    },

    /**
     * Esconde o nome de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     */
    hideNome(id) {
        let tog = this.getNomeElem(id);
        if (tog) {
            tog.style.display = 'none';
        }
    },

    /**
     * Exibe todos os traçados das localidades do mapa.
     */
    showAllTracados() {
        mapaSvg.tracados.forEach(t => {
            this.showTracado(t.id);
        });
    },

    /**
     * Exibe todos os nomes das localidades do mapa.
     */
    showAllNomes() {
        mapaSvg.nomes.forEach(n => {
            this.showNome(n.id);
        });
    },

    /**
     * Esconde todos os traçados das localidades do mapa.
     */
    hideAllTracados() {
        mapaSvg.tracados.forEach(t => {
            this.hideTracado(t.id);
        });
    },

    /**
     * Esconde todos os nomes das localidades do mapa.
     */
    hideAllNomes() {
        mapaSvg.nomes.forEach(n => {
            this.hideNome(n.id);
        });
    },

    /**
     * Obtém o traçado (elemento '<path>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {SVGPathElement|null} O elemento '<path>' da localidade, ou null se não encontrado.
     */
    getTracadoElem(id) {
        let ret = null;
        this.tracados.forEach(t => {
            if (t.id == id) {
                ret = t;
            }
        });
        return ret;
    },

    /**
     * Obtém o nome (elemento '<text>' ou '<g>') de um município a partir do código IBGE.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {SVGTextElement | SVGGElement | null} O elemento '<text>' ou '<g>' que representa o nome da localidade, ou null se não encontrado.
     */
    getNomeElem(id) {
        let ret = null;
        this.nomes.forEach(n => {
            if (n.id == id) {
                ret = n;
            }
        });
        return ret;
    },

    _executeInTog(metodo, tog, ...params) {

        // Verifica o tipo de tag do elemento 'tog' (<text> ou <g>)
        if (tog.tagName == 'text') {
            metodo(tog, ...params);  // Chama o método com os parâmetros fornecidos
        }

        if (tog.tagName == 'g') {
            let texts = tog.querySelectorAll('text');
            texts.forEach(t => {
                metodo(t, ...params);  // Chama o método para cada filho 'text' dentro de 'g'
            });
        }
    },
};
