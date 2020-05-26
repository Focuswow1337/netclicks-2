const leftMenu = document.querySelector('.left-menu')
const hamburger = document.querySelector('.hamburger')
const allCardsImages = document.querySelectorAll('.tv-card__img')

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

const eventHandler = (event) => {
    const target = event.target
    const cardImageSrc = target.src
    const cardDataSet = target.dataset.backdrop
    target.src = cardDataSet
    target.dataset.backdrop = cardImageSrc
}

allCardsImages.forEach(cardImage => {
    cardImage.addEventListener('mouseover', eventHandler)
    cardImage.addEventListener('mouseout', eventHandler)
})