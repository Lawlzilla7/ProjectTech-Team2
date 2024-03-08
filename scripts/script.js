import Swiper from 'swiper';


// var options = 
//  {
//     direction: 'horizontal', 
//     loop: 'true',
//     speed : 300, 
//     cssMode:true,
   
//     pagination:{
//       el:'.swiper-pagination', 
//       type: 'fraction'
//     },
//     navigation:{
//      nextEl:'.swiper-button-next',
//      prevEl:'.swiper-button-prev'
//    }
   
// };



document.addEventListener('DOMContentLoaded', function () {
  var swiper1 = new Swiper('#swiper1', {
      direction: 'horizontal',
      loop: true,
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });

  var swiper2 = new Swiper('#swiper2', {
      direction: 'horizontal',
      loop: true,
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });

  var swiper3 = new Swiper('#swiper3', {
      direction: 'horizontal',
      loop: true,
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });
});