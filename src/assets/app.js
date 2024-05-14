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

});
