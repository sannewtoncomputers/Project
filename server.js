const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = 'admin123';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const MESSAGES_FILE = path.join(__dirname, 'messages.json');
const DATA_FILE = path.join(__dirname, 'data.json');

// Create data.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    const sampleData = {
        services: [
            { icon: "fa-laptop", title: "Computer Repair", desc: "Hardware diagnostics and repair" },
            { icon: "fa-video", title: "CCTV Installation", desc: "Security camera systems" }
        ],
        projects: [
            { title: "Network Setup", desc: "Complete office network installation" }
        ],
        products: ["Laptops", "CCTV Cameras", "Network Equipment"],
        consultant: {
            name: "Newton Sam",
            title: "Senior ICT Consultant",
            bio: "Expert in network design and security",
            email: "newton@samnewton.com",
            phone: "+234 (070) 6615-9151"
        },
        contact: {
            address: "#5 Igwebuike Road, Awka, Anambra State",
            phone: "+234 (070) 6615-9151",
            email: "info@samnewton.com",
            hours: "Mon-Fri 8-6"
        },
        socialMedia: [
            { platform: "Facebook", icon: "fa-facebook", url: "#" }
        ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(sampleData, null, 2));
}

// Create messages.json if it doesn't exist
if (!fs.existsSync(MESSAGES_FILE)) {
    const sampleMessages = [
        {
            id: 1,
            name: 'John Okonkwo',
            email: 'john.o@example.com',
            service: 'Computer Repair',
            message: 'My laptop is not booting up. Please help.',
            date: new Date().toLocaleString(),
            replied: false
        },
        {
            id: 2,
            name: 'Sarah Adeyemi',
            email: 'sarah.a@example.com',
            service: 'CCTV Installation',
            message: 'Need quote for 8 cameras at our office.',
            date: new Date().toLocaleString(),
            replied: false
        }
    ];
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(sampleMessages, null, 2));
}

function getMessages() {
    try {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveMessages(messages) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// API Routes
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

app.post('/api/consultation', (req, res) => {
    const { name, email, service, message } = req.body;
    if (!name || !email || !service || !message) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    
    const messages = getMessages();
    messages.unshift({
        id: Date.now(),
        name,
        email,
        service,
        message,
        date: new Date().toLocaleString(),
        replied: false
    });
    saveMessages(messages);
    
    console.log('📨 New Consultation:', name, email, service);
    res.json({ success: true, message: 'Request saved' });
});

app.post('/api/admin/messages', (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Invalid password' });
    }
    res.json({ success: true, messages: getMessages() });
});

app.post('/api/admin/reply', (req, res) => {
    const { password, email, subject, message } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    if (!email || !message) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    console.log('\n📧 EMAIL REPLY:');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('===========================\n');

    const messages = getMessages();
    const updated = messages.map(msg => {
        if (msg.email === email && !msg.replied) {
            return { ...msg, replied: true };
        }
        return msg;
    });
    saveMessages(updated);

    res.json({ success: true, message: 'Reply sent' });
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve main site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║  🚀 SAMNEWTON COMPUTERS TECHNOLOGY          ║
║  📡 http://localhost:${PORT}                  ║
║  🌐 Site: http://localhost:${PORT}/           ║
║  📊 Dashboard: /dashboard                    ║
║  🔑 Password: ${ADMIN_PASSWORD}               ║
╚══════════════════════════════════════════════╝
    `);
});