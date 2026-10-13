# programacao-web-catagolo-series
A TV series catalog application featuring search filters and integration with a public API.

Integrantes
Integrante 1: Edson da Rocha Silva
Integrante 2: David de Caralho Santos

Catálogo de Séries
Aplicação web para consulta e exploração de informações sobre séries de televisão, desenvolvida como trabalho acadêmico da disciplina de Programação Web. O sistema permite pesquisar séries por nome, visualizar os resultados, consultar detalhes e filtrar as séries por gênero e status.

Funcionalidades
-Pesquisa de séries: permite buscar séries pelo nome utilizando a API TVmaze.
-Exibição de resultados: apresenta as séries encontradas em cards com informações disponíveis, como nome, imagem, gênero, status e avaliação.
-Consulta de detalhes: permite selecionar uma série e visualizar informações complementares, incluindo resumo e outros dados disponibilizados pela API.
-Filtro por gênero: permite restringir os resultados de acordo com o gênero selecionado.
-Filtro por status: permite filtrar as séries conforme o status de exibição.
-Combinação de filtros: permite utilizar os filtros de gênero e status simultaneamente.
-Validação da pesquisa: informa quando o termo digitado é muito curto.
-Tratamento de resultados vazios: apresenta uma mensagem quando a pesquisa não encontra séries.
-Tratamento de erros: informa quando ocorre uma falha na comunicação com a API.
-Feedback de carregamento: apresenta mensagens durante as operações assíncroncronas de pesquisa e consulta de detalhes.

API utilizada
-O projeto utiliza a TVmaze API, uma API pública que fornece informações sobre programas de televisão.
-Documentação oficial: https://www.tvmaze.com/api
-Endpoint de pesquisa: https://api.tvmaze.com/search/shows?q={termo}
-Endpoint de detalhes: https://api.tvmaze.com/shows/{id}
-As requisições são realizadas em tempo de execução por meio da função fetch() do JavaScript. Os dados recebidos são processados pela aplicação e utilizados para atualizar a interface.

Tecnologias utilizadas
-HTML5: estruturação semântica da página e dos elementos da interface.
-CSS3: personalização visual e organização dos estilos.
-Tailwind CSS: utilização de classes utilitárias por meio do CDN incluído no HTML.
-JavaScript (ES6+): implementação da lógica da aplicação, manipulação do DOM, filtros e operações assíncronas.
-Fetch API: realização de requisições HTTP para obtenção dos dados.
-TVmaze API: fornecimento dos dados sobre as séries de televisão.

Organização dos arquivos JavaScript
-api.js: define a comunicação com a TVmaze API e implementa as funções de pesquisa e consulta de detalhes.
-ui.js: reúne as funções responsáveis pela manipulação dos elementos da página, apresentação de mensagens e renderização dos cards e detalhes.
-filters.js: gerencia os resultados da pesquisa e aplica os filtros de gênero e status.
-app.js: coordena o funcionamento da aplicação, registra os eventos da interface e conecta as funções dos demais arquivos.

Requisitos para execução
Para executar o projeto, são necessários:
-Um navegador moderno, como Google Chrome, Mozilla Firefox ou Microsoft Edge.
-Acesso à internet para carregar o Tailwind CSS pelo CDN e consultar a TVmaze API.
-Os arquivos do projeto mantidos na estrutura de diretórios indicada anteriormente.
-Não é necessário configurar um backend ou um banco de dados para executar a aplicação.

Como executar
Abrir diretamente no navegador
-Faça o download ou clone o repositório do projeto.
-Extraia os arquivos, caso tenha baixado um arquivo compactado.
-Abra a pasta do projeto.
-Abra o arquivo index.html em um navegador.
-Utilize o campo de pesquisa para buscar uma série.