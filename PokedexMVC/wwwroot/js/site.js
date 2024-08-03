

window.onload = async () => {

    // elements
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const displayContainer = document.getElementById("display-container");

    const searchPokemon = async () => {
        const res = await fetch(`/home/search/?s=${searchInput.value}`);
        const data = await res.text();
        console.log(data.body);
        displayContainer.innerHTML = "";
        displayContainer.innerHTML = data;
    }

    searchForm.onsubmit = async (e) => {
        e.preventDefault();
        await searchPokemon();
    }

}
