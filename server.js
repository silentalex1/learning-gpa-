const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');
const FEEDBACKS_FILE = path.join(__dirname, 'feedbacks.json');

const ADMIN_KEYCODE_PREFIX = 'learning-';
const ADMIN_KEYCODE_LENGTH = 5;

let accounts = [];
let feedbacks = [];

if (fs.existsSync(ACCOUNTS_FILE)) {
    accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
}

if (fs.existsSync(FEEDBACKS_FILE)) {
    feedbacks = JSON.parse(fs.readFileSync(FEEDBACKS_FILE, 'utf8'));
}

function saveAccounts() {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

function saveFeedbacks() {
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(feedbacks, null, 2));
}

function generateKeycode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < ADMIN_KEYCODE_LENGTH; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ADMIN_KEYCODE_PREFIX + result;
}

function validateKeycode(keycode) {
    if (!keycode.startsWith(ADMIN_KEYCODE_PREFIX)) {
        return false;
    }
    const suffix = keycode.slice(ADMIN_KEYCODE_PREFIX.length);
    return suffix.length === ADMIN_KEYCODE_LENGTH && /^[a-z0-9]+$/.test(suffix);
}

app.post('/api/create-account', (req, res) => {
    const { username, password, keycode } = req.body;
    
    if (!username || !password || !keycode) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    
    if (!validateKeycode(keycode)) {
        return res.json({ success: false, message: 'Invalid keycode format' });
    }
    
    if (accounts.find(acc => acc.username === username)) {
        return res.json({ success: false, message: 'Username already exists' });
    }
    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    accounts.push({
        username,
        password: hashedPassword,
        keycode,
        createdAt: new Date().toISOString()
    });
    
    saveAccounts();
    res.json({ success: true, message: 'Account created successfully' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password are required' });
    }
    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const account = accounts.find(acc => acc.username === username && acc.password === hashedPassword);
    
    if (account) {
        const token = crypto.createHash('sha256').update(`${username}-${Date.now()}`).digest('hex');
        res.json({ success: true, token });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

app.get('/api/feedbacks', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    res.json({ success: true, feedbacks });
});

app.post('/api/feedback', (req, res) => {
    const { category, message } = req.body;
    
    if (!category || !message) {
        return res.json({ success: false, message: 'Category and message are required' });
    }
    
    feedbacks.push({
        category,
        message,
        date: new Date().toISOString()
    });
    
    saveFeedbacks();
    res.json({ success: true, message: 'Feedback submitted successfully' });
});

app.get('/api/generate-code', (req, res) => {
    const { username } = req.query;
    
    if (!username) {
        return res.json({ success: false, message: 'Username is required' });
    }
    
    const keycode = generateKeycode();
    res.json({ success: true, keycode });
});

app.get('/admin-panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin panel', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});