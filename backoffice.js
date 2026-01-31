const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTdhMThkOGVlNDIwMjAwMTVhNDc5MmMiLCJpYXQiOjE3Njk2MDk0MzIsImV4cCI6MTc3MDgxOTAzMn0.-19WLVkiayPqFuBoMvkTaS34G-k6ssgobmGvBnHNs0g".trim();
const url = "https://striveschool-api.herokuapp.com/api/product/";
const form = document.getElementById("product-form");
let idDaModificare = null;

// 1. RECUPERO PRODOTTI (GET)
const getProducts = async () => {
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      renderTable(data);
    } else {
      console.error("Errore nel recupero dati");
    }
  } catch (error) {
    console.error("Errore di rete:", error);
  }
};

// 2. CREAZIONE TABELLA DEI PRODOTTI
const renderTable = (products) => {
  const tdbody = document.getElementById("admin-list");

  const rows = products.map((product) => {
    // Formattazione prezzo in Euro
    const formattedPrice = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(product.price);

    return `
      <tr>
          <td><img src="${product.imageUrl}" width="50" class="rounded shadow-sm"></td>
          <td>
              <strong>${product.name}</strong><br>
              <small class="text-muted">${product.brand}</small>
          </td>
          <td>${formattedPrice}</td>
          <td class="text-end">
              <button class="btn btn-warning btn-sm" onclick="Edit('${product._id}')">Modifica</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Elimina</button>
          </td>
      </tr>
    `;
  });

  tdbody.innerHTML = rows.join("");
};

// 3. MODIFICA DEI PRODOTTI
const Edit = async (id) => {
  try {
    const response = await fetch(url + id, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const product = await response.json();

    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("brand").value = product.brand;
    document.getElementById("imageUrl").value = product.imageUrl;
    document.getElementById("price").value = product.price;

    idDaModificare = id;

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.innerText = "Aggiorna Prodotto";
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-warning");

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Errore nel caricamento del prodotto:", error);
  }
};

// 4. INVIO DEI DATI MODIFICATI
form.onsubmit = async (event) => {
  event.preventDefault();

  const priceInput = document.getElementById("price").value;

  const productData = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("imageUrl").value,
    price: parseFloat(String(priceInput).replace(",", ".")),
  };

  try {
    let response;
    if (idDaModificare) {
      response = await fetch(url + idDaModificare, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
    } else {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
    }

    if (response.ok) {
      alert(idDaModificare ? "Prodotto aggiornato!" : "Prodotto creato!");

      idDaModificare = null;
      form.reset();
      const submitBtn = document.getElementById("submit-btn");
      submitBtn.innerText = "Crea Prodotto";
      submitBtn.classList.remove("btn-warning");
      submitBtn.classList.add("btn-primary");

      getProducts();
    } else {
      alert("Errore durante l'operazione: " + response.status);
    }
  } catch (error) {
    console.error("Errore:", error);
  }
};

// 5. CANCELLAZIONE PRODOTTO
const deleteProduct = async (id) => {
  if (confirm("Vuoi davvero eliminare questo prodotto?")) {
    try {
      const response = await fetch(url + id, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Prodotto eliminato con successo!");
        getProducts();
      } else {
        alert("Errore durante l'eliminazione");
      }
    } catch (error) {
      console.error(error);
    }
  }
};

getProducts();
