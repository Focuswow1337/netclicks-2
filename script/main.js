//  ------ DOM elements to work with ----------
// menu
const leftMenu = document.querySelector('.left-menu')
const hamburger = document.querySelector('.hamburger')
//  ul with a list of cards
const showsList = document.querySelector('.tv-shows__list')
// loader
const tvShow = document.querySelector('.tv-shows')
// modal window
const modal = document.querySelector('.modal')
const tvCardImg = document.querySelector('.tv-card__img')
const modalTitle = document.querySelector('.modal__title')
const genresList = document.querySelector('.genres-list')
const rating = document.querySelector('.rating')
const description = document.querySelector('.description')
const modalLink = document.querySelector('.modal__link')
const preloader = document.querySelector('.preloader')
//  search form
const searchForm = document.querySelector('.search__form')
const searchFormInput = document.querySelector('.search__form-input')

//  Loder
const loading = document.createElement('div')
loading.classList = 'loading'

// URL for source of pictures (posters)
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
const DEFAULT_IMG = 'img/no-poster.jpg'
const SERVER = 'https://api.themoviedb.org/3'

// get the API key from the local file

let API_KEY

async function getAPIKey() {
    const response = await fetch('/private/api-key.txt');
    API_KEY = await response.text();
    console.log('getAPIKey - API_KEY: ', API_KEY);
}

// check that our API key is written to the apiKey variable
getAPIKey()


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
    event.preventDefault()
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
        preloader
        preloader.style.display = 'block'
        //  getting movie id
        const id = tvCard.dataset.idtv
        //  server request
        new DBService().getTvShow(id)
            .then(({ poster_path, name, genres, vote_average, overview, homepage }) => {
                tvCardImg.src = IMG_URL + poster_path
                modalTitle.textContent = name
                genresList.innerHTML = genres
                    .map(genr => `<li>${genr.name}</li>`)
                    .join('')
                rating.textContent = vote_average
                description.textContent = overview
                if (homepage) {
                    modalLink.href = homepage
                } else {
                    modalLink.textContent = 'Официальная страница отсутствует'
                }
            }).then(() => {
                document.body.style.overflow = 'hidden';
                preloader.style.display = 'none'
                modal.classList.remove('hide')
            })
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

    getTestData() {
        return this.getData('test.json')
    }

    getTestCard() {
        return this.getData('card.json')
    }

    getSearchResult(query) {
        const url = `${SERVER}/search/tv/?api_key=${API_KEY}&language=ru-RU&query=${query}`
        return this.getData(url)
    }

    getTvShow(id) {
        const url = `${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`
        return this.getData(url)
    }
}

//  rendering of cards based on data received from a json file
const renderCards = ({ results }) => {
    // use decomposition for each object with information about the film
    // also rename the object fields we need

    showsList.innerHTML = ''
    if (results.length) {
        results.forEach(({
            vote_average: vote,
            poster_path: poster,
            backdrop_path: backdrop,
            name: title,
            id
        }) => {

            const posterURI = poster ? `${IMG_URL + poster}` : DEFAULT_IMG;
            const backdropURI = backdrop ? `${IMG_URL + backdrop}` : '';
            const voteEl = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

            const card = document.createElement('li');
            card.classList.add('tv-shows__item');
            card.innerHTML = `
            <a href="#" data-idtv="${id}" class="tv-card">
                ${voteEl}
                <img class="tv-card__img"
                     src="${posterURI}"
                     data-backdrop="${backdropURI}"
                     alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
            loading.remove()
            showsList.append(card);
        })
    } else {
        loading.remove()
        showsList.innerHTML = '<span>По вашему запросу ничего не найдено</span>'
    }
}

//  Movie Search Request Processing
searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const value = searchFormInput.value.trim()
    if (value) {
        tvShow.append(loading)
        new DBService().getSearchResult(value).then(renderCards)
    }
    searchFormInput.value = ''
})

{
    //  retrieving movie data from a local json file
    // tvShow.append(loading)
    // new DBService().getTestData().then(renderCards)
}
