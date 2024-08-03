

window.onload = async () => {

    // elements
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const displayContainer = document.getElementById("display-container");
    const getMoreBtn = document.getElementById("get-more-button");

    // state
    let page = 1;
    let maxPage = parseInt(document.getElementById("display").getAttribute("data-max-page"));

    // functions
    const handleGetMoreButton = () => {
        if (page == maxPage) {
            getMoreBtn.classList.add("hide");
        } else {
            getMoreBtn.classList.remove("hide");
        }
    }


    const searchPokemon = async () => {
        const res = await fetch(`/home/search/?s=${searchInput.value}`);
        const data = await res.text();
        displayContainer.innerHTML = "";
        displayContainer.innerHTML = data;
        maxPage = parseInt(document.getElementById("display").getAttribute("data-max-page"));
        page = 1;
        handleGetMoreButton();
    }

    const searchMorePokemon = async () => {
        const res = await fetch(`/home/search/?s=${searchInput.value}&page=${page}`);
        const data = await res.text();
        const display = document.getElementById("display");
        display.innerHTML = display.innerHTML.concat(data);
        handleGetMoreButton();
    }

    // event listeners
    searchForm.onsubmit = async (e) => {
        e.preventDefault();
        await searchPokemon();
    }

    getMoreBtn.onclick = async (e) => {
        if (page == maxPage) return;
        page++;
        await searchMorePokemon();
    }

}
