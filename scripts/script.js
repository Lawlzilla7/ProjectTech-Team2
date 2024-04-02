let KleurWaarde = 1;
console.log("Kleurwaarde = " + KleurWaarde);

let VelgenWaarde = 1;
console.log("velgen waarde = " + VelgenWaarde);

let BodyWaarde = 1;
console.log("body waarde = " + BodyWaarde);
let imageCar = document.querySelector('#CarBody');

document.addEventListener('DOMContentLoaded', function () {
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
        imageCar.src = '/images/green.png';
    } else if (BodyWaarde === 2) {
        imageCar.src = '/images/red.png';
    } else if (BodyWaarde === 3) {
        imageCar.src = '/images/blue.png';
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
        imageCar.style.filter = 'hue-rotate(0deg)'; // red
    } else if (KleurWaarde === 2) {
        imageCar.style.filter = 'hue-rotate(120deg)'; // green
    } else if (KleurWaarde === 3) {
        imageCar.style.filter = 'hue-rotate(240deg)'; // blue
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
}
const ToResults = () => {
    location.href = 'results.html'
}

const ClickFunction = () => {
    SendBuildData();
    ToResults();
}

const OnLoadResults = () => {
    let image = document.querySelector('#CarBody');
    let image2 = document.querySelector('#CarVelgen');
    let image3 = document.querySelector('#CarKleur');

    if (sessionStorage.getItem("Body") == 1) {
        image.src = '/images/green.png';
    } else if (sessionStorage.getItem("Body") == 2) {
        image.src = '/images/red.png';
    } else if (sessionStorage.getItem("Body") == 3) {
        image.src = '/images/blue.png';
    }

    if (sessionStorage.getItem("Velgen") == 1) {
        image2.src = '/images/blue.png';
    } else if (sessionStorage.getItem("Velgen") == 2) {
        image2.src = '/images/red.png';
    } else if (sessionStorage.getItem("Velgen") == 3) {
        image2.src = '/images/green.png';
    }

    if (sessionStorage.getItem("Kleur") == 1) {
        image.style.filter = 'hue-rotate(0deg)'; // red
    } else if (sessionStorage.getItem("Kleur") == 2) {
        image.style.filter = 'hue-rotate(120deg)'; // green
    } else if (sessionStorage.getItem("Kleur") == 3) {
        image.style.filter = 'hue-rotate(240deg)'; // blue
    }

    // let items = ["Body", "Velgen", "Kleur"];
    // let images = [image, image2, image3];
    // let colors = ['/images/green.png', '/images/red.png', '/images/blue.png'];

    // for (let i = 0; i < items.length; i++) {
    //     let itemValue = sessionStorage.getItem(items[i]);
    //     if (itemValue >= 1 && itemValue <= 3) {
    //         images[i].src = colors[itemValue - 1];
    //     }
    // }


}

const baseURL = "https://www.amiiboapi.com/api/";
const endPoint = "amiibo/?gameseries=Super Mario";

const URL = baseURL + endPoint;
const list = document.querySelector('ul');

function GetCars() {
    getData(URL).then((data) => {
        const AllCars = data.cars;
        AllCars.forEach(AnCars => {
            const CarListElement =
                `
                    <li style="background-image: url('${AnCars.imageUrl}');">
						<h3>${AnCars.name}</h3>
                        <p>${AnCars.year}</p>
					</li>
				`;
            list.insertAdjacentHTML('beforeend', CarListElement);
        })
    })
}

/* <img src="${AnCars.image}" alt="${AnCars.name}"></img> */

async function getData(URL) {
    return (
        fetch(URL)
        .then(response => response.json())
        .then(jsonData => jsonData)
    );
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