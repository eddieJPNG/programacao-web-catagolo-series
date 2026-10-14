const BASE_URL = 'https://api.tvmaze.com';


// vi a questão de dar map na saida da função
async function searchShows(query) {
    const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    
    if (!response.ok){
        throw new Error (`Erro HTTP: ${response.status}`);
    }

    const results = await response.json();

    
    return results.map(function (result) {
        return result.show;
    });
}


async function getShowDetails(showId) {
    const url = `${BASE_URL}/shows/${showId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data;
}
