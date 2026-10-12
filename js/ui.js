
"use strict";

/** referencias dos elementos DOM */
const elements = {
  form: document.getElementById("search-form"),
  searchInput: document.getElementById("search-input"),
  filtersSection: document.getElementById("filters-section"),
  genreFilter: document.getElementById("genre-filter"),
  statusFilter: document.getElementById("status-filter"),
  statusMessage: document.getElementById("status-message"),
  resultsSection: document.getElementById("results-section"),
  resultsList: document.getElementById("results-list"),
  detailsSection: document.getElementById("details-section"),
  detailsContent: document.getElementById("details-content"),
  searchButton: document.querySelector("#search-form button[type='submit']"),
};


/**
 * fallback
 */
function safeText(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();

  if (text === "" || text === "null" || text === "undefined") {
    return fallback;
  }

  return text;
}


function htmlToText(html) {
  if (html === null || html === undefined) {
    return "";
  }

  const text = String(html).trim();

  if (text === "") {
    return "";
  }

  const doc = new DOMParser().parseFromString(text, "text/html");
  return (doc.body.textContent || "").trim();
}

function summaryAsText(show) {
  const text = htmlToText(show && show.summary);
  return text === "" ? "Resumo não disponível" : text;
}

/** network → webChannel → "Não informado". */
function networkOf(show) {
  if (show && show.network && show.network.name) {
    return safeText(show.network.name, "Não informado");
  }

  if (show && show.webChannel && show.webChannel.name) {
    return safeText(show.webChannel.name, "Não informado");
  }

  return "Não informado";
}

function ratingOf(show) {
  const average = show && show.rating && show.rating.average;

  if (typeof average !== "number" || isNaN(average)) {
    return "Sem avaliação";
  }

  return average.toFixed(1).replace(".", ",");
}

/** Genres as text, or "Gênero não informado". */
function genresOf(show) {
  const genres = show && Array.isArray(show.genres) ? show.genres : [];
  const valid = genres
    .map(function (genre) {
      return safeText(genre, null);
    })
    .filter(function (genre) {
      return genre !== null;
    });

  if (valid.length === 0) {
    return "Gênero não informado";
  }

  return valid.join(", ");
}

/** image dar null ou é válida */
function imageOf(show) {
  const image = show && (show.image || null);
  if (!image) {
    return null;
  }

  return safeText(image.medium || image.original, null);
}


function showMessage(type, text) {
  const message = elements.statusMessage;

  message.textContent = text || "";
  message.classList.remove("is-carregando", "is-erro", "is-aviso");

  if (type === "loading") {
    message.classList.add("is-carregando");
  } else if (type === "error") {
    message.classList.add("is-erro");
  } else if (type === "warning") {
    message.classList.add("is-aviso");
  }
}


/** placeholder da imagem */
function createCardImage(show) {
  const url = imageOf(show);

  if (url === null) {
    const placeholder = document.createElement("div");
    placeholder.className = "card-imagem-placeholder";
    placeholder.textContent = "Sem imagem";
    return placeholder;
  }

  const image = document.createElement("img");
  image.className = "card-imagem";
  image.src = url;
  image.alt = "Imagem da série " + safeText(show.name, "");
  image.loading = "lazy";

  image.addEventListener("error", function () {
    const placeholder = document.createElement("div");
    placeholder.className = "card-imagem-placeholder";
    placeholder.textContent = "Sem imagem";
    if (image.parentNode) {
      image.parentNode.replaceChild(placeholder, image);
    }
  });

  return image;
}

/**
 * card com os atributos
 */
function createCard(show) {
  // Results without a valid name do not generate a card.
  const name = safeText(show && show.name, null);
  if (name === null) {
    return null;
  }

  const listItem = document.createElement("li");

  const article = document.createElement("article");
  article.className = "card";

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = String(show.id);

  button.appendChild(createCardImage(show));

  const body = document.createElement("div");
  body.className = "card-corpo";

  const title = document.createElement("h3");
  title.className = "card-titulo";
  title.textContent = name;

  const metaGenres = document.createElement("p");
  metaGenres.className = "card-meta";
  const genresLabel = document.createElement("strong");
  genresLabel.textContent = "Gêneros: ";
  metaGenres.appendChild(genresLabel);
  metaGenres.appendChild(document.createTextNode(genresOf(show)));

  const metaStatus = document.createElement("p");
  metaStatus.className = "card-meta";
  const statusLabel = document.createElement("strong");
  statusLabel.textContent = "Status: ";
  metaStatus.appendChild(statusLabel);
  metaStatus.appendChild(
    document.createTextNode(safeText(show.status, "Status não informado"))
  );

  body.appendChild(title);

  body.appendChild(metaGenres);

  body.appendChild(metaStatus);

  button.appendChild(body);

  article.appendChild(button);

  listItem.appendChild(article);

  return listItem;
}

/** Grid */
function renderResults(list) {
  const grid = elements.resultsList;
  grid.textContent = "";

  const fragment = document.createDocumentFragment();

  list.forEach(function (show) {
    const card = createCard(show);
    if (card !== null) {
      fragment.appendChild(card);
    }
  });

  grid.appendChild(fragment);
  elements.resultsSection.hidden = false;
}

function renderDetails(show) {
  const container = elements.detailsContent;
  container.textContent = "";

  // imagem ou placeholder.
  const imageUrl = show.image
    ? safeText(show.image.medium || show.image.original, null)
    : null;

  if (imageUrl === null) {
    const placeholder = document.createElement("div");
    placeholder.className = "detalhes-imagem-placeholder";
    placeholder.textContent = "Sem imagem";
    container.appendChild(placeholder);
  } else {
    const image = document.createElement("img");
    image.className = "detalhes-imagem";
    image.src = imageUrl;
    image.alt = "Imagem da série " + safeText(show.name, "");

    image.addEventListener("error", function () {
      const alternative = document.createElement("div");
      alternative.className = "detalhes-imagem-placeholder";
      alternative.textContent = "Sem imagem";
      if (image.parentNode) {
        image.parentNode.replaceChild(alternative, image);
      }
    });

    container.appendChild(image);
  }

  const body = document.createElement("div");
  body.className = "detalhes-corpo";

  const title = document.createElement("h3");
  title.textContent = safeText(show.name, "Série sem nome");
  body.appendChild(title);

  const summary = document.createElement("p");
  summary.className = "detalhes-resumo";
  summary.textContent = summaryAsText(show);
  body.appendChild(summary);

  const list = document.createElement("dl");
  list.className = "detalhes-lista";

  const fields = [
    ["Idioma", safeText(show.language, "Não informado")],
    ["Estreia", safeText(show.premiered, "Não informado")],
    ["Avaliação", ratingOf(show)],
    ["Emissora", networkOf(show)],
    ["Gêneros", genresOf(show)],
    ["Status", safeText(show.status, "Status não informado")],
  ];

  fields.forEach(function (pair) {
    const term = document.createElement("dt");
    term.textContent = pair[0];
    const definition = document.createElement("dd");
    definition.textContent = pair[1];
    list.appendChild(term);
    list.appendChild(definition);
  });

  body.appendChild(list);
  container.appendChild(body);

  elements.detailsSection.hidden = false;
}

/** hide dos detalhes */
function clearDetails() {
  elements.detailsContent.textContent = "";
  elements.detailsSection.hidden = true;
}
