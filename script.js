const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const closeBtn = document.querySelector(".close");

// Custom dropdown elements
const modalSizeDropdown = document.getElementById("modalSizeDropdown");
const selectedSize = modalSizeDropdown.querySelector(".selected");
const optionsContainer = modalSizeDropdown.querySelector(".options");

// 🛒 Cart system
let cart = [];
const cartSidebar = document.getElementById("cartSidebar"); // <div id="cartSidebar"></div> in your HTML
const cartItemsContainer = document.getElementById("cartItems"); // <div id="cartItems"></div> inside sidebar
const cartTotal = document.getElementById("cartTotal"); // <span id="cartTotal"></span>

// Add click event to all products
const products = document.querySelectorAll(".product");
products.forEach(product => {
  product.addEventListener("click", () => {
    const img = product.querySelector("img").src;
    const title = product.querySelector("h3").innerText;
    const price = product.querySelector("p").innerText;

    modalImg.src = img;
    modalTitle.innerText = title;
    modalPrice.innerText = price;
    modalDesc.innerText = "This is a description for " + title + ".";

    // Populate custom size options dynamically
    optionsContainer.innerHTML = ""; // clear previous

    const lowerTitle = title.toLowerCase();
    let sizes = [];

    if(lowerTitle.includes("shirt") || lowerTitle.includes("hoodie") || 
       lowerTitle.includes("pants") || lowerTitle.includes("jacket") || 
       lowerTitle.includes("dress") || lowerTitle.includes("skirt") || 
       lowerTitle.includes("blouse")) {
      sizes = ["S","M","L"];
    } else if(lowerTitle.includes("shoes")) {
      sizes = ["1 UK","2 UK","3 UK","4 UK","5 UK","6 UK","7 UK","8 UK"];
    } else {
      sizes = ["One Size"];
    }

    sizes.forEach(size => {
      const div = document.createElement("div");
      div.classList.add("option");
      div.innerText = size;
      optionsContainer.appendChild(div);

      // click event to select size
      div.addEventListener("click", () => {
        selectedSize.innerText = size;
        optionsContainer.style.display = "none";
      });
    });

    // Reset selected text
    selectedSize.innerText = "Select Size";

    modal.style.display = "block";
  });
});

// Toggle options list when clicking selected area
selectedSize.addEventListener("click", () => {
  optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
});

// Close modal
closeBtn.onclick = () => {
  modal.style.display = "none";
};

// Close modal if clicking outside
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }

  // Close dropdown if clicking outside
  if (!modalSizeDropdown.contains(event.target)) {
    optionsContainer.style.display = "none";
  }
});

document.querySelectorAll(".products-section").forEach(section => {
  const productsGrid = section.querySelector(".products");
  const productCount = productsGrid.querySelectorAll(".product").length;

  if (productCount > 3) {
    productsGrid.classList.add("collapsed");

    // Create arrow button
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("show-more-btn");
    toggleBtn.innerHTML = "&#x25BC;"; // down arrow ▼

    section.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
      productsGrid.classList.toggle("collapsed");
      toggleBtn.classList.toggle("rotated"); // rotate arrow
    });
  }
});

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div class="info">
        <h4>${item.title}</h4>
        <p>Size: ${item.size}</p>
        <p>$${item.price} x ${item.qty}</p>
      </div>
      <button class="remove" data-index="${index}">&times;</button>
    `;
    cartItemsContainer.appendChild(row);

    total += item.price * item.qty;
  });

  cartTotal.innerText = `$${total.toFixed(2)}`;

  // attach remove events
  document.querySelectorAll(".cart-item .remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.dataset.index;
      cart.splice(i, 1);
      updateCart();
    });
  });
}

// Add to cart directly from grid buttons
document.querySelectorAll(".product button").forEach(button => {
  button.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent modal from opening
    const product = button.closest(".product");
    const title = product.querySelector("h3").innerText;
    const price = parseFloat(product.querySelector("p").innerText.replace("$", ""));
    const img = product.querySelector("img").src;

    const size = "One Size"; // grid adds default size

    const existing = cart.find(item => item.title === title && item.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ title, price, img, size, qty: 1 });
    }

    updateCart();
    cartSidebar.classList.add("active"); // open sidebar
  });
});

// Add to cart from modal
document.getElementById("modalAddToCart").addEventListener("click", () => {
  const title = modalTitle.innerText;
  const price = parseFloat(modalPrice.innerText.replace("$", ""));
  const img = modalImg.src;

  const size = selectedSize.innerText === "Select Size" ? "One Size" : selectedSize.innerText;

  const existing = cart.find(item => item.title === title && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title, price, img, size, qty: 1 });
  }

  updateCart();
  cartSidebar.classList.add("active");
  modal.style.display = "none"; // close modal
});

const cartToggle = document.getElementById("cartToggle");

cartToggle.addEventListener("click", () => {
  cartSidebar.classList.toggle("active");
});
document.getElementById("closeCart").addEventListener("click", () => {
  cartSidebar.classList.remove("active");
});