const products = [
  { name: 'Sewa Bot Arisu Tendou', price: 5000, duration: 10 },
  { name: 'Sewa Bot Arisu Tendou', price: 10000, duration: 20 },
  { name: 'Sewa Bot Arisu Tendou', price: 15000, duration: 30 },
  { name: 'Sewa Bot Arisu Tendou', price: 20000, duration: 40 },
{ name: 'Premium Bot Arisu Tendou', price: 5000, duration: 15 },
{ name: 'Premium Bot Arisu Tendou', price: 10000, duration: 30 },
{ name: 'Premium Bot Arisu Tendou', price: 20000, duration: 60 },
  { name: 'Sewa Bot Arisu Tendou(GC+PREMIUM'), price: 70000, duration: 0 }
];

const productTableBody = document.getElementById('product-table-body');
products.forEach((product, index) => {
  const row = document.createElement('tr');
  row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.duration == 0 ? 'permanen' : product.duration == 999 ? '1 Season' : product.duration}</td>
        <td><button class="cyan-btn" onclick="selectProduct(${index})">Pilih</button></td>
    `;
  productTableBody.appendChild(row);
});

let selectedProduct = null;

function selectProduct(index) {
  selectedProduct = products[index];

  const checkoutSection = document.getElementById('checkout-section');
  checkoutSection.style.display = 'block';

  document.getElementById('checkout-duration').value = selectedProduct.duration;
  document.getElementById('checkout-amount').value = selectedProduct.price;
}

document.getElementById('generate-qris-btn').addEventListener('click', function() {
    if (selectedProduct) {
        const duration = document.getElementById('checkout-duration').value;
        const amount = selectedProduct.price;

        const qrisData = `00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214006357251354260303UMI51440014ID.CO.QRIS.WWW0215ID20243485043720303UMI5204541153033605802ID5922AIDILAHSTORE OK20483096009INDRAMAYU61054521162070703A0163046BAF`;
        const generatedQRIS = create(qrisData, amount);

        const qrCanvas = document.getElementById('qr-code');
        qrCanvas.innerHTML = ""; 

        QRCode.toCanvas(qrCanvas, generatedQRIS, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log('QR code generated!');
            }
        });

        document.getElementById('whatsapp-confirmation-container').classList.remove('hidden');

        const whatsappMessage = `Halo, saya ingin melakukan konfirmasi pembayaran untuk produk: ${selectedProduct.name} dengan durasi ${duration} hari dan total pembayaran Rp ${amount}.`;
        const whatsappUrl = `https://wa.me/6281573232268?text=${encodeURIComponent(whatsappMessage)}`;

        document.getElementById('whatsapp-button').setAttribute('href', whatsappUrl);

        document.getElementById('generate-qris-btn').style.display = 'none';
        document.getElementById('download-qr-container').classList.remove('hidden');

        const downloadLink = document.getElementById('download-qr-btn');
        qrCanvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
        }, 'image/png');
    }
});

function convertCRC16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
        crc &= 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function create(qrisData, paymentAmount) {
    try {
        qrisData = qrisData.slice(0, -4);
        const modifiedData = qrisData.replace("010211", "010212");

        const splitData = modifiedData.split("5802ID");
        if (splitData.length !== 2) {
            throw new Error("Invalid QRIS data format");
        }

        const formattedAmount = "54" + ("0" + paymentAmount.toString().length).slice(-2) + paymentAmount;
        const finalData = splitData[0] + formattedAmount + "5802ID" + splitData[1];

        return finalData + convertCRC16(finalData);
    } catch (error) {
        console.error("Error creating QR:", error.message);
        throw error;
    }
}

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('open');
}