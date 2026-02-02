const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
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
  const finalPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  container.innerHTML = `
        <div class="row mt-5">
            <div class="col-md-6 text-center">
                <img src="${product.imageUrl}" class="img-fluid rounded shadow-lg p-4 bg-light" alt="${product.name}" style="max-height: 500px; object-fit: contain;">
            </div>
            <div class="col-md-6">
                <h1 class="display-4 fw-bold">${product.name}</h1>
                <p class="text-muted h4">Brand: ${product.brand}</p>
                <hr>
                <p class="lead text-secondary">${product.description}</p>
                <h2 class="text-dark fw-bold my-4">${finalPrice}</h2>
                
                <div class="d-grid gap-3">
                    <button id="add-btn" class="btn btn-outline-dark fw-bold rounded-pill">Aggiungi al carrello</button>
                    
                    <button id="clear-btn" class="btn btn-outline-danger rounded-pill">Svuota carrello</button>
                    
                    
                </div>
            </div>
        </div>
    `;

  document.getElementById("add-btn").onclick = () => addToCart(product);
  document.getElementById("clear-btn").onclick = () => clearCart();
}

//CREAZIONE ALERT CON BOOTSTRAP
const showAlert = (message, type) => {
  const alertPlaceholder = document.getElementById("alert-placeholder");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show shadow-sm rounded-pill px-4" role="alert">
       <i class="bi bi-info-circle me-2"></i> ${message}
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance(wrapper.querySelector(".alert"));
    alert.close();
  }, 1000);

  alertPlaceholder.append(wrapper);
};

// FUNZIONE PER AGGIUNGERE I PRODOTTI AL CARRELLO
const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("bicycle-cart")) || [];

  cart.push(product);

  localStorage.setItem("bicycle-cart", JSON.stringify(cart));
  showAlert(`<strong>${product.name}</strong> è stato aggiunto al carrello!`, "success");
  updateCartCount();
};

// FUNZIONE PER SVUOTARE IL CARRELLO
const clearCart = () => {
  if (confirm("Vuoi davvero svuotare il carrello?")) {
    localStorage.removeItem("bicycle-cart");

    showAlert("Il carrello è stato svuotato correttamente.", "warning");

    updateCartCount();
  }
};

//FUNZIONE CONTATORE CARRELLO
const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("bicycle-cart")) || [];
  const badge = document.querySelector(".badge");
  if (badge) {
    badge.innerText = cart.length;
  }
};

updateCartCount();
