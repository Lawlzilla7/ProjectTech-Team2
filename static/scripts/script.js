let KleurWaarde = 1;
console.log("Kleurwaarde = " + KleurWaarde);

let VelgenWaarde = 1;
console.log("velgen waarde = " + VelgenWaarde);

let BodyWaarde = 1;
console.log("body waarde = " + BodyWaarde);

function sort(){
    document.addEventListener('DOMContentLoaded', function()
    {
        console.log(options);
        var options = {
            valueNames: ['merk', 'Bouwjaar', 'Brandstof ', 'kilometers']
        }
        var carList = new List('theList', options);
        
        carList.sort('merk', { order: "asc" });
    });
};


function build() {
    document.addEventListener('DOMContentLoaded', function () 
    {
        const ScrollSpeed = 200;
        const CssSetting = false;

        var swiper1 = new Swiper('#swiper1', {
            effect: "coverflow",
            speed: ScrollSpeed,
            cssMode: CssSetting,
            allowTouchMove: false,
            navigation: {
                nextEl: '#swiper1 .swiper-button-next',
                prevEl: '#swiper1 .swiper-button-prev',
            },
        });

        var swiper2 = new Swiper('#swiper2', {
            effect: "coverflow",
            speed: ScrollSpeed,
            cssMode: CssSetting,
            allowTouchMove: false,
            navigation: {
                nextEl: '#swiper2 .swiper-button-next',
                prevEl: '#swiper2 .swiper-button-prev',
            },
        });

        var swiper3 = new Swiper('#swiper3', {
            effect: "coverflow",
            speed: ScrollSpeed,
            cssMode: CssSetting,
            navigation: {
                nextEl: '#swiper3 .swiper-button-next',
                prevEl: '#swiper3 .swiper-button-prev',
            },
        });
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

    if (BodyWaarde === 1) {
        imageCar.src = '/images/hatchback-02.png';
    } else if (BodyWaarde === 2) {
        imageCar.src = '/images/suv.png';
    } else if (BodyWaarde === 3) {
        imageCar.src = '/images/sportcar-02.png';
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
    let image = document.querySelector('#CarBody');

    if (KleurWaarde === 1) {
        console.log("red");
        image.style.filter = 'invert(34%) sepia(49%) saturate(7485%) hue-rotate(345deg) brightness(115%) contrast(102%)';
    } else if (KleurWaarde === 2) {
        console.log("green");
        image.style.filter = 'invert(72%) sepia(74%) saturate(991%) hue-rotate(64deg) brightness(103%) contrast(101%)';
    } else if (KleurWaarde === 3) {
        console.log("blue");
        image.style.filter = 'invert(51%) sepia(69%) saturate(6308%) hue-rotate(209deg) brightness(106%) contrast(101%)';
    }
}

ChangeKleur(KleurWaarde);
ChangeVelg(VelgenWaarde);
ChangeBody(BodyWaarde);




const SendBuildData = () => {
    console.log("body waarde = " + BodyWaarde + " Velgen waarde = " +
        VelgenWaarde + " Kleur waarde = " + KleurWaarde);


    sessionStorage.setItem('Body', BodyWaarde);
    sessionStorage.setItem('Velgen', VelgenWaarde);
    sessionStorage.setItem('Kleur', KleurWaarde);

    // return KleurWaarde + VelgenWaarde + BodyWaarde;
}

// Navigeer naar de 'results' pagina via 'opslaan knop' op build pagina
function navigateToResults() {
    // Roep SendBuildData aan om gegevens te verzenden voordat de pagina wordt gewijzigd
    const data = SendBuildData();
    console.log("Gegevens verzonden: " + data);

    // Navigeer naar de 'resultaten' pagina
    window.location.href = '/results'; 
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
                    const li = document.createElement('li');
                    li.addEventListener('click', () => {
                        window.location = `/detail/${auto._id}`
                    })
                    li.style.cursor = 'pointer'
                    li.classList.add('SearchResult'); 
                    li.style.backgroundImage = `url(/images/auto/${auto.afbeelding})`;

                    const brandstofParagraph = document.createElement('p');
                    brandstofParagraph.textContent = `Brandstof: ${auto.brandstof}`;
                    brandstofParagraph.classList.add('Brandstof');
                    li.appendChild(brandstofParagraph);

                    const bouwjaarParagraph = document.createElement('p');
                    bouwjaarParagraph.textContent = `Bouwjaar: ${auto.Bouwjaar}`;
                    bouwjaarParagraph.classList.add('Bouwjaar');
                    li.appendChild(bouwjaarParagraph);

                    const kmStandParagraph = document.createElement('p');
                    kmStandParagraph.textContent = `KM Stand: ${auto.kilometers}`;
                    kmStandParagraph.classList.add('kilometers');
                    li.appendChild(kmStandParagraph);

                    const merkHeading = document.createElement('h3');
                    merkHeading.textContent = auto.merk;
                    merkHeading.classList.add('merk');
                    li.appendChild(merkHeading);

                    searchResult.appendChild(li);
                }
            }
        })
}

// detailpagina - resultaten laten zien
// function showDetails() {
//     fetch(`/api/auto/${window.location.search}`)
//         .then(result => {
//             if (!result.ok) {
//                 alert('Deze auto is helaas niet beschikbaar, kies een andere auto.')
//             } else {
//                 return result.json()
//             }
//         })
//         .then(autos => {
//             if (autos.length === 0) {
//                 alert('Deze auto is helaas niet beschikbaar, kies een andere auto.')
//             } else {
//                 // auto's renderen:
//                 const detailResult = document.querySelector('ul.detailResultsList')
//                 detailResult.innerHTML = ''
//             }
//         })
// }


const ToResults = () => {
    window.location.href = '/results'; 
}

const ClickFunction = () => {
    SendBuildData();
    ToResults();
}

const OnLoadResults = () => {
    let image = document.querySelector('#CarBody');
    let image2 = document.querySelector('#CarVelgen');
    let image3 = document.querySelector('#CarKleur');

    console.log(image);

    if (sessionStorage.getItem("Body") == 1) {
        image.src = '/images/hatchback-02.png';
    } else if (sessionStorage.getItem("Body") == 2) {
        image.src = '/images/suv.png';
    } else if (sessionStorage.getItem("Body") == 3) {
        image.src = '/images/sportcar-02.png';
    }

    if (sessionStorage.getItem("Velgen") == 1) {
        image2.src = '/images/blue.png';
    } else if (sessionStorage.getItem("Velgen") == 2) {
        image2.src = '/images/red.png';
    } else if (sessionStorage.getItem("Velgen") == 3) {
        image2.src = '/images/green.png';
    }

    if (sessionStorage.getItem("Kleur") == 1) {
        image.style.filter = 'invert(34%) sepia(49%) saturate(7485%) hue-rotate(345deg) brightness(115%) contrast(102%)';
    } else if (sessionStorage.getItem("Kleur") == 2) {
        image.style.filter = 'invert(72%) sepia(74%) saturate(991%) hue-rotate(64deg) brightness(103%) contrast(101%)';
    } else if (sessionStorage.getItem("Kleur") == 3) {
        image.style.filter = 'invert(51%) sepia(69%) saturate(6308%) hue-rotate(209deg) brightness(106%) contrast(101%)';
    }
}