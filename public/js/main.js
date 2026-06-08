/**
 * Main Application Script
 * Inisialisasi aplikasi dan event handlers
 */

// Initialize Framework
const app = new AdminPanelFramework({
    apiBaseUrl: '/api/v1',
    animationDuration: 300
});

// Data dummy untuk demo
const dummyData = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joinDate: '2024-01-15', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', joinDate: '2024-02-20', status: 'Active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Moderator', joinDate: '2024-03-10', status: 'Inactive' },
    ],
    stats: {
        totalUsers: 1234,
        totalRevenue: 45200000,
        totalOrders: 892,
        avgRating: 4.8
    }
};

// Initialize app on document ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadDashboardData();
});

/**
 * Initialize application
 */
function initializeApp() {
    // Set initial page
    app.navigateTo('dashboard');
    
    // Load users list
    loadUsersList();
    
    // Set up modal handlers
    setupModalHandlers();

    console.log('✅ Application initialized');
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    // Update stats
    document.getElementById('totalUsers').textContent = app.formatNumber(dummyData.stats.totalUsers);
    document.getElementById('totalRevenue').textContent = app.formatCurrency(dummyData.stats.totalRevenue);
    document.getElementById('totalOrders').textContent = app.formatNumber(dummyData.stats.totalOrders);
    document.getElementById('avgRating').textContent = dummyData.stats.avgRating + '/5';

    // Initialize charts
    initializeCharts();
}

/**
 * Initialize charts
 */
function initializeCharts() {
    // Revenue Chart Data
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        // Simple chart implementation (dapat diganti dengan Chart.js)
        drawSimpleChart(revenueCtx, [
            { label: 'Jan', value: 35000000 },
            { label: 'Feb', value: 38000000 },
            { label: 'Mar', value: 42000000 },
            { label: 'Apr', value: 39000000 },
            { label: 'May', value: 45000000 },
            { label: 'Jun', value: 52000000 }
        ]);
    }

    // User Chart Data
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        drawPieChart(userCtx, [
            { label: 'Active', value: 70, color: '#10b981' },
            { label: 'Inactive', value: 20, color: '#ef4444' },
            { label: 'Pending', value: 10, color: '#f59e0b' }
        ]);
    }
}

/**
 * Draw simple bar chart
 */
function drawSimpleChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);

    // Find max value
    const maxValue = Math.max(...data.map(d => d.value));

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw bars
    const barWidth = chartWidth / data.length;
    data.forEach((item, index) => {
        const x = padding + index * barWidth + 10;
        const barHeight = (item.value / maxValue) * chartHeight;
        const y = height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(x, y, barWidth - 20, barHeight);

        // Draw label
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + (barWidth - 20) / 2, height - 15);
    });

    // Draw axes
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
}

/**
 * Draw pie chart
 */
function drawPieChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -Math.PI / 2;
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;

        // Draw slice
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius / 1.5);
        const labelY = centerY + Math.sin(labelAngle) * (radius / 1.5);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.value + '%', labelX, labelY);

        currentAngle += sliceAngle;
    });

    // Draw legend
    let legendY = height - 60;
    data.forEach((item, index) => {
        ctx.fillStyle = item.color;
        ctx.fillRect(20, legendY, 12, 12);
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, 40, legendY + 10);
        legendY -= 25;
    });
}

/**
 * Load users list
 */
function loadUsersList() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    usersList.innerHTML = dummyData.users.map(user => `
        <tr>
            <td>#${String(user.id).padStart(3, '0')}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.joinDate}</td>
            <td><span class="badge ${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</span></td>
            <td>
                <button class="btn-action" title="Edit" onclick="editUser(${user.id})">✏️</button>
                <button class="btn-action" title="Delete" onclick="deleteUser(${user.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Open add user modal
 */
function openAddUserModal() {
    app.showModal('addUserModal');
}

/**
 * Close add user modal
 */
function closeAddUserModal() {
    app.hideModal('addUserModal');
    document.getElementById('addUserForm').reset();
}

/**
 * Handle add user form submission
 */
document.addEventListener('DOMContentLoaded', () => {
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(addUserForm);
            const userData = Object.fromEntries(formData);

            try {
                // Simulate API call
                console.log('Adding user:', userData);
                app.showNotification('User added successfully!', 'success');
                
                closeAddUserModal();
                loadUsersList();
            } catch (error) {
                app.showNotification('Failed to add user', 'error');
            }
        });
    }
});

/**
 * Edit user
 */
function editUser(userId) {
    const user = dummyData.users.find(u => u.id === userId);
    if (user) {
        app.showNotification(`Editing user: ${user.name}`, 'info');
        console.log('Edit user:', user);
    }
}

/**
 * Delete user
 */
function deleteUser(userId) {
    if (confirm('Are you sure want to delete this user?')) {
        const user = dummyData.users.find(u => u.id === userId);
        if (user) {
            dummyData.users = dummyData.users.filter(u => u.id !== userId);
            app.showNotification('User deleted successfully!', 'success');
            loadUsersList();
        }
    }
}

/**
 * Logout
 */
function logout() {
    if (confirm('Are you sure want to logout?')) {
        app.storage.clear();
        app.session.clear();
        app.showNotification('Logged out successfully', 'success');
        // Redirect to login (dalam aplikasi real, redirect ke halaman login)
        setTimeout(() => {
            console.log('Redirecting to login...');
        }, 1000);
    }
}

/**
 * Setup modal handlers
 */
function setupModalHandlers() {
    // Close modal when clicking close button
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Handle responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const nav = document.querySelector('.sidebar-nav');
        if (nav) {
            nav.classList.remove('active');
        }
    }
});

// Initialize app
console.log('📊 Admin Panel Ready');
