// DOM elements to work with
const leftMenu = document.querySelector('.left-menu')
const hamburger = document.querySelector('.hamburger')
//  ul with a list of cards
const showsList = document.querySelector('.tv-shows__list')
// modal window
const modal = document.querySelector('.modal')

// URL for source of pictures (posters)
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
const DEFAULT_IMG = 'img/no-poster.jpg';

//  Side menu interaction
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu')
    hamburger.classList.toggle('open')
})

document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu')
        hamburger.classList.remove('open')
    }
})

leftMenu.addEventListener('click', event => {
    const target = event.target
    const dropdown = target.closest('.dropdown')

    if (dropdown) {
        dropdown.classList.toggle('active')
        leftMenu.classList.add('openMenu')
        hamburger.classList.add('open')
    }
})

//  Interaction with promotional pictures of films

const eventHandler = ({ target }) => {
    const tvCard = target.closest('.tv-card')
    if (!tvCard) {
        return
    }
    const image = tvCard.querySelector('.tv-card__img')
    if (!!image.dataset.backdrop) {
        [image.src, image.dataset.backdrop] = [image.dataset.backdrop, image.src,]
    }
}

showsList.addEventListener('mouseover', eventHandler)
showsList.addEventListener('mouseout', eventHandler)

//  clicking on a card opens a modal window

showsList.addEventListener('click', e => {
    e.preventDefault();

    const { target } = e;
    // section search with class = "tv-card"
    const tvCard = target.closest('.tv-card');

    if (tvCard) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
}, false);

//  clicking on the modal wrapper or on the cross icon closes the modal window
modal.addEventListener('click', ({ target }) => {
    const isModal = target.classList.contains('modal')
    const isCloseModal = target.closest('.cross')

    if (isModal || isCloseModal) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

//  create DBServise class

class DBService {
    async getData(url) {
        const response = await fetch(url);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }

    async  getTestData() {
        return await this.getData('test.json');
    }

    // attempt to get API key from file
    async getAPIKey() {
        const response = await fetch('/private/api-key.txt');
        const apiKey = await response.text();
    }
}

//  rendering of cards based on data received from a json file
const renderCards = ({ results }) => {
    // use decomposition for each object with information about the film
    // also rename the object fields we need
    results.forEach(({
        vote_average: vote,
        poster_path: poster,
        backdrop_path: backdrop,
        name: title
    }) => {

        const posterURI = poster ? `${IMG_URL + poster}` : DEFAULT_IMG;
        const backdropURI = backdrop ? `${IMG_URL + backdrop}` : '';
        const voteEl = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
            <a href="#" class="tv-card">
                ${voteEl}
                <img class="tv-card__img"
                     src="${posterURI}"
                     data-backdrop="${backdropURI}"
                     alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        showsList.append(card);
    });
}

new DBService().getTestData().then(renderCards)

// ---------- not finised yet -----------------------------
// attempt to get API key from file

async function getAPIKey() {
    const response = await fetch('/private/api-key.json');
    const obj = await response.json();
    window['apiKey'] = await obj.apiKey
}


getAPIKey()
console.log('window.apiKey: ', window.apiKey);
const API_KEY = window.apiKey
