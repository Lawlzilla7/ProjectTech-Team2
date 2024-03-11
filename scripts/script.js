document.addEventListener('DOMContentLoaded', function () {
    var swiper1 = new Swiper('#swiper1', {
        speed: 300,
        cssMode: true, 
        navigation: {
            nextEl: '#swiper1 .swiper-button-next',
            prevEl: '#swiper1 .swiper-button-prev',
        },
    });

    var swiper2 = new Swiper('#swiper2', {
        speed: 300,
        cssMode: true, 
        navigation: {
            nextEl: '#swiper2 .swiper-button-next',
            prevEl: '#swiper2 .swiper-button-prev',
        },
    });

    var swiper3 = new Swiper('#swiper3', {
        speed: 300,
        cssMode: true,    
        navigation: {
            nextEl: '#swiper3 .swiper-button-next',
            prevEl: '#swiper3 .swiper-button-prev',
            
        },
    });
});
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
