const deleteProductButtonElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const result = await fetch(
    '/admin/products/' + productId + '?_csrf=' + csrfToken,
    {
      method: 'DELETE',
    }
  );

  if (!result.ok) {
    alert('Something went wrong');
    return;
  }
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const xx of deleteProductButtonElements) {
  xx.addEventListener('click', deleteProduct);
}
