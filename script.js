document.addEventListener('DOMContentLoaded', function() {
    
    // Page Containers
    const loginPage = document.getElementById('login-page');
    const appPage = document.getElementById('app-page');
    
    // Forms and Buttons
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const withdrawForm = document.getElementById('withdraw-form');

    // Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Data Display
    const balanceElements = document.querySelectorAll('.points');
    const historyTable = document.querySelector('.history-table');
    
    // --- SIMULATED BACKEND DATA ---
    let currentUser = {
        balance: 1250,
        name: "Test User",
        history: []
    };

    // --- FUNCTIONS ---

    // Update the point balance everywhere on the page
    function updateBalanceDisplay() {
        balanceElements.forEach(el => {
            el.textContent = `${currentUser.balance} Points`;
        });
    }

    // Update the withdrawal history display
    function updateHistoryDisplay() {
        if (currentUser.history.length === 0) {
            historyTable.innerHTML = '<p>No withdrawal history yet.</p>';
            return;
        }

        historyTable.innerHTML = ''; // Clear previous history
        currentUser.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <p>${item.amount} Points to ${item.method} <span class="status pending">Pending</span></p>
                <small>${new Date().toLocaleDateString()}</small>
            `;
            historyTable.appendChild(historyItem);
        });
    }

    // Show a specific page (login or app)
    function showPage(pageId) {
        document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    // Handle user login
    function handleLogin(e) {
        e.preventDefault();
        // In a real app, you would verify credentials here
        showPage('app-page');
        updateBalanceDisplay();
        updateHistoryDisplay();
    }
    
    // Handle user logout
    function handleLogout() {
        showPage('login-page');
        // Optionally reset form fields
        loginForm.reset();
    }

    // Handle sidebar menu navigation
    function handleNavigation(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);

        menuItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        e.currentTarget.classList.add('active');
        document.getElementById(targetId).classList.add('active');
    }
    
    // Handle tab switching in the withdraw section
    function handleTabSwitch(e) {
        const targetTab = e.currentTarget.dataset.tab;

        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        e.currentTarget.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    // Handle withdrawal request submission
    function handleWithdrawal(e) {
        e.preventDefault();
        const minPayout = 1000;

        if (currentUser.balance < minPayout) {
            alert(`Sorry, you need at least ${minPayout} points to withdraw.`);
            return;
        }

        const method = document.getElementById('payment-method').value;
        const details = document.getElementById('payment-details').value;

        if (!details.trim()) {
            alert('Please provide your account details (email or number).');
            return;
        }
        
        const amountToWithdraw = currentUser.balance;
        
        // Add to history
        currentUser.history.push({ amount: amountToWithdraw, method: method });
        
        // Update balance
        currentUser.balance = 0;

        // Update UI
        updateBalanceDisplay();
        updateHistoryDisplay();
        
        withdrawForm.reset();
        
        alert(`Your request to withdraw ${amountToWithdraw} points via ${method} has been submitted!`);
    }


    // --- EVENT LISTENERS ---
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    withdrawForm.addEventListener('submit', handleWithdrawal);

    menuItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    tabLinks.forEach(link => {
        link.addEventListener('click', handleTabSwitch);
    });

});
