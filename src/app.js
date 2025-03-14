document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Makaroni Bantat Pedas", img: "1.png", price: 40000 },
      { id: 2, name: "Seblak Ravael", img: "2.png", price: 48000 },
      { id: 3, name: "Bastik Pedas", img: "3.png", price: 48000 },
      { id: 4, name: "Kripik Tempe", img: "4.png", price: 48000 },
      { id: 5, name: "Kripca Pedas", img: "5.png", price: 64000 },
      { id: 6, name: "Pisang Bulat", img: "6.png", price: 52000 },
      { id: 7, name: "Peyek Kacang Tanah", img: "7.png", price: 48000 },
      { id: 8, name: "Soes Coklat", img: "8.png", price: 64000 },
      { id: 9, name: "Kripik Talas Sapi Panggang", img: "9.png", price: 52000 },
      { id: 10, name: "Kripik Pisang", img: "10.png", price: 56000 },
      { id: 11, name: "Kripik Singkong Ori", img: "11.png", price: 28000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yg sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barangnya sudah ada, apakah barang beda/sama
        this.items = this.items.map((item) => {
          // jka barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //  jika sudah ada brang, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      //  ambil item yg mau diremove
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dr 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.item = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //  jika barang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;


const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function() {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !==0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim Data Ketika tombol Ceckout Diklik
checkoutButton.addEventListener('click', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMassage(objData);
  window.open('http://wa.me/6285869695396?text=' + encodeURIComponent(message));
});


//  Format Pesan Whatsapp
const formatMassage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No Hp: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} * ${rupiah(item.
total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
TERIMA KASIH LEKKU.`;
};








// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
