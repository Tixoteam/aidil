const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simpan bukti pembayaran
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Endpoint untuk konfirmasi pembayaran
app.post('/api/confirm-payment', upload.single('screenshot'), (req, res) => {
    const { orderId } = req.body;
    const screenshotPath = req.file ? req.file.path : null;

    if (!orderId || !screenshotPath) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    return res.status(200).json({ message: 'Payment confirmed', data: { orderId, screenshotPath } });
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
