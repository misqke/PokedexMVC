

window.onload = async () => {

    // elements
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const displayContainer = document.getElementById("display-container");
    const getMoreBtn = document.getElementById("get-more-button");
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");

    // state
    let page = 1;
    let maxPage = parseInt(document.getElementById("display").getAttribute("data-max-page"));
    let currentCard = null;

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
        setCardListeners();
    }

    const searchMorePokemon = async () => {
        const res = await fetch(`/home/search/?s=${searchInput.value}&page=${page}`);
        const data = await res.text();
        const display = document.getElementById("display");
        const previousCards = document.querySelectorAll(".pokemonCardContainer");
        display.innerHTML = display.innerHTML.concat(data);
        const allCards = Array.from(document.querySelectorAll(".pokemonCardContainer"));
        const newCards = allCards.filter((c, i) => i >= previousCards.length);
        handleGetMoreButton();
        setCardListeners(newCards);
    }


    const toggleModal = async (card) => {
        if (card) {
            const inner = card.querySelector(".pokemonCard");
            if (!document.startViewTransition) {
                modal.append(inner);
                modalOverlay.classList.add("open");
            } else {
                inner.style.viewTransitionName = "move-in";
                const transition = document.startViewTransition(() => {
                    modal.append(inner);
                    modalOverlay.classList.add("open");
                });
                await transition.ready;
                inner.style.viewTransitionName = "";
            }
            currentCard = card;
        }
        else {
            const inner = modal.querySelector(".pokemonCard");
            if (!document.startViewTransition) {
                modalOverlay.classList.remove("open");
                currentCard.append(inner);
            } else {
                inner.style.viewTransitionName = "move-out";
                const transition = document.startViewTransition(() => {
                    modalOverlay.classList.remove("open");
                    currentCard.append(inner);
                });
                await transition.ready;
                inner.style.viewTransitionName = "";
            }
            
            currentCard = null;
        }
        
    }

    const setCardListeners = (cards) => {
        if (!cards) cards = document.querySelectorAll(".pokemonCardContainer");
        cards.forEach(card => {
            card.addEventListener("click", (e) => toggleModal(card));
        })
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

    modalOverlay.addEventListener("click", (e) => {
        if (e.target == modalOverlay) toggleModal();
    })

    // run
    setCardListeners();
}
