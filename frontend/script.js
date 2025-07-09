// Configuración de la API
const API_BASE_URL = 'http://40.90.234.134:80';
const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    BOOKS: '/api/libros',
    ADD_BOOK: '/api/libros/agregar',
    UPDATE_BOOK: '/api/libros/actualizar',
    DELETE_BOOK: '/api/libros/eliminar'
};

// Estado global de la aplicación
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Elementos del DOM
const elements = {
    // Auth elements
    authSection: document.getElementById('authSection'),
    booksSection: document.getElementById('booksSection'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginFormElement: document.getElementById('loginFormElement'),
    registerFormElement: document.getElementById('registerFormElement'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    
    // Navigation
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Books section
    addBookBtn: document.getElementById('addBookBtn'),
    addBookModal: document.getElementById('addBookModal'),
    addBookForm: document.getElementById('addBookForm'),
    closeModal: document.getElementById('closeModal'),
    cancelAdd: document.getElementById('cancelAdd'),
    booksGrid: document.getElementById('booksGrid'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    addFirstBook: document.getElementById('addFirstBook'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// Utilidades
const utils = {
    showToast: (title, message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    },

    showLoading: () => {
        elements.loadingState.classList.remove('hidden');
        elements.booksGrid.classList.add('hidden');
        elements.emptyState.classList.add('hidden');
    },

    hideLoading: () => {
        elements.loadingState.classList.add('hidden');
        elements.booksGrid.classList.remove('hidden');
    },

    showEmptyState: () => {
        elements.emptyState.classList.remove('hidden');
        elements.booksGrid.classList.add('hidden');
        elements.loadingState.classList.add('hidden');
    },

    hideEmptyState: () => {
        elements.emptyState.classList.add('hidden');
        elements.booksGrid.classList.remove('hidden');
    },

    toggleModal: (show = true) => {
        if (show) {
            elements.addBookModal.classList.remove('hidden');
        } else {
            elements.addBookModal.classList.add('hidden');
            elements.addBookForm.reset();
        }
    },

    updateAuthUI: () => {
        if (authToken) {
            elements.authSection.classList.add('hidden');
            elements.booksSection.classList.remove('hidden');
            elements.loginBtn.classList.add('hidden');
            elements.registerBtn.classList.add('hidden');
            elements.logoutBtn.classList.remove('hidden');
            
            // Mostrar información del usuario
            const userInfo = document.getElementById('userInfo');
            const userRole = document.getElementById('userRole');
            if (currentUser) {
                userInfo.classList.remove('hidden');
                userRole.textContent = currentUser.role === 'admin' ? 'Administrador' : 'Usuario';
                userRole.className = `user-role ${currentUser.role}`;
            }
            
            loadBooks();
        } else {
            elements.authSection.classList.remove('hidden');
            elements.booksSection.classList.add('hidden');
            elements.loginBtn.classList.remove('hidden');
            elements.registerBtn.classList.remove('hidden');
            elements.logoutBtn.classList.add('hidden');
            
            // Ocultar información del usuario
            const userInfo = document.getElementById('userInfo');
            userInfo.classList.add('hidden');
        }
    }
};

// API functions
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en la solicitud');
            }
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Error de conexión');
        }
    },

    async login(username, password) {
        return await this.request(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async register(username, password) {
        return await this.request(API_ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async getBooks() {
        return await this.request(API_ENDPOINTS.BOOKS, {
            method: 'GET'
        });
    },

    async addBook(bookData) {
        return await this.request(API_ENDPOINTS.ADD_BOOK, {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    },

    async updateBook(bookId, bookData) {
        return await this.request(`${API_ENDPOINTS.UPDATE_BOOK}/${bookId}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
    },

    async deleteBook(bookId) {
        return await this.request(`${API_ENDPOINTS.DELETE_BOOK}/${bookId}`, {
            method: 'DELETE'
        });
    }
};

// Auth functions
const auth = {
    async login(username, password) {
        try {
            const response = await api.login(username, password);
            authToken = response.token;
            localStorage.setItem('authToken', authToken);
            currentUser = response.user;
            utils.updateAuthUI();
            utils.showToast('Éxito', `Sesión iniciada como ${currentUser.role === 'admin' ? 'Administrador' : 'Usuario'}`);
        } catch (error) {
            utils.showToast('Error', error.message, 'error');
        }
    },

    async register(username, password) {
        try {
            await api.register(username, password);
            utils.showToast('Éxito', 'Usuario registrado correctamente. Ahora puedes iniciar sesión.');
            // Switch to login form
            auth.switchToLogin();
        } catch (error) {
            utils.showToast('Error', error.message, 'error');
        }
    },

    logout() {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        utils.updateAuthUI();
        utils.showToast('Información', 'Sesión cerrada');
    },

    switchToRegister() {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.remove('hidden');
    },

    switchToLogin() {
        elements.registerForm.classList.add('hidden');
        elements.loginForm.classList.remove('hidden');
    }
};

// Books functions
const books = {
    async loadBooks() {
        try {
            utils.showLoading();
            const books = await api.getBooks();
            
            if (books.length === 0) {
                utils.showEmptyState();
            } else {
                utils.hideEmptyState();
                this.renderBooks(books);
            }
        } catch (error) {
            utils.showToast('Error', 'Error al cargar los libros', 'error');
            utils.showEmptyState();
        }
    },

    renderBooks(books) {
        elements.booksGrid.innerHTML = books.map(book => `
            <div class="book-card" data-id="${book.id}">
                <div class="book-header">
                    <div>
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                    </div>
                    <div class="book-actions">
                        <button class="action-btn delete" onclick="books.deleteBook(${book.id})" title="Eliminar libro">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="book-details">
                    <div class="book-detail">
                        <div class="book-detail-label">Género</div>
                        <div class="book-detail-value">${book.genre || 'No especificado'}</div>
                    </div>
                    <div class="book-detail">
                        <div class="book-detail-label">Año</div>
                        <div class="book-detail-value">${book.year || 'No especificado'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    async addBook(bookData) {
        try {
            await api.addBook(bookData);
            utils.showToast('Éxito', 'Libro agregado correctamente');
            utils.toggleModal(false);
            this.loadBooks();
        } catch (error) {
            utils.showToast('Error', error.message, 'error');
        }
    },

    async deleteBook(bookId) {
        if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
            try {
                await api.deleteBook(bookId);
                utils.showToast('Éxito', 'Libro eliminado correctamente');
                this.loadBooks();
            } catch (error) {
                utils.showToast('Error', error.message, 'error');
            }
        }
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    utils.updateAuthUI();

    // Auth form events
    elements.loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        await auth.login(username, password);
    });

    elements.registerFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        await auth.register(username, password);
    });

    // Navigation events
    elements.loginBtn.addEventListener('click', () => {
        auth.switchToLogin();
    });

    elements.registerBtn.addEventListener('click', () => {
        auth.switchToRegister();
    });

    elements.logoutBtn.addEventListener('click', () => {
        auth.logout();
    });

    // Auth switch events
    elements.showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        auth.switchToRegister();
    });

    elements.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        auth.switchToLogin();
    });

    // Book form events
    elements.addBookBtn.addEventListener('click', () => {
        utils.toggleModal(true);
    });

    elements.addFirstBook.addEventListener('click', () => {
        utils.toggleModal(true);
    });

    elements.closeModal.addEventListener('click', () => {
        utils.toggleModal(false);
    });

    elements.cancelAdd.addEventListener('click', () => {
        utils.toggleModal(false);
    });

    elements.addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookData = {
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            genre: document.getElementById('bookGenre').value,
            year: document.getElementById('bookYear').value ? parseInt(document.getElementById('bookYear').value) : null
        };
        await books.addBook(bookData);
    });

    // Close modal when clicking outside
    elements.addBookModal.addEventListener('click', (e) => {
        if (e.target === elements.addBookModal) {
            utils.toggleModal(false);
        }
    });
});

// Global functions for onclick handlers
window.loadBooks = () => books.loadBooks();
window.books = books; 