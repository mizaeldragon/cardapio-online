const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between border-2 rounded">
            <div class="mx-2 my-2">
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">Preço: ${item.price.toFixed(2)}</p>
            </div>

            <div class="mx-2 my-2">
                <button class="remove-item-modal" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-item-modal")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value.trim();

  if (inputValue === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    checkoutBtn.setAttribute("disabled", true);
  } else {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
    checkoutBtn.removeAttribute("disabled");
  }
});

checkoutBtn.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "OPS! O RESTAURANTE ESTÁ FECHADO NO MOMENTO!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();

    cart = [];
    updateCartModal();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value.trim() === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    checkoutBtn.setAttribute("disabled", true);
    return;
  }

  let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const cartItems = cart
    .map((item) => {
      return `🍔 *${item.name}*\nQuantidade: ${
        item.quantity
      }\nPreço Unitário: R$ ${item.price.toFixed(2)}\n`;
    })
    .join("\n");

  const message = encodeURIComponent(
    `🛒 *Resumo do Pedido* 🛒👌\n\n${cartItems}\n📍 *Endereço de Entrega:*\n${
      addressInput.value
    }\n\n💵 *Total:* ${total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}\n\n✅ *Aguardo a confirmação do pedido!*`
  );
  const phone = "99981979728";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();

  addressInput.value = "";
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 13 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.add("bg-red-500");
  spanItem.classList.remove("bg-green-600");
}
