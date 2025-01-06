/*!
 * Copyright (c) 2024 - Luciano Lorencini - disponível em: https://github.com/luclorencini/mapa-es-svg
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
const mapaEs = {
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
            console.error('mapaEs - init: elemento SVG não informado');
            return;
        }

        this.svgElement = svgElement;

        // Pega todos os elementos 'path' de municípios
        mapaEs.tracados = this.svgElement.querySelectorAll("#tracados path");

        // Pega todos os elementos de nomes de municípios, seja um 'text' ou um 'grupo' de textos
        mapaEs.nomes = this.svgElement.querySelectorAll('#nomes > *');

        // Ajusta labels dos nomes dos municípios para não atrapalhar o mouseover
        this.nomes.forEach(label => {
            label.style.pointerEvents = 'none';
        });
    },

    /**
     * Obtém o traçado (elemento 'path') de um município a partir do código IBGE.
     * @param {string} codigoIbge - O código IBGE do município.
     * @returns {SVGPathElement|null} O elemento 'path' do município, ou null se não encontrado.
     */
    getTracado(codigoIbge) {
        let ret = null;
        this.tracados.forEach(t => {
            if (t.id == codigoIbge) {
                ret = t;
            }
        });
        return ret;
    },

    /**
     * Define as cores de preenchimento (fill) e borda (stroke) de um traçado de município.
     * @param {string} codigoIbge - O código IBGE do município.
     * @param {string} [corFill] - A cor de preenchimento para o traçado.
     * @param {string} [corStroke] - A cor da borda do traçado.
     */
    setTracado(codigoIbge, corFill, corStroke) {
        if (!codigoIbge) return;
        let t = this.getTracado(codigoIbge);
        if (!t) return;
        if (corFill) t.setAttribute("fill", corFill);
        if (corStroke) t.setAttribute("stroke", corStroke);
    },

    /**
     * Define as cores de preenchimento (fill) e borda (stroke) para todos os traçados dos municípios.
     * @param {string} [corFill] - A cor de preenchimento para todos os traçados.
     * @param {string} [corStroke] - A cor da borda para todos os traçados.
     */
    setAllTracados(corFill, corStroke) {
        mapaEs.tracados.forEach(t => {
            this.setTracado(t.id, corFill, corStroke);
        });
    },

    /**
     * Esconde o traçado de um município a partir do código IBGE.
     * @param {string} codigoIbge - O código IBGE do município.
     */
    hideTracado(codigoIbge) {
        let t = this.getTracado(codigoIbge);
        if (t) {
            t.style.display = 'none';
        }
    },

    /**
     * Esconde todos os traçados dos municípios.
     */
    hideAllTracados() {
        mapaEs.tracados.forEach(t => {
            this.hideTracado(t.id);
        });
    },

    /**
     * Exibe o traçado de um município a partir do código IBGE.
     * @param {string} codigoIbge - O código IBGE do município.
     */
    showTracado(codigoIbge) {
        let t = this.getTracado(codigoIbge);
        if (t) {
            t.style.display = '';
        }
    },

    /**
     * Exibe todos os traçados dos municípios.
     */
    showAllTracados() {
        mapaEs.tracados.forEach(t => {
            this.showTracado(t.id);
        });
    },

    /**
     * Obtém o nome (elemento 'text' ou 'group') de um município a partir do código IBGE.
     * @param {string} codigoIbge - O código IBGE do município.
     * @returns {SVGTextElement | SVGGElement | null} O elemento 'text' ou 'group' que representa o nome do município, ou null se não encontrado.
     */
    getNome(codigoIbge) {
        let ret = null;
        this.nomes.forEach(n => {
            if (n.id == codigoIbge) {
                ret = n;
            }
        });
        return ret;
    },

    /**
     * Define a cor e o estilo de texto (negrito) de um nome de município.
     * @param {string} codigoIbge - O código IBGE do município.
     * @param {string} corHex - A cor (em formato hexadecimal) a ser aplicada ao nome do município.
     * @param {boolean} isNegrito - Se verdadeiro, aplica negrito ao nome do município; se falso, retira.
     */
    setNome(codigoIbge, corHex, isNegrito) {

        let nog = this.getNome(codigoIbge);
        if (!nog) return;

        this._executeInNog(
            (elText, corHex, isNegrito) => {
                if (corHex) {
                    elText.setAttribute("fill", corHex);
                    elText.setAttribute("stroke", corHex);
                }

                if (isNegrito) {
                    elText.setAttribute("font-weight", "bold");
                }
                else {
                    elText.setAttribute("font-weight", "");
                }
            },
            nog, corHex, isNegrito
        );
    },

    /**
     * Define a cor e o estilo de texto (negrito) para todos os nomes dos municípios.
     * @param {string} corHex - A cor (em formato hexadecimal) a ser aplicada aos nomes dos municípios.
     * @param {boolean} isNegrito - Se verdadeiro, aplica negrito a todos os nomes dos municípios; se falso, retira.
     */
    setAllNomes(corHex, isNegrito) {
        mapaEs.nomes.forEach(nog => {
            this.setNome(nog.id, corHex, isNegrito);
        });
    },

    /**
     * Esconde o nome de um município a partir do código IBGE.
     * @param {string} codigoIbge - O código IBGE do município.
     */
    hideNome(codigoIbge) {
        let nog = this.getNome(codigoIbge);
        if (nog) {
            nog.style.display = 'none';
        }
    },

    /**
     * Esconde todos os nomes dos municípios.
     */
    hideAllNomes() {
        mapaEs.nomes.forEach(n => {
            this.hideNome(n.id);
        });
    },

    /**
     * Exibe o nome de um município a partir do código IBGE.
     * @param {string} codigoIbge - O código IBGE do município.
     */
    showNome(codigoIbge) {
        let nog = this.getNome(codigoIbge);
        if (nog) {
            nog.style.display = '';
        }
    },

    /**
     * Exibe todos os nomes dos municípios.
     */
    showAllNomes() {
        mapaEs.nomes.forEach(n => {
            this.showNome(n.id);
        });
    },

    /**
     * Define as cores de preenchimento (fill), borda (stroke) e nome de um município ao passar o mouse sobre seu traçado.
     * Ao tirar o cursor do mouse sobre o município, ele retorna às cores definidas anteriormente.
     * @param {string} codigoIbge - O código IBGE do município.
     * @param {string} [corFill] - A cor de preenchimento do traçado.
     * @param {string} [corStroke] - A cor da borda do traçado.
     * @param {string} [corName] - A cor do nome do município.
     */    
    setHover(codigoIbge, corFill, corStroke, corName) {
        if (!codigoIbge) return;
        if (!corFill && !corStroke && !corName) return;
    
        let t = this.getTracado(codigoIbge);
        if (!t) return;
    
        let nog = this.getNome(codigoIbge);
        if (!nog) return;
    
        // Funções para mouseover e mouseout, com escopo correto
        const handleMouseOver = () => {
            if (corFill) {
                const originalFill = t.getAttribute("fill");
                t.setAttribute("fill", corFill);
                t.setAttribute("data-original-fill", originalFill);
            }
            if (corStroke) {
                const originalStroke = t.getAttribute("stroke");
                t.setAttribute("stroke", corStroke);
                t.setAttribute("data-original-stroke", originalStroke);
            }
            if (corName) {
                this._executeInNog(
                    (elText, corHex) => {
                        const originalText = elText.getAttribute("fill");
                        elText.setAttribute("fill", corHex);
                        elText.setAttribute("stroke", corHex);
                        elText.setAttribute("data-original-text", originalText);
                    },
                    nog, corName
                );
            }
        };
    
        const handleMouseOut = () => {
            if (corFill) {
                const originalFill = t.getAttribute("data-original-fill");
                t.setAttribute("fill", originalFill);
            }
            if (corStroke) {
                const originalStroke = t.getAttribute("data-original-stroke");
                t.setAttribute("stroke", originalStroke);
            }
            if (corName) {
                this._executeInNog(
                    (elText, corHex) => {
                        const originalText = elText.getAttribute("data-original-text");
                        elText.setAttribute("fill", originalText);
                        elText.setAttribute("stroke", originalText);
                    },
                    nog, corName
                );
            }
        };
    
        // Verifica se o elemento já possui listeners registrados
        if (!this.eventHandlers) {
            this.eventHandlers = {};
        }
    
        // Se já houver handlers registrados, remova-os antes de adicionar novos
        if (this.eventHandlers[codigoIbge]) {
            t.removeEventListener("mouseover", this.eventHandlers[codigoIbge].mouseover);
            t.removeEventListener("mouseout", this.eventHandlers[codigoIbge].mouseout);
        }
    
        // Registra os novos handlers
        t.addEventListener("mouseover", handleMouseOver);
        t.addEventListener("mouseout", handleMouseOut);
    
        // Armazena os handlers no objeto para garantir que a mesma referência seja usada
        this.eventHandlers[codigoIbge] = { mouseover: handleMouseOver, mouseout: handleMouseOut };
    },
    
    /**
     * Define as cores de preenchimento, borda e texto de um município para todos os traçados dos municípios ao passar o mouse sobre eles.
     * @param {string} [corFill] - A cor de preenchimento para todos os traçados.
     * @param {string} [corStroke] - A cor da borda para todos os traçados.
     * @param {string} [corName] - A cor do nome do município para todos os traçados.
     */
    setAllHover(corFill, corStroke, corName) {
        mapaEs.tracados.forEach(t => {
            this.setHover(t.id, corFill, corStroke, corName);
        });
    },

    _executeInNog(metodo, nog, ...params) {

        // Verifica o tipo de tag do elemento 'nog' (nome <text> ou grupo <g>)
        if (nog.tagName == 'text') {
            metodo(nog, ...params);  // Chama o método com os parâmetros fornecidos
        }

        if (nog.tagName == 'g') {
            let texts = nog.querySelectorAll('text');
            texts.forEach(t => {
                metodo(t, ...params);  // Chama o método para cada filho 'text' dentro de 'g'
            });
        }
    },
};
