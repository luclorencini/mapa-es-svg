# mapaSvg.js - Mapa Iterativo do Espírito Santo - V 1.1.1

Crie um gráfico interativo e totalmente customizável do estado do Espírito Santo.

### Link para demonstração: [https://luclorencini.github.io](https://luclorencini.github.io)

### Downloads: [https://github.com/luclorencini/mapaSvg.js/releases](https://github.com/luclorencini/mapaSvg.js/releases)

#### Funcionalidades principais

- Inicialização do mapa SVG com eventos de hover e interação.
- Manipulação dos traçados dos municípios, incluindo alteração de cor e visibilidade.
- Manipulação dos nomes dos municípios, incluindo alteração de cor, estilo (negrito) e visibilidade.
- Eventos interativos para destacar municípios ao passar o mouse.

![Logo do Projeto](assets/mapa-exemplo.png)

## Índice

- [Download](#download)
- [Instalação](#instalação)
- [Exemplos de Uso](#exemplos-de-uso)
- [Documentação](#documentação)
- [Sobre os arquivos](#sobre-os-arquivos)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Próximos Passos](#próximos-passos)
- [Contato](#contato)

## Download

Você pode acessar a [Página de Releases](https://github.com/luclorencini/mapaSvg.js/releases) do projeto no GitHub e fazer o download da versão oficial mais recente. Na página, clique no arquivo desejado para realizar o download.

## Instalação

Inclua o arquivo `mapaSvg.js` diretamente em seu HTML ou faça o download do código e o adicione ao seu projeto.

```html
<script src="/dist/mapaSvg.js"></script>
```

Ou, se estiver usando um sistema de módulos JavaScript, você pode importar a biblioteca assim:

```js
import mapaSvg from 'mapaSvg.js';
```

## Exemplos de Uso

### Carregando o mapa 

O método `load()` deve ser utilizado para carregar dinamicamente o mapa SVG, com base na sigla da localidade fornecida.
O método recebe dois parâmetros: 
* a sigla da localidade (como 'ES' para Espírito Santo)
* o seletor do container onde o mapa será inserido, compatível com o padrão de query selector.

```html
<body>
    <!-- Container onde o mapa será carregado -->
    <div id="map-container"></div>
</body>
```

```javascript
// Carregar o mapa do Espírito Santo no container com o ID 'map-container'
await mapaSvg.load('ES', '#map-container');
```

> **Importante**: O método `load()` faz uso de `fetch`, que não funciona em arquivos locais no sistema de arquivos. Para executar este exemplo, recomendamos o uso do Visual Studio Code com o plug-in **Live Server**, permitindo que você execute o código via `localhost`.

### Modificando atributos de localidades

Você pode alterar atributos como cor de fundo, cor de borda, cor do texto ou negrito de uma localidade específica com o método `setLocalidade()`.

```javascript
// Altera a cor de fundo, borda e nome do município com o código IBGE 3205309 (Vitória)
mapaSvg.setLocalidade('3205309', {
  corFundo: '#FF5733',
  corBorda: '#C70039',
  corNome: '#900C3F',
  negrito: true
});
```

Os valores são opcionais; informe apenas os que deseja alterar.

```javascript
// Altera a cor de fundo do município com o código IBGE 3201209 (Cachoeiro de Itapemirim)
mapaSvg.setLocalidade('3201209', {
  corFundo: '#00FF00'
});
```

Para definir os atributos para todas as localidades de uma vez, utilize `setAllLocalidades()`.

```javascript
mapaSvg.setAllLocalidades({
  corFundo: '#FF5733',
  corBorda: '#C70039',
  corNome: '#900C3F',
  negrito: false
});
```

### Alterando estilos de hover

Para adicionar efeitos de hover (ao passar o mouse) para uma localidade específica, utilize o método `setLocalidadeHover()`.

```javascript
// Altera a cor de fundo, borda e nome do município com o código IBGE 3204906 (São Mateus) ao passar o mouse sobre ele
mapaSvg.setLocalidadeHover('3204906', {
  corFundo: '#ff0000',
  corBorda: '#581845',
  corNome: 'black',
  negrito: true
});
```

Para definir os atributos de hover para todas as localidades de uma vez, utilize `setAllLocalidadesHover()`.

```javascript
mapaSvg.setAllLocalidadesHover({
  corFundo: '#bbdefb',
  corBorda: '#1976d2',
  corNome: '#ffff00',
  negrito: false
});
```

### Mostrando ou ocultando localidades

Você pode exibir ou esconder os traçados e os nomes de uma localidade ou de todas as localidades:

```javascript
mapaSvg.hideAllTracados();  // Esconde todos os traçados
mapaSvg.showAllTracados();  // Exibe todos os traçados

mapaSvg.hideAllNomes();  // Esconde todos os nomes
mapaSvg.showAllNomes();  // Exibe todos os nomes

mapaSvg.showTracado("3203205");  // Exibe o traçado do município com o código IBGE 3203205 (Linhares)
mapaSvg.hideTracado("3201902");  // Exibe o traçado do município com o código IBGE 3201902 (Domingos Martins)

mapaSvg.showNome("3205101");  // Esconde o nome do município com o código IBGE 3205101 (Viana)
mapaSvg.hideNome("3201506");  // Esconde o nome do município com o código IBGE 3201506 (Colatina)
```

### Customização de localidades via CSS

Se preferir, você pode criar classes CSS para customizar traçados e nomes, e aplicá-los diretamente às localidades.

```javascript
// Define uma classe CSS de traçado e de nome para o município com o código IBGE 3203320 (Marataízes)
mapaSvg.setTracadoCss('3203320', 'highlighted');
mapaSvg.setNomeCss('3203320', 'bold-text');
```

```css
/* Estilo para o traçado destacado */
.highlighted {
    stroke: #ff0000;  /* Cor da borda vermelha */
    stroke-width: 2;   /* Aumenta a espessura da borda */
}

/* Estilo para o texto em negrito */
.bold-text {
    font-weight: bold;
    fill: #000000;  /* Cor do texto preta */
}
```

### Eventos

Você pode configurar eventos nos municípios contidos no atributo `tracados`. O código abaixo demonstra como configurar `click` para todos os traçados de município:

```javascript
mapaSvg.tracados.forEach(t => {
  t.addEventListener("click", () => {
    alert(t.id);
  });
}); 
```

### Exemplo Completo

```html
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exemplo de mapaSvg.js</title>
  <script src="/dist/mapaSvg.js"></script>
</head>
<body>
  <div id="map-container">
    <!-- O conteúdo do mapa SVG será incluído aqui -->
  </div>

  <script>
    
    async function loadMap() {
      
      // Carrega o mapa do Espírito Santo
      await mapaSvg.load('ES', '#map-container');

      // Customiza todos os municípios
      mapaSvg.setAllLocalidades({
          corFundo: '#e8f5e9', // verde claro
          corBorda: '#757575', // cinza médio
          corNome: '#212121',  // cinza escuro
      });

      mapaSvg.setAllLocalidadesHover({
          corFundo: '#c8e6c9', // verde
      });

      // Customiza Linhares (Código IBGE 3203205)
      mapaSvg.setLocalidade('3203205', {
        corFundo: '#bbdefb', // azul
        corBorda: '#1976d2', // azul escuro
        negrito: true
      });

      mapaSvg.setLocalidadeHover('3203205', {
        corFundo: '#64b5f6', // azul destaque
        corBorda: '#1565c0', // azul mais escuro
        corNome: '#212121',  // cinza escuro
        negrito: true
      });
    }

    // Chama a função assíncrona para carregar o mapa
    loadMap();
    
  </script>

  <style>
    svg {
        font-family: Arial, Helvetica, sans-serif;
    }
  </style>

</body>
</html>
```

## Documentação

### Atributos

| Atributo     | Tipo                                        | Descrição                                                                       |
|--------------|---------------------------------------------|---------------------------------------------------------------------------------|
| `tracados`   | `NodeListOf<SVGPathElement>`                | Lista de todos os elementos `path` que representam os traçados das localidades. |
| `nomes`      | `NodeListOf<SVGTextElement \| SVGGElement>` | Lista de todos os elementos de texto que representam os nomes das localidades.  |
| `svgElement` | `SVGSVGElement`                             | O elemento SVG que contém o mapa das localidades.                               |

### Métodos

| Método                          | Descrição                                                                 | Parâmetros                                                                                                                                              | Retorno     |
|----------------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `load`                           | Carrega dinamicamente o mapa SVG baseado na sigla da localidade fornecida.| `siglaMapa` (string) - A sigla que determina qual mapa SVG será carregado ("ES" para o mapa do Espírito Santo). <br> `containerSelector` (string) - O seletor CSS do container HTML onde o mapa será inserido (normalmente uma div).                 | `void`      |
| `setLocalidade`                  | Configura os estilos de uma localidade, incluindo cores e negrito.        | `id` (string) - O código IBGE da localidade. <br> `options` (Object) - Opções de estilo (corFundo, corBorda, corNome, negrito, cssTracado, cssNome).      | `void`      |
| `setAllLocalidades`              | Configura os estilos de todas as localidades no mapa.                     | `options` (Object) - Opções de estilo para todas as localidades (corFundo, corBorda, corNome, negrito, cssTracado, cssNome).                            | `void`      |
| `setLocalidadeHover`             | Configura efeitos de hover para uma localidade específica.                | `id` (string) - O código IBGE da localidade. <br> `options` (Object) - Opções de estilo para o hover (corFundo, corBorda, corNome, negrito, cssTracado, cssNome). | `void`      |
| `setAllLocalidadesHover`         | Configura efeitos de hover para todas as localidades no mapa.             | `options` (Object) - Opções de estilo para o hover de todas as localidades (corFundo, corBorda, corNome, negrito, cssTracado, cssNome).                | `void`      |
| `showTracado`                    | Exibe o traçado de uma localidade.                                        | `id` (string) - O código IBGE da localidade.                                                                                                            | `void`      |
| `showNome`                        | Exibe o nome de uma localidade.                                           | `id` (string) - O código IBGE da localidade.                                                                                                            | `void`      |
| `hideTracado`                    | Esconde o traçado de uma localidade.                                      | `id` (string) - O código IBGE da localidade.                                                                                                            | `void`      |
| `hideNome`                        | Esconde o nome de uma localidade.                                         | `id` (string) - O código IBGE da localidade.                                                                                                            | `void`      |
| `showAllTracados`                | Exibe todos os traçados das localidades no mapa.                         | Nenhum                                                                                                                                                 | `void`      |
| `showAllNomes`                   | Exibe todos os nomes das localidades no mapa.                             | Nenhum                                                                                                                                                 | `void`      |
| `hideAllTracados`                | Esconde todos os traçados das localidades no mapa.                       | Nenhum                                                                                                                                                 | `void`      |
| `hideAllNomes`                   | Esconde todos os nomes das localidades no mapa.                           | Nenhum                                                                                                                                                 | `void`      |
| `getTracadoCss`                  | Obtém a classe CSS do traçado de uma localidade.                          | `id` (string) - O código IBGE da localidade.                                                                                                            | `string \| undefined`|
| `setTracadoCss`                  | Define a classe CSS do traçado de uma localidade.                         | `id` (string) - O código IBGE da localidade. <br> `nomeClasse` (string) - O nome da classe CSS.                                                       | `void`      |
| `getNomeCss`                     | Obtém a classe CSS do nome de uma localidade.                             | `id` (string) - O código IBGE da localidade.                                                                                                            | `string \| undefined`|
| `setNomeCss`                     | Define a classe CSS do nome de uma localidade.                            | `id` (string) - O código IBGE da localidade. <br> `nomeClasse` (string) - O nome da classe CSS.                                                       | `void`      |
| `getCorFundo`                    | Obtém a cor de fundo de uma localidade.                                    | `id` (string) - O código IBGE da localidade.                                                                                                            | `string \| null`|
| `setCorFundo`                    | Define a cor de fundo de uma localidade.                                  | `id` (string) - O código IBGE da localidade. <br> `cor` (string) - A cor de fundo da localidade.                                                      | `void`      |
| `getCorBorda`                    | Obtém a cor de borda de uma localidade.                                   | `id` (string) - O código IBGE da localidade.                                                                                                            | `string \| null`|
| `setCorBorda`                    | Define a cor de borda de uma localidade.                                  | `id` (string) - O código IBGE da localidade. <br> `cor` (string) - A cor da borda da localidade.                                                      | `void`      |
| `getCorNome`                     | Obtém a cor do nome de uma localidade.                                    | `id` (string) - O código IBGE da localidade.                                                                                                            | `string \| null`|
| `setCorNome`                     | Define a cor do nome de uma localidade.                                   | `id` (string) - O código IBGE da localidade. <br> `cor` (string) - A cor do nome da localidade.                                                       | `void`      |
| `isNegrito`                      | Verifica se o nome de uma localidade está em negrito.                     | `id` (string) - O código IBGE da localidade.                                                                                                            | `boolean`   |
| `setNegrito`                     | Define se o nome de uma localidade será exibido em negrito.               | `id` (string) - O código IBGE da localidade. <br> `isNegrito` (boolean) - Define se o nome será em negrito (`true`) ou normal (`false`). Caso informe `null` ou `undefined`, o comando será ignorado. | `void`      |
| `getTracadoElem`                 | Obtém o traçado de uma localidade a partir do id.                         | `id` (string) - O código IBGE da localidade.                                                                                                            | `SVGPathElement \| null`|
| `getNomeElem`                    | Obtém o nome de uma localidade a partir do id.                             | `id` (string) - O código IBGE da localidade.                                                                                                            | `SVGTextElement \| SVGGElement \| null`|

#### Opções de estilo

| Nome         | Descrição                                                         |
|--------------|-------------------------------------------------------------------|
| `corFundo`   | A cor de fundo a ser aplicada à localidade.                       |
| `corBorda`   | A cor da borda a ser aplicada à localidade.                       |
| `corNome`    | A cor do nome a ser aplicada à localidade.                        |
| `negrito`    | Determina se o nome da localidade deve ser exibido em negrito.    |
| `cssTracado` | Estilo CSS adicional a ser aplicado ao tracado.                   |
| `cssNome`    | Estilo CSS adicional a ser aplicado ao nome da localidade.        |

## Sobre os arquivos

### mapaSvg.js

O arquivo **mapaSvg.js** define objeto `mapaSvg`, que encapsula funcionalidades para manipular o arquivo `mapa-es.svg` descrito abaixo. Ele permite interagir com os elementos SVG, manipulando suas cores, visibilidade e estilos, além de configurar eventos de interação, como o destaque de municípios ao passar o mouse. Toda a documentação acima se refere a este objeto.

### mapa-es.svg

O arquivo `mapa-es.svg` representa o mapa do estado do Espírito Santo, Brasil, e contém todos os 78 municípios do estado. 

O formato adotado é o SVG (Scalable Vector Graphics) usado para criar gráficos vetoriais bidimensionais e, por isso, podem ser escalados sem perder qualidade. Arquivos SVG podem ser manipulados com JavaScript e CSS e são compatíveis com todos os navegadores modernos, o que os torna ideal para gráficos interativos em aplicações web.

O mapa é formado por dois principais conjuntos de elementos:

**Traçados dos municípios**: Cada município é representado por um elemento `<path>`, e o id de cada `<path>` corresponde ao código IBGE do município. Esse código IBGE é usado para identificar e manipular os traçados individualmente através dos métodos do objeto `mapaSvg`, como `getTracado()`, `setTracado()`, e outros relacionados ao controle de traçados.

**Nomes dos municípios**: Os nomes dos municípios são representados por elementos `<text>` (quando o nome do município cabe em apenas uma linha) ou `<g>` (grupo de textos), quando o nome do município precisa de 2 ou mais linhas dentro do mapa. Neste caso, o grupo contém elementos `<text>` para cada linha de texto. Cada `<text>` ou `<g>` tem um id correspondente ao código IBGE do município, o que permite a manipulação dos nomes dos municípios através dos métodos do objeto `mapaSvg`, como `getNome()`, `setNome()`, e outros relacionados à exibição e formatação de nomes.

#### Estrutura do SVG

- `<svg>`: A tag raiz do arquivo SVG que define o mapa do estado do Espírito Santo. Exemplo:

```xml
<svg version="1.1" x="0px" y="0px">
```

- `<g id="tracados">`: Um grupo de elementos `<path>` que representam os limites dos municípios. Cada `<path>` tem um id correspondente ao código IBGE do município. Exemplo:

```xml
<g id="tracados">
  <path id="3205309" d="M354.948,551.208 ..."/>
  <path id="3205200" d="M327.611,589.155 ..."/>
  <!-- Outros elementos path para os municípios -->
</g>
```

- `<g id="nomes">`: Um grupo de elementos `<text>` ou `<g>` (grupo de textos) que representa o nome de cada município. O id de cada elemento de texto corresponde ao código IBGE do município. Exemplo:

```xml
<g id="nomes">
  <text id="3205309" x="364.77815" y="545.33657">Vitória</text>
  <g id="3205200">
    <text x="349.91283" y="575.33916">Vila</text>
    <text x="346.20913" y="585.92117">Velha</text>
  </g>  
  <!-- Outros elementos text para os nomes dos municípios -->
</g>
```

O tamanho padrão do SVG do **mapa-es.svg** é:

```
height="790px"
width="540px"
```

## Contribuição

Se você encontrar problemas ou quiser melhorar o código, sinta-se à vontade para enviar pull requests. Para contribuir, basta clonar o repositório, fazer as alterações e enviar um pull request com uma descrição clara das modificações.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo `LICENSE` para mais detalhes.

## Próximos Passos

Existe a vontade de inserir mapas de mais estados brasileiros na biblioteca. Se você tiver interesse no uso, mas seu estado não está contemplado, entre em contato que iremos inseri-lo sob demanda.

## Contato

Se você tiver alguma dúvida ou sugestão, entre em contato:

* Email: lorencini@gmail.com

* GitHub: [luclorencini](https://github.com/luclorencini)