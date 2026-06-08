/**
 * AdminPanel Framework
 * Lightweight frontend framework untuk panel admin
 */

class AdminPanelFramework {
    constructor(options = {}) {
        this.options = {
            animationDuration: 300,
            apiBaseUrl: options.apiBaseUrl || '/api/v1',
            ...options
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupUserMenu();
        this.setupSidebarToggle();
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                this.navigateTo(href.substring(1));
            });
        });

        // Modal close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Click outside modal
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    /**
     * Setup navigation system
     */
    setupNavigation() {
        this.currentPage = 'dashboard';
    }

    /**
     * Navigate to page
     */
    navigateTo(page) {
        // Remove active from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Remove active from all pages
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Add active to current nav item
        const activeNav = document.querySelector(`a[href="#${page}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        // Add active to current page
        const activePage = document.getElementById(page);
        if (activePage) {
            activePage.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titleMap = {
                dashboard: 'Dashboard',
                users: 'Manajemen Users',
                analytics: 'Analytics',
                settings: 'Settings'
            };
            pageTitle.textContent = titleMap[page] || page;
        }

        this.currentPage = page;

        // Close sidebar on mobile
        this.closeSidebarMobile();
    }

    /**
     * Setup user menu dropdown
     */
    setupUserMenu() {
        const userBtn = document.getElementById('userBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (userBtn && dropdownMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu')) {
                    dropdownMenu.classList.remove('active');
                }
            });
        }
    }

    /**
     * Setup sidebar toggle for mobile
     */
    setupSidebarToggle() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');

        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                const nav = document.querySelector('.sidebar-nav');
                if (nav) {
                    nav.classList.toggle('active');
                }
            });
        }
    }

    /**
     * Close sidebar on mobile
     */
    closeSidebarMobile() {
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('.sidebar-nav');
            if (nav) {
                nav.classList.remove('active');
            }
        }
    }

    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * Hide modal
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    /**
     * Make API request
     */
    async request(method, endpoint, data = null) {
        const url = `${this.options.apiBaseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Request error:', error);
            this.showNotification('Error: ' + error.message, 'error');
            throw error;
        }
    }

    /**
     * GET request
     */
    get(endpoint) {
        return this.request('GET', endpoint);
    }

    /**
     * POST request
     */
    post(endpoint, data) {
        return this.request('POST', endpoint, data);
    }

    /**
     * PUT request
     */
    put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    }

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request('DELETE', endpoint);
    }

    /**
     * Get token from localStorage
     */
    getToken() {
        return localStorage.getItem('token') || '';
    }

    /**
     * Set token to localStorage
     */
    setToken(token) {
        localStorage.setItem('token', token);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create notification element if needed
        let notificationContainer = document.getElementById('notificationContainer');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notificationContainer';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 5000;
                max-width: 400px;
            `;
            document.body.appendChild(notificationContainer);
        }

        const notification = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#0ea5e9'
        };

        notification.style.cssText = `
            background-color: ${colors[type] || colors.info};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 10px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Load data into table
     */
    loadTableData(tableId, data) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = Object.values(row).map(val => `<td>${val}</td>`).join('');
            tbody.appendChild(tr);
        });
    }

    /**
     * Format date
     */
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    }

    /**
     * Format currency
     */
    formatCurrency(value, currency = 'IDR') {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        });
        return formatter.format(value);
    }

    /**
     * Format number
     */
    formatNumber(value) {
        return new Intl.NumberFormat('id-ID').format(value);
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Local storage helper
     */
    storage = {
        set: (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: (key) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        remove: (key) => {
            localStorage.removeItem(key);
        },
        clear: () => {
            localStorage.clear();
        }
    };

    /**
     * Session storage helper
     */
    session = {
        set: (key, value) => {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        get: (key) => {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        remove: (key) => {
            sessionStorage.removeItem(key);
        },
        clear: () => {
            sessionStorage.clear();
        }
    };
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export framework
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanelFramework;
}
