let KleurWaarde = 1;
console.log("Kleurwaarde = " + KleurWaarde);


let VelgenWaarde = 1;
console.log("velgen waarde = " + VelgenWaarde);


let BodyWaarde = 1;
console.log("body waarde = " + BodyWaarde);


function build() {
    const ScrollSpeed = 200;
    const CssSetting = false;

    var swiper1 = new Swiper('#swiper1', {
        speed: ScrollSpeed,
        cssMode: CssSetting,
        allowTouchMove: false,
        navigation: {
            nextEl: '#swiper1 .swiper-button-next',
            prevEl: '#swiper1 .swiper-button-prev',
        },
    });

    var swiper2 = new Swiper('#swiper2', {
        speed: ScrollSpeed,
        cssMode: CssSetting,
        allowTouchMove: false,
        navigation: {
            nextEl: '#swiper2 .swiper-button-next',
            prevEl: '#swiper2 .swiper-button-prev',
        },
    });

    var swiper3 = new Swiper('#swiper3', {
        speed: ScrollSpeed,
        cssMode: CssSetting,
        navigation: {
            nextEl: '#swiper3 .swiper-button-next',
            prevEl: '#swiper3 .swiper-button-prev',
        },
    });
};


const KleurKnopPrev = () => {
    KleurWaarde -= 1;
    ChangeKleur(KleurWaarde);

    console.log("Kleurwaarde = " + KleurWaarde);
}

const KleurKnopNext = () => {
    KleurWaarde += 1;
    ChangeKleur(KleurWaarde);

    console.log("Kleurwaarde = " + KleurWaarde);
}

const VelgKnopPrev = () => {
    VelgenWaarde -= 1;
    ChangeVelg(VelgenWaarde);

    console.log("velgen waarde = " + VelgenWaarde);
}

const VelgKnopNext = () => {
    VelgenWaarde += 1;
    ChangeVelg(VelgenWaarde);

    console.log("velgen waarde = " + VelgenWaarde);
}
const BodyKnopPrev = () => {
    BodyWaarde -= 1;
    ChangeBody(BodyWaarde);

    console.log("body waarde = " + BodyWaarde);
}

const BodyKnopNext = () => {
    BodyWaarde += 1;
    ChangeBody(BodyWaarde);

    console.log("body waarde = " + BodyWaarde);
}


const ChangeBody = (BodyWaarde) => {
    let image = document.querySelector('#CarBody');

    if (BodyWaarde === 1) {
        image.src = '/images/green.png';
    } else if (BodyWaarde === 2) {
        image.src = '/images/red.png';
    } else if (BodyWaarde === 3) {
        image.src = '/images/blue.png';
    }

}

const ChangeVelg = (VelgenWaarde) => {
    let image = document.querySelector('#CarVelgen');

    if (VelgenWaarde === 1) {
        image.src = '/images/blue.png';
    } else if (VelgenWaarde === 2) {
        image.src = '/images/red.png';
    } else if (VelgenWaarde === 3) {
        image.src = '/images/green.png';
    }
}

const ChangeKleur = (KleurWaarde) => {
    let image = document.querySelector('#CarKleur');

    if (KleurWaarde === 1) {
        image.src = '/images/red.png';
    } else if (KleurWaarde === 2) {
        image.src = '/images/green.png';
    } else if (KleurWaarde === 3) {
        image.src = '/images/blue.png';
    }

}

ChangeKleur(KleurWaarde);
ChangeVelg(VelgenWaarde);
ChangeBody(BodyWaarde);

const SendBuildData = () => {
    console.log("body waarde = " + BodyWaarde + " Velgen waarde = " +
        VelgenWaarde + " Kleur waarde = " + KleurWaarde);

    return KleurWaarde + VelgenWaarde + BodyWaarde;
}

// Navigeer naar de 'results' pagina via 'opslaan knop' op build pagina
function navigateToResults() {
    // Roep SendBuildData aan om gegevens te verzenden voordat de pagina wordt gewijzigd
    const data = SendBuildData();
    console.log("Gegevens verzonden: " + data);

    // Navigeer naar de 'resultaten' pagina
    window.location.href = '/resultaten'; 
}

function showResults() {
    fetch(`/api/auto/${window.location.search}`)
        .then(result => {
            if (!result.ok) {
                alert('Helaas ging er iets mis bij het ophalen van het resultaat. Probeer het later nogmaals.')
            } else {
                return result.json()
            }
        })
        .then(autos => {
            if (autos.length === 0) {
                alert('Er zijn geen auto\'s gevonden die aan je zoekcriteria voldoen. Probeer het met andere zoekcriteria.')
            } else {
                // auto's renderen:
                const searchResult = document.querySelector('ul.SearchResultList')
                searchResult.innerHTML = ''
                for (const auto of autos) {
                    const li = document.createElement('li')
                    li.classList.add('SearchResult')
                    li.style.backgroundImage = `url(/images/auto/${auto.afbeelding})`
                    li.appendChild(document.createElement('h3')).textContent = auto.merk
                    li.appendChild(document.createElement('p')).textContent = `Brandstof: ${auto.brandstof}`
                    li.appendChild(document.createElement('p')).textContent = `Bouwjaar: ${auto.Bouwjaar}`
                    li.appendChild(document.createElement('p')).textContent = `KM Stand: ${auto.kilometers}`
                    searchResult.appendChild(li)
                    // console.log('hallo')
                }
            }
        })
}

//detailpagina - resultaten laten zien
function showDetails() {
    fetch(`/api/auto/${window.location.search}`)
    .then(result => {
        if(!result.ok){
            alert('Deze auto is helaas niet beschikbaar, kies een andere auto.')
        } else {
            return result.json()
        }
    })
    .then(autos => {
        if (autos.length === 0) {
            alert('Deze auto is helaas niet beschikbaar, kies een andere auto.')
        } else {
            // auto's renderen:
            const detailResult = document.querySelector('ul.detailResultsList')
            detailResult.innerHTML = ''
   
        }
        })
}        



// var options = {
//     direction: 'horizontal',
//     loop: 'true',
//     speed: 300,
//     cssMode: true,

//     pagination: {
//         el: '.swiper-pagination',
//         type: 'fraction'
//     },
//     navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev'
//     }

// };