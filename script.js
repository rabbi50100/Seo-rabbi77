document.addEventListener('DOMContentLoaded', () => {
    // --- FIREBASE CONFIGURATION ---
    const firebaseConfig = {
      apiKey: "AIzaSyD-tlrPK8s9h87PVqtvprBy_phcCqONLeU",
      authDomain: "my-movie-81a4b.firebaseapp.com",
      databaseURL: "https://my-movie-81a4b-default-rtdb.firebaseio.com",
      projectId: "my-movie-81a4b",
      storageBucket: "my-movie-81a4b.appspot.com", // Corrected this line
      messagingSenderId: "249876555391",
      appId: "1:249876555391:web:81f3ad52805b0aa314c14a"
    };

    // --- INITIALIZE FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();

    // --- DOM ELEMENTS ---
    const loader = document.getElementById('loader');
    const authPage = document.getElementById('auth-page');
    const appPage = document.getElementById('app-page');
    const mainContent = document.querySelector('.main-content');

    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');

    // App Elements
    const logoutBtn = document.getElementById('logout-btn');
    const userEmailDisplay = document.getElementById('user-email');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuToggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // --- STATE ---
    let currentUser = null;
    let userData = null;

    // --- FUNCTIONS ---

    const showLoader = (show) => {
        loader.style.visibility = show ? 'visible' : 'hidden';
        loader.style.opacity = show ? '1' : '0';
    };

    const toggleAuthForms = () => {
        loginForm.classList.toggle('active');
        signupForm.classList.toggle('active');
        loginError.textContent = '';
        signupError.textContent = '';
    };
    
    // --- AUTHENTICATION ---
    
    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
        showLoader(true);
        if (user) {
            currentUser = user;
            userEmailDisplay.textContent = user.email;
            fetchUserData(user.uid);
            authPage.classList.remove('active');
            appPage.classList.add('active');
        } else {
            currentUser = null;
            userData = null;
            authPage.classList.add('active');
            appPage.classList.remove('active');
            showLoader(false);
        }
    });

    // Handle Sign Up
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        showLoader(true);
        const email = signupEmailInput.value;
        const password = signupPasswordInput.value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Create user profile in database
                const newUserRef = db.ref('users/' + userCredential.user.uid);
                newUserRef.set({
                    email: userCredential.user.email,
                    balance: 0,
                    isAdmin: false, // Default user is not an admin
                    createdAt: new Date().toISOString()
                });
            })
            .catch(error => {
                signupError.textContent = error.message;
                showLoader(false);
            });
    });

    // Handle Log In
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        showLoader(true);
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                loginError.textContent = error.message;
                showLoader(false);
            });
    });

    // Handle Google Login
    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                // Check if user is new
                if(result.additionalUserInfo.isNewUser) {
                    const newUserRef = db.ref('users/' + result.user.uid);
                    newUserRef.set({
                        email: result.user.email,
                        balance: 0,
                        isAdmin: false,
                        createdAt: new Date().toISOString()
                    });
                }
            })
            .catch(error => alert(error.message));
    });

    // Handle Logout
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });

    // --- DATABASE & APP LOGIC ---

    const fetchUserData = (uid) => {
        const userRef = db.ref('users/' + uid);
        userRef.on('value', snapshot => {
            userData = snapshot.val();
            if (userData) {
                // Show/Hide Admin Panel Link
                const adminPanelLink = document.querySelector('.admin-only');
                if (userData.isAdmin) {
                    adminPanelLink.style.display = 'flex';
                } else {
                    adminPanelLink.style.display = 'none';
                }
                renderPage('dashboard'); // Render initial page
            }
            showLoader(false);
        });
    };

    const renderPage = (pageId) => {
        mainContent.innerHTML = ''; // Clear content
        let contentHTML = '';

        // Update active menu item
        menuItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${pageId}`);
        });

        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        switch(pageId) {
            case 'dashboard':
                contentHTML = `
                    <section id="dashboard" class="content-section active">
                        <h1>Dashboard</h1>
                        <div class="card balance-card">
                            <h3>Your Balance</h3>
                            <p>You have <span class="points">${userData?.balance || 0} Points</span> available.</p>
                        </div>
                    </section>`;
                break;
            case 'tasks':
                contentHTML = `
                    <section id="tasks" class="content-section active"><h1>Tasks</h1><div class="card"><p>Task system coming soon!</p></div></section>`;
                break;
            case 'withdraw':
                contentHTML = `
                    <section id="withdraw" class="content-section active"><h1>Withdraw</h1><div class="card"><p>Withdraw system coming soon!</p></div></section>`;
                break;
            case 'admin':
                if(userData?.isAdmin) {
                    contentHTML = `
                        <section id="admin" class="content-section active">
                            <h1>Admin Panel</h1>
                            <div class="tabs">
                                <button class="tab-link active" data-tab="admin-users">Users</button>
                                <button class="tab-link" data-tab="admin-withdrawals">Withdrawals</button>
                            </div>
                            <div id="admin-users" class="tab-content active">
                                <div class="card"><div class="table-container"><table class="admin-table" id="users-table"></table></div></div>
                            </div>
                            <div id="admin-withdrawals" class="tab-content">
                                <div class="card"><p>Withdrawal management coming soon.</p></div>
                            </div>
                        </section>`;
                    loadAdminUsers();
                } else {
                    contentHTML = `<h1>Access Denied</h1>`;
                }
                break;
        }
        mainContent.innerHTML = contentHTML;
    };
    
    // --- ADMIN PANEL FUNCTIONS ---
    
    const loadAdminUsers = () => {
        const usersRef = db.ref('users');
        usersRef.once('value', snapshot => {
            const users = snapshot.val();
            const table = document.getElementById('users-table');
            let tableHTML = `<tr><th>Email</th><th>Balance</th><th>Admin</th><th>Actions</th></tr>`;
            if (users) {
                for (const uid in users) {
                    const user = users[uid];
                    tableHTML += `
                        <tr>
                            <td>${user.email}</td>
                            <td>${user.balance}</td>
                            <td>${user.isAdmin ? 'Yes' : 'No'}</td>
                            <td><button class="btn-sm btn-danger">Ban</button></td>
                        </tr>`;
                }
            }
            table.innerHTML = tableHTML;
        });
    };

    // --- EVENT LISTENERS ---
    showSignupBtn.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms(); });
    showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms(); });
    
    menuToggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.getAttribute('href').substring(1);
            renderPage(pageId);
        });
    });

    // Dynamic event listener for tabs inside mainContent
    mainContent.addEventListener('click', (e) => {
        if (e.target.matches('.tab-link')) {
            const targetTab = e.target.dataset.tab;
            mainContent.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
            mainContent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            e.target.classList.add('active');
            mainContent.querySelector(`#${targetTab}`).classList.add('active');
        }
    });
});
