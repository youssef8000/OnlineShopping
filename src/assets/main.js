$(document).ready( function() {

  let cartCounter = 0;
  let cartCounterElement = document.getElementById('cart-counter');

  let addToCartButtons = document.querySelectorAll('.btn-add');
  addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      cartCounter++;
      cartCounterElement.textContent = cartCounter;
    });
  });

  let removeFromCartButtons = document.querySelectorAll('.btn-minus');
  removeFromCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      if (cartCounter > 0) {
        cartCounter--;
        cartCounterElement.textContent = cartCounter;
      }
    });
  });

  $(".heart").click(function() {
    $(this).toggleClass("heart heart-des");
  });

  $('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:5,
            nav:true,
            loop:false
        }
    }
})

});
