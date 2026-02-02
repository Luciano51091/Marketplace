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
    <div class="row mt-5 align-items-center justify-content-center">
        <div class="col-md-5 col-lg-4 text-center mb-4">
            <div class="p-4 bg-light rounded-4 shadow-sm">
                <img src="${product.imageUrl}" 
                     class="img-fluid transition-hover" 
                     alt="${product.name}" 
                     style="max-height: 350px; object-fit: contain;">
            </div>
        </div>

        <div class="col-md-6 ps-md-5">
            <p class="text-uppercase text-primary fw-bold small mb-1">${product.brand}</p>
            <h1 class="display-5 fw-bold mb-3">${product.name}</h1>
            
            <p class="lead text-muted mb-4" style="font-size: 1.1rem; line-height: 1.6;">
                ${product.description.length > 250 ? product.description.substring(0, 250) + "..." : product.description}
            </p>
            
            <h2 class="fw-bold mb-4">${finalPrice}</h2>
            
            <div class="d-grid gap-3 d-md-flex">
                <button id="add-btn" class="btn btn-dark btn-lg px-5 rounded-pill shadow-sm animate-cart">
                    Aggiungi al carrello
                </button>
                <button id="clear-btn" class="btn btn-outline-danger rounded-pill px-4">
                    Svuota
                </button>
            </div>
            
            <div class="mt-4 pt-4 border-top">
                <a href="index.html" class="text-decoration-none text-dark fw-bold">
                    ← Torna allo shop
                </a>
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
