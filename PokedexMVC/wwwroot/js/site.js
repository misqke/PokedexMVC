

window.onload = async () => {

    // elements
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const displayContainer = document.getElementById("display-container");
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const searchToggleBtn = document.getElementById("header-toggle-btn");
    const headerInner = document.getElementById("header-inner");
    const typeCheckBoxes = document.querySelectorAll(".search-types-container input");
    const typeLabels = document.querySelectorAll(".search-types-container label");
    const getMoreTrigger = document.getElementById("get-more-trigger")

    // state
    let page = 1;
    let maxPage = parseInt(document.getElementById("display").getAttribute("data-max-page"));
    let currentCard = null;
    const observer = new IntersectionObserver(handleObserver);
    let loading = false;

    // functions

    const searchPokemon = async () => {
        loading = true;
        const types = [];
        typeCheckBoxes.forEach(cb => {
            if (cb.checked) types.push(cb.getAttribute("data-type"));
        })
        const res = await fetch(`/home/search/?s=${searchInput.value}&t=${types.join(",")}`);
        const data = await res.text();
        displayContainer.innerHTML = "";
        displayContainer.innerHTML = data;
        maxPage = parseInt(document.getElementById("display").getAttribute("data-max-page"));
        page = 1;
        if (page === maxPage) getMoreTrigger.style.display = "none";
        else getMoreTrigger.style.display = "block";
        setCardListeners();
        loading = false;
    }

    const searchMorePokemon = async () => {
        loading = true;
        const types = [];
        typeCheckBoxes.forEach(cb => {
            if (cb.checked) types.push(cb.getAttribute("data-type"));
        })
        const res = await fetch(`/home/search/?s=${searchInput.value}&page=${++page}&t=${types.join(",")}`);
        const data = await res.text();
        const display = document.getElementById("display");
        display.innerHTML = display.innerHTML.concat(data);
        setCardListeners();
        if (page === maxPage) getMoreTrigger.style.display = "none";
        loading = false;
    }

    async function handleObserver(enties, observer) {
        if (page === maxPage || loading) return;
        const loader = enties[0];
        if (loader.isIntersecting) {
            await searchMorePokemon();
        }
        
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

    modalOverlay.addEventListener("click", (e) => {
        if (e.target == modalOverlay) toggleModal();
    })

    searchToggleBtn.addEventListener("click", (e) => {
        headerInner.classList.toggle("open");
    })

    typeLabels.forEach(l => {
        l.addEventListener("click", (e) => {
            const check = l.querySelector("input");
            const type = e.currentTarget.getAttribute("data-type");

            if (check.checked) e.currentTarget.classList.add(`color-${type}`)
            else e.currentTarget.classList.remove(`color-${type}`)
        })
    })

    // run
    setCardListeners();
    observer.observe(getMoreTrigger);
}
