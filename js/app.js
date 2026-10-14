
"use strict";

/** abrir os detalhes */
async function openDetails(id) {
  showMessage("loading", "Carregando detalhes...");

  try {
    const show = await getShowDetails(id);
    showMessage("", "");
    renderDetails(show);
    elements.detailsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    showMessage("error", "Não foi possível carregar os detalhes da série.");
  }
}

/** pesquisa */
async function performSearch(term) {
  // reset dos filtros.
  setCurrentResults([]);
  elements.resultsList.textContent = "";
  elements.resultsSection.hidden = true;
  clearDetails();
  elements.filtersSection.hidden = true;

  showMessage("loading", "Carregando resultados...");
  elements.searchButton.disabled = true;

  try {
    const results = await searchShows(term);
    setCurrentResults(results);

    if (results.length === 0) {
      showMessage("warning", "Nenhuma série encontrada para “" + term + "”.");
      return;
    }

    buildFilterOptions(results);
    elements.filtersSection.hidden = false;
    showMessage("", "");
    renderResults(results);
  } catch (error) {
    showMessage("error", error.message);
  } finally {
    elements.searchButton.disabled = false;
  }
}

/**
 * Css do app injetado
 */
function ensureCssClasses() {
  const header = document.querySelector("header");
  if (header) {
    header.classList.add("cabecalho");
  }

  const footer = document.querySelector("footer");
  if (footer) {
    footer.classList.add("rodape");
  }

  elements.form.classList.add("campo-busca");
  elements.filtersSection.querySelector("div").classList.add("filtros");
  elements.statusMessage.classList.add("mensagem");
  elements.resultsList.classList.add("grade");
  elements.detailsContent.classList.add("detalhes");
}

function init() {
  ensureCssClasses();

  elements.form.addEventListener("submit", function (event) {
    event.preventDefault();

    const term = safeText(elements.searchInput.value, "");

    if (term.length < 2) {
      showMessage(
        "warning",
        "Digite um termo com pelo menos dois caracteres para pesquisar."
      );
      elements.searchInput.focus();
      return;
    }

    performSearch(term);
  });

  elements.genreFilter.addEventListener("change", applyFilters);
  elements.statusFilter.addEventListener("change", applyFilters);

  elements.resultsList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-id]");
    if (!button) {
      return;
    }
    openDetails(button.dataset.id);
  });
}

init();
