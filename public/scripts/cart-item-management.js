const cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
);

const cartTotalPrice = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.links .badge');

async function updateCartItem(event) {
  event.preventDefault();
  const form = event.target;
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong!!!');
    return;
  }
  if (!response.ok) {
    alert('Something went wrong!!!');
    return;
  }

  const responseData = await response.json();
  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPrice =
      form.parentElement.querySelector('.cart-item-total');
    cartItemTotalPrice.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPrice.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  for (const cartBadge of cartBadgeElements) {
    cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
  }
}

for (const x of cartItemUpdateFormElements) {
  x.addEventListener('submit', updateCartItem);
}
