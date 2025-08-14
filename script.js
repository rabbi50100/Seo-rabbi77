document.addEventListener('DOMContentLoaded', function() {
    
    // Page Elements
    const loginPage = document.getElementById('login-page');
    const appPage = document.getElementById('app-page');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // App Navigation Elements
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Withdraw Page Elements
    const withdrawForm = document.getElementById('withdraw-form');
    const balanceElements = document.querySelectorAll('.points');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // --- DATA (Simulated Backend) ---
    let currentUser = {
        balance: 1250,
        name: "Test User"
    };

    // --- FUNCTIONS ---

    // Function to update balance display
    function updateBalanceDisplay() {
        balanceElements.forEach(el => {
            el.textContent = `${currentUser.balance} Points`;
        });
    }

    // Function to handle login
    function handleLogin(e) {
        e.preventDefault();
        // Here you would normally verify credentials with a backend
        // For this prototype, we'll just switch pages
        loginPage.classList.remove('active');
        appPage.style.display = 'flex'; // Use flex for layout
        // A slight delay to ensure the display property is set before adding the class
        setTimeout(() => appPage.classList.add('active'), 10);

        // Update initial data on login
        updateBalanceDisplay();
    }
    
    // Function to handle logout
    function handleLogout() {
        appPage.classList.remove('active');
        loginPage.classList.add('active');
        appPage.style.display = 'none';
    }

    // Function to handle sidebar navigation
    function handleNavigation(e) {
        e.preventDefault();

        // Deactivate all menu items and sections
        menuItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        // Activate clicked item and corresponding section
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        e.currentTarget.classList.add('active');
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    // Function to handle withdraw tab switching
    function handleTabSwitch(e) {
        // Deactivate all tabs and content
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Activate clicked tab and its content
        const targetTab = e.currentTarget.dataset.tab;
        e.currentTarget.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    // Function to handle withdrawal request
    function handleWithdrawal(e) {
        e.preventDefault();
        const minPayout = 1000;

        if (currentUser.balance < minPayout) {
            alert(`Sorry, you need at least ${minPayout} points to make a withdrawal.`);
            return;
        }

        const method = document.getElementById('payment-method').value;
        const details = document.getElementById('payment-details').value;

        if (!details) {
            alert('Please provide your account details.');
            return;
        }

        // Simulate request
        alert(`Withdrawal request submitted for ${currentUser.balance} points via ${method}. An admin will review it shortly.`);

        // In a real app, you would send this to the server.
        // For now, we just reset the balance.
        currentUser.balance = 0;
        updateBalanceDisplay();
        withdrawForm.reset();
    }


    // --- EVENT LISTENERS ---
    
    // Login and Logout
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Sidebar Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Withdraw Page Tabs
    tabLinks.forEach(link => {
        link.addEventListener('click', handleTabSwitch);
    });

    // Withdraw Form Submission
    withdrawForm.addEventListener('submit', handleWithdrawal);

});
