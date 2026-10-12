

"use strict";

/** lista do resultados. */
let currentResults = [];

/** Ver o resto */
const STATUS_LABELS = {
  Running: "Em exibição",
  Ended: "Finalizada",
  "To Be Determined": "A definir",
  "In Development": "Em desenvolvimento",
};

/** Replace da memória */
function setCurrentResults(list) {
  currentResults = Array.isArray(list) ? list : [];
}

/**
* a lógica dos "todos"
 */
function fillSelect(select, options) {
  select.textContent = "";

  const all = document.createElement("option");
  all.value = "";
  all.textContent = "Todos";
  select.appendChild(all);

  options.forEach(function (option) {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.text;
    select.appendChild(element);
  });

  select.value = "";
}

/** status e gêneros */
function buildFilterOptions(list) {
  const genres = new Set();
  const statuses = new Set();

  list.forEach(function (show) {
    if (Array.isArray(show.genres)) {
      show.genres.forEach(function (genre) {
        const value = safeText(genre, null);
        if (value !== null) {
          genres.add(value);
        }
      });
    }

    const status = safeText(show.status, null);
    if (status !== null) {
      statuses.add(status);
    }
  });

  fillSelect(
    elements.genreFilter,
    Array.from(genres)
      .sort(function (a, b) {
        return a.localeCompare(b, "pt-BR");
      })
      .map(function (genre) {
        return { value: genre, text: genre };
      })
  );

  fillSelect(
    elements.statusFilter,
    Array.from(statuses)
      .sort(function (a, b) {
        return (STATUS_LABELS[a] || a).localeCompare(
          STATUS_LABELS[b] || b,
          "pt-BR"
        );
      })
      .map(function (status) {
        return { value: status, text: STATUS_LABELS[status] || status };
      })
  );
}

/** lógica da memória e grid */
function applyFilters() {
  const selectedGenre = elements.genreFilter.value;
  const selectedStatus = elements.statusFilter.value;

  const filtered = currentResults.filter(function (show) {
    const matchesGenre =
      selectedGenre === "" ||
      (Array.isArray(show.genres) && show.genres.indexOf(selectedGenre) !== -1);

    const matchesStatus =
      selectedStatus === "" ||
      safeText(show.status, "Status não informado") === selectedStatus;

    return matchesGenre && matchesStatus;
  });

  if (filtered.length === 0) {
    elements.resultsList.textContent = "";
    showMessage(
      "warning",
      "Nenhuma série encontrada com os filtros aplicados."
    );
    return;
  }

  showMessage("", "");
  renderResults(filtered);
}
