/**
 * Admin Panel Backend Server
 * Express.js Server dengan API endpoints
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json({ limit: process.env.MAX_JSON_SIZE || '10mb' }));
app.use(express.urlencoded({ limit: process.env.MAX_JSON_SIZE || '10mb', extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// ==================== AUTH ROUTES ====================
app.post(`${apiPrefix}/auth/login`, (req, res) => {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email dan password harus diisi'
        });
    }

    // Dummy authentication
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken({ email, role: 'admin' });
        return res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: {
                email,
                role: 'admin',
                name: 'Administrator'
            }
        });
    }

    res.status(401).json({
        success: false,
        message: 'Email atau password salah'
    });
});

app.post(`${apiPrefix}/auth/logout`, (req, res) => {
    res.json({
        success: true,
        message: 'Logout berhasil'
    });
});

app.post(`${apiPrefix}/auth/register`, (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Email, password, dan name harus diisi'
        });
    }

    res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        user: { email, name }
    });
});

// ==================== DASHBOARD ROUTES ====================
app.get(`${apiPrefix}/dashboard/stats`, (req, res) => {
    res.json({
        success: true,
        data: {
            totalUsers: 1234,
            totalRevenue: 45200000,
            totalOrders: 892,
            avgRating: 4.8,
            growth: {
                users: 12,
                revenue: 8,
                orders: 5,
                rating: 0.2
            }
        }
    });
});

app.get(`${apiPrefix}/dashboard/activities`, (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                user: 'John Doe',
                activity: 'Login',
                timestamp: '2 minutes ago',
                status: 'success'
            },
            {
                id: 2,
                user: 'Jane Smith',
                activity: 'Upload File',
                timestamp: '15 minutes ago',
                status: 'success'
            },
            {
                id: 3,
                user: 'Mike Johnson',
                activity: 'Settings Changed',
                timestamp: '1 hour ago',
                status: 'warning'
            }
        ]
    });
});

// ==================== USER ROUTES ====================
app.get(`${apiPrefix}/users`, (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const dummyUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-15',
            avatar: 'https://via.placeholder.com/40'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            status: 'active',
            createdAt: '2024-02-20',
            avatar: 'https://via.placeholder.com/40'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'moderator',
            status: 'inactive',
            createdAt: '2024-03-10',
            avatar: 'https://via.placeholder.com/40'
        }
    ];

    const total = dummyUsers.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const data = dummyUsers.slice(skip, skip + limitNum);

    res.json({
        success: true,
        data,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        }
    });
});

app.get(`${apiPrefix}/users/:id`, (req, res) => {
    const { id } = req.params;

    res.json({
        success: true,
        data: {
            id,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-15',
            phone: '08123456789',
            address: 'Jl. Contoh No. 123',
            city: 'Jakarta',
            country: 'Indonesia'
        }
    });
});

app.post(`${apiPrefix}/users`, (req, res) => {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, dan role harus diisi'
        });
    }

    res.status(201).json({
        success: true,
        message: 'User berhasil ditambahkan',
        data: {
            id: Math.floor(Math.random() * 1000),
            name,
            email,
            role,
            status: 'active',
            createdAt: new Date().toISOString()
        }
    });
});

app.put(`${apiPrefix}/users/:id`, (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    res.json({
        success: true,
        message: 'User berhasil diupdate',
        data: {
            id,
            name,
            email,
            role,
            status,
            updatedAt: new Date().toISOString()
        }
    });
});

app.delete(`${apiPrefix}/users/:id`, (req, res) => {
    const { id } = req.params;

    res.json({
        success: true,
        message: 'User berhasil dihapus'
    });
});

// ==================== ANALYTICS ROUTES ====================
app.get(`${apiPrefix}/analytics/overview`, (req, res) => {
    res.json({
        success: true,
        data: {
            pageViews: 45200,
            uniqueVisitors: 12800,
            bounceRate: 32,
            avgSessionDuration: '3m 25s',
            conversionRate: 2.5,
            revenue: 45200000
        }
    });
});

app.get(`${apiPrefix}/analytics/revenue`, (req, res) => {
    res.json({
        success: true,
        data: [
            { date: '2024-01-01', revenue: 35000000 },
            { date: '2024-02-01', revenue: 38000000 },
            { date: '2024-03-01', revenue: 42000000 },
            { date: '2024-04-01', revenue: 39000000 },
            { date: '2024-05-01', revenue: 45000000 },
            { date: '2024-06-01', revenue: 52000000 }
        ]
    });
});

// ==================== SETTINGS ROUTES ====================
app.get(`${apiPrefix}/settings`, (req, res) => {
    res.json({
        success: true,
        data: {
            siteName: 'Admin Panel',
            adminEmail: 'admin@example.com',
            timezone: 'Asia/Jakarta',
            language: 'id',
            theme: 'light'
        }
    });
});

app.put(`${apiPrefix}/settings`, (req, res) => {
    const { siteName, adminEmail, timezone, language, theme } = req.body;

    res.json({
        success: true,
        message: 'Settings berhasil diupdate',
        data: {
            siteName,
            adminEmail,
            timezone,
            language,
            theme,
            updatedAt: new Date().toISOString()
        }
    });
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== UTILITY FUNCTIONS ====================
function generateToken(payload) {
    // Simple token generation (gunakan jsonwebtoken untuk production)
    return 'token_' + Buffer.from(JSON.stringify(payload)).toString('base64');
}

// ==================== START SERVER ====================
app.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════╗
║     Admin Panel Server Running         ║
╚════════════════════════════════════════╝

🌐 Server:   http://${HOST}:${PORT}
📍 API:      http://${HOST}:${PORT}${apiPrefix}
⚙️  Mode:    ${process.env.NODE_ENV || 'development'}
📝 Version:  1.0.0

Press Ctrl+C to stop server
    `);
});

module.exports = app;
