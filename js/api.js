const BASE_URL = 'https://api.tvmaze.com';

async function searchShows(query) {
    const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (!response.ok){
        throw new Error (`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data;
}