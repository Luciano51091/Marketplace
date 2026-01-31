//Funzione per richiamare tramite la fetch i dati:

const container = document.getElementById("products-container");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTdhMThkOGVlNDIwMjAwMTVhNDc5MmMiLCJpYXQiOjE3Njk2MDk0MzIsImV4cCI6MTc3MDgxOTAzMn0.-19WLVkiayPqFuBoMvkTaS34G-k6ssgobmGvBnHNs0g".trim();
const url = "https://striveschool-api.herokuapp.com/api/product/";

//1. FUNZIONE DI RECUPER PRODOTTI
const getProducts = async () => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const products = await response.json();
      renderProducts(products);
    }
  } catch (err) {
    console.error(err);
  }
};

// 2. CREAZIONE CARD PRODOTTI
const renderProducts = (products) => {
  container.innerHTML = products
    .map((product) => {
      const formattedPrice = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(product.price);

      return `
      <div class="col-12 col-md-6 col-lg-4 col-xl-3">
        <div class="card h-100 shadow-sm border-0 transition-hover">
          <img src="${product.imageUrl}" class="card-img-top p-3" alt="${product.name}" style="height: 200px; object-fit: contain;">
          <div class="card-body d-flex flex-column">
            <h6 class="text-uppercase text-muted small fw-bold mb-1">${product.brand}</h6>
            <h5 class="card-title fw-bold">${product.name}</h5>
            <p class="card-text text-muted small flex-grow-1">
              ${product.description.substring(0, 100)}... 
            </p>
            <div class="mt-auto pt-3">
              <p class="h5 fw-bold text-primary mb-3">${formattedPrice}</p>
              <a href="product.html?id=${product._id}" class="btn btn-outline-dark w-100 fw-bold rounded-pill">
                Visualizza Prodotto
              </a>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
};

getProducts();
