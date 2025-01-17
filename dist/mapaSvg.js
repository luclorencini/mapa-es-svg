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
     * O elemento SVG que contém o mapa das localidades.
     * @type {SVGSVGElement}
     */
    svgElement: null,

    /**
     * Carrega dinamicamente o mapa SVG baseado na sigla da localidade fornecida.
     * 
     * @param {string} siglaMapa - A sigla que determina qual mapa SVG será carregado.
     *    - "ES" para o mapa do Espírito Santo (outros valores resultam em erro).
     * @param {string} containerSelector - O seletor CSS do container HTML onde o mapa será inserido (normalmente uma div).
     *    - Exemplo: "#map-container" para selecionar uma div com o ID "map-container".
     * 
     * @throws {Error} Se a siglaMapa não for válida ou se houver problemas ao carregar o SVG.
     *    - Lança um erro se a sigla não for reconhecida.
     *    - Lança um erro se o arquivo SVG não for encontrado ou ocorrer falha no carregamento.
     * 
     * @example
     * // Carrega o mapa do Espírito Santo na div com o ID 'map-container'
     * load('ES', '#map-container');
     */
    async load(siglaMapa, containerSelector) {

        // Função interna para obter a URL do SVG com base na siglaMapa
        const getSvgUrl = () => {
            let mapaFileName = '';

            // Verificar qual mapa deve ser carregado com base na siglaMapa
            if (siglaMapa === 'ES') {
                mapaFileName = 'mapa-es.svg';        
            } else {
                throw new Error(`Sigla de localidade inválida: ${siglaMapa}`);
            }

            // Procurar pelo script que contém 'mapaSvg.js' no seu src
            const scripts = document.scripts;
            let currentScript = null;

            // Percorrer os scripts para encontrar o correto
            for (let script of scripts) {
                if (script.src.includes('mapaSvg.js')) {
                    currentScript = script;
                    break;
                }
            }

            // Se não encontrar o script, lançar erro
            if (!currentScript) {
                throw new Error('Script mapaSvg.js não encontrado');
            }

            // Obter a URL completa do script
            const scriptUrl = currentScript.src;

            // Extrair o diretório onde o script está localizado
            const scriptDir = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));

            // Construir a URL para o arquivo SVG
            return `${scriptDir}/${mapaFileName}`;
        };

        // Obter a URL calculada do SVG
        const svgUrl = getSvgUrl();

        // Busca o arquivo SVG via fetch
        const response = await fetch(svgUrl);
        const svgContent = await response.text();

        // Insere o SVG no elemento do DOM pelo seletor informado
        const container = document.querySelector(containerSelector);
        container.innerHTML = svgContent;
        
        // Realiza a inicialização do mapaSvg
        const svgElement = container.querySelector(`${containerSelector} svg`);
        if (!svgElement) {
            throw new Error('Elemento SVG não encontrado no DOM');
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

    /**
     * Configura os estilos de uma localidade, incluindo cores de fundo, borda, nome e outros atributos.
     * 
     * Este é o método preferencial para configurar múltiplos atributos de uma localidade de uma vez. Ele permite aplicar alterações
     * em vários atributos de estilo (como cor de fundo, borda, nome, e negrito) com uma única chamada. Caso o usuário prefira, 
     * ainda é possível utilizar os setters individuais para configurar cada atributo separadamente.
     * 
     * @param {string} id - O código IBGE, se for um município.
     * @param {Object} options - O objeto contendo as opções de estilo para a localidade.
     * @param {string} options.corFundo - A cor de fundo a ser aplicada à localidade.
     * @param {string} options.corBorda - A cor da borda a ser aplicada à localidade.
     * @param {string} options.corNome - A cor do nome a ser aplicada à localidade.
     * @param {boolean} options.negrito - Determina se o nome da localidade deve ser exibido em negrito.
     * @param {string} options.cssTracado - Estilo CSS adicional a ser aplicado ao tracado.
     * @param {string} options.cssNome - Estilo CSS adicional a ser aplicado ao nome da localidade.
     */
    setLocalidade(id, { corFundo, corBorda, corNome, negrito, cssTracado, cssNome }) {
        if (!id) return;
        if (!corFundo && !corBorda && !corNome && !negrito && !cssTracado && !cssNome) return;

        if (corFundo) this.setCorFundo(id, corFundo);
        if (corBorda) this.setCorBorda(id, corBorda);
        if (corNome) this.setCorNome(id, corNome);
        if (negrito) this.setNegrito(id, negrito);
        if (cssTracado) this.setTracadoCss(id, cssTracado);
        if (cssNome) this.setNomeCss(id, cssNome);

        return;
    },

    /**
     * Configura os estilos de todos os elementos de localidade no mapa.
     * @param {Object} options - O objeto contendo as opções de estilo para todas as localidades.
     * @param {string} options.corFundo - A cor de fundo a ser aplicada aos elementos de localidade.
     * @param {string} options.corBorda - A cor da borda a ser aplicada aos elementos de localidade.
     * @param {string} options.corNome - A cor do nome a ser aplicada aos elementos de localidade.
     * @param {boolean} options.negrito - Determina se o texto dos nomes das localidades deve ser exibido em negrito.
     * @param {string} options.cssTracado - Estilo CSS adicional a ser aplicado aos tracados.
     * @param {string} options.cssNome - Estilo CSS adicional a ser aplicado aos nomes das localidades.
     */
    setAllLocalidades({ corFundo, corBorda, corNome, negrito, cssTracado, cssNome }) {
        if (!corFundo && !corBorda && !corNome && !negrito && !cssTracado && !cssNome) return;

        mapaSvg.tracados.forEach(t => {
            this.setLocalidade(t.id, { corFundo, corBorda, corNome, negrito, cssTracado, cssNome });
        });
    },

    /**
     * Configura os efeitos de hover (passar o mouse) para um elemento de localidade específico.
     * Este método altera as cores de fundo, borda e nome de uma localidade, além de aplicar alterações de estilo quando o mouse passa sobre ele.
     * @param {string} id - O código IBGE, se for um município.
     * @param {Object} options - Um objeto contendo as opções de estilo.
     * @param {string} options.corFundo - A cor de fundo a ser aplicada quando o mouse passar sobre o elemento.
     * @param {string} options.corBorda - A cor da borda a ser aplicada quando o mouse passar sobre o elemento.
     * @param {string} options.corNome - A cor do nome a ser aplicada quando o mouse passar sobre o elemento.
     * @param {boolean} options.negrito - Determina se o texto do nome deve ser exibido em negrito.
     * @param {string} options.cssTracado - Estilo CSS adicional a ser aplicado ao tracado quando o mouse passar sobre o elemento.
     * @param {string} options.cssNome - Estilo CSS adicional a ser aplicado ao nome da localidade quando o mouse passar sobre o elemento.
     */
    setLocalidadeHover(id, { corFundo, corBorda, corNome, negrito, cssTracado, cssNome }) {
        if (!id) return;
        if (!corFundo && !corBorda && !corNome && !negrito && !cssTracado && !cssNome) return;

        let t = this.getTracadoElem(id);
        if (!t) return;

        let tog = this.getNomeElem(id);
        if (!tog) return;

        // Funções para mouseover e mouseout, com escopo correto
        const handleMouseOver = () => {
            if (corFundo) {
                const originalFill = t.getAttribute("fill");
                t.setAttribute("fill", corFundo);
                t.setAttribute("data-original-fill", originalFill);
            }
            if (corBorda) {
                const originalStroke = t.getAttribute("stroke");
                t.setAttribute("stroke", corBorda);
                t.setAttribute("data-original-stroke", originalStroke);
            }
            if (corNome) {
                this._executeInTog(
                    (elText, corHex) => {
                        const originalText = elText.getAttribute("fill");
                        elText.setAttribute("fill", corHex);
                        elText.setAttribute("stroke", corHex);
                        elText.setAttribute("data-original-text", originalText);
                    },
                    tog, corNome
                );
            }
            if (negrito !== null && negrito !== undefined) {
                this._executeInTog(
                    (elText, isBold) => {
                        const originalFontWeight = elText.getAttribute("font-weight");
                        elText.setAttribute("font-weight", (isBold === true ? 'bold' : ''));
                        elText.setAttribute("data-original-font-weight", originalFontWeight);
                    },
                    tog, negrito
                );
            }
            if (cssTracado) {
                const originalClass = t.getAttribute("class");
                t.setAttribute("class", cssTracado);
                t.setAttribute("data-original-class", originalClass);
            }
            if (cssNome) {
                this._executeInTog(
                    (elText, cssClass) => {
                        const originalClass = elText.getAttribute("class");
                        elText.setAttribute("class", cssClass);
                        elText.setAttribute("data-original-class", originalClass);
                    },
                    tog, cssNome
                );
            }
        };

        const handleMouseOut = () => {
            if (corFundo) {
                const originalFill = t.getAttribute("data-original-fill");
                t.setAttribute("fill", originalFill);
            }
            if (corBorda) {
                const originalStroke = t.getAttribute("data-original-stroke");
                t.setAttribute("stroke", originalStroke);
            }
            if (corNome) {
                this._executeInTog(
                    (elText) => {
                        const originalText = elText.getAttribute("data-original-text");
                        elText.setAttribute("fill", originalText);
                        elText.setAttribute("stroke", originalText);
                    },
                    tog
                );
            }
            if (negrito !== null && negrito !== undefined) {
                this._executeInTog(
                    (elText) => {
                        const originalFontWeight = elText.getAttribute("data-original-font-weight");
                        elText.setAttribute("font-weight", originalFontWeight);
                    },
                    tog
                );
            }
            if (cssTracado) {
                const originalClass = t.getAttribute("data-original-class");
                t.setAttribute("class", originalClass);
            }
            if (cssNome) {
                this._executeInTog(
                    (elText) => {
                        const originalClass = elText.getAttribute("data-original-class");
                        elText.setAttribute("class", originalClass);
                    },
                    tog
                );
            }
        };

        // Verifica se o elemento já possui listeners registrados
        if (!this.eventHandlers) {
            this.eventHandlers = {};
        }

        // Se já houver handlers registrados, remova-os antes de adicionar novos
        if (this.eventHandlers[id]) {
            t.removeEventListener("mouseover", this.eventHandlers[id].mouseover);
            t.removeEventListener("mouseout", this.eventHandlers[id].mouseout);
        }

        // Registra os novos handlers
        t.addEventListener("mouseover", handleMouseOver);
        t.addEventListener("mouseout", handleMouseOut);

        // Armazena os handlers no objeto para garantir que a mesma referência seja usada
        this.eventHandlers[id] = { mouseover: handleMouseOver, mouseout: handleMouseOut };
    },

    /**
     * Configura os efeitos de hover (passar o mouse) para todos os elementos de localidade no mapa.
     * @param {Object} options - O objeto contendo as opções de estilo para todas as localidades.
     * @param {string} options.corFundo - A cor de fundo a ser aplicada quando o mouse passar sobre os elementos.
     * @param {string} options.corBorda - A cor da borda a ser aplicada quando o mouse passar sobre os elementos.
     * @param {string} options.corNome - A cor do nome a ser aplicada quando o mouse passar sobre os elementos.
     * @param {boolean} options.negrito - Determina se o texto dos nomes deve ser exibido em negrito.
     * @param {string} options.cssTracado - Estilo CSS adicional a ser aplicado aos tracados.
     * @param {string} options.cssNome - Estilo CSS adicional a ser aplicado aos nomes das localidades.
     */
    setAllLocalidadesHover({ corFundo, corBorda, corNome, negrito, cssTracado, cssNome }) {
        if (!corFundo && !corBorda && !corNome && !negrito && !cssTracado && !cssNome) return;

        mapaSvg.tracados.forEach(t => {
            this.setLocalidadeHover(t.id, { corFundo, corBorda, corNome, negrito, cssTracado, cssNome });
        });
    },

    /**
     * Obtém a cor de fundo (atributo 'fill' do elemento '<path>') de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {string|null} A cor de fundo definida, ou null se não encontrado.
     */
    getCorFundo(id) {
        if (!id) return;
        let t = this.getTracadoElem(id);
        if (!t) return;
        return t.getAttribute('fill');
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
        if (!id) return;
        let t = this.getTracadoElem(id);
        if (!t) return;
        return t.getAttribute('stroke');
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
            (elText, corHex) => {
                elText.setAttribute("fill", corHex);
                elText.setAttribute("stroke", corHex);
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

    /**
     * Obtém a classe CSS associada ao elemento de traçaado (<path>) de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {string|undefined} - A classe CSS associada ao elemento, ou `undefined` caso o elemento não seja encontrado.
     */
    getTracadoCss(id) {
        if (!id) return;
        let t = this.getTracadoElem(id);
        if (!t) return;
        return t.getAttribute('class');
    },

    /**
     * Define a classe CSS para o elemento de traçaado (<path>) de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @param {string} nomeClasse - O nome da classe CSS a ser aplicada ao elemento <path>, via atributo 'class'.
     */
    setTracadoCss(id, nomeClasse) {
        if (!id) return;
        if (!nomeClasse) return;
        let t = this.getTracadoElem(id);
        if (!t) return;
        t.setAttribute("class", nomeClasse);
    },

    /**
     * Obtém a classe CSS associada ao elemento de nome (<text>) de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @returns {string|undefined} - A classe CSS associada ao elemento, ou `undefined` caso o elemento não seja encontrado.
     */
    getNomeCss(id) {
        if (!id) return;
        let tog = this.getNomeElem(id);
        if (!tog) return;

        let ret = '';
        this._executeInTog(
            (elText) => {
                ret = elText.getAttribute('class');
            },
            tog
        );
        return ret;
    },

    /**
     * Define a classe CSS para o elemento de nome (<text>) de uma localidade a partir do id informado.
     * @param {string} id - O código IBGE, se for um município.
     * @param {string} nomeClasse - O nome da classe CSS a ser aplicada ao elemento <text>, via atributo 'class'.
     */
    setNomeCss(id, nomeClasse) {
        if (!id) return;
        if (!nomeClasse) return;
        let tog = this.getNomeElem(id);
        if (!tog) return;

        this._executeInTog(
            (elText, cssClass) => {
                elText.setAttribute("class", cssClass);
            },
            tog, nomeClasse
        );
    },

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

        // Verifica o tipo de tag do elemento 'tog' ('<text>' ou '<g>')
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
