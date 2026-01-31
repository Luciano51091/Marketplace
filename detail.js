// Questo oggetto "legge" tutto quello che c'è dopo il '?' nell'URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id"); // Estrae il valore di 'id'
console.log("ID recuperato dall'URL:", productId);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTdhMThkOGVlNDIwMjAwMTVhNDc5MmMiLCJpYXQiOjE3Njk2MDk0MzIsImV4cCI6MTc3MDgxOTAzMn0.-19WLVkiayPqFuBoMvkTaS34G-k6ssgobmGvBnHNs0g".trim();
const url = "https://striveschool-api.herokuapp.com/api/product/";
const container = document.getElementById("details-container");

function getDetails() {
  fetch(url + productId, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((details) => renderDetails(details))
    .catch((err) => console.log(err));
}

getDetails();

function renderDetails(product) {
  const container = document.getElementById("details-container");

  container.innerHTML = `
        <div class="row mt-5">
            <div class="col-md-6">
                <img src="${product.imageUrl}" class="img-fluid rounded shadow" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h1 class="display-4">${product.name}</h1>
                <p class="text-muted">Marca: <strong>${product.brand}</strong></p>
                <hr>
                <p class="lead">${product.description}</p>
                <h2 class="text-primary my-4">${product.price}€</h2>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-dark w-100 fw-bold rounded-pill">Aggiungi al carrello</button>
                    <a href="index.html" class="btn btn-outline-secondary w-100 fw-bold rounded-pill">Torna alla Home</a>
                </div>
                
                <p class="mt-4 small text-muted">ID Prodotto: ${product._id}</p>
            </div>
        </div>
    `;
}
