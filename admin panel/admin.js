const authTabs = document.querySelectorAll('.auth-tab');
const createForm = document.getElementById('createForm');
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');
const authContainer = document.querySelector('.auth-container');

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'create') {
            createForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        } else {
            createForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    });
});

document.getElementById('createBtn').addEventListener('click', async () => {
    const username = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;
    const keycode = document.getElementById('createKeycode').value;
    
    if (!username || !password || !keycode) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('/api/create-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, keycode })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Account created successfully!');
            document.getElementById('createUsername').value = '';
            document.getElementById('createPassword').value = '';
            document.getElementById('createKeycode').value = '';
        } else {
            alert(data.message || 'Failed to create account');
        }
    } catch (error) {
        alert('Error creating account');
    }
});

document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            showAdminDashboard();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error logging in');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    location.reload();
});

function showAdminDashboard() {
    authContainer.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadFeedbacks();
}

async function loadFeedbacks() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/feedbacks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        const feedbackList = document.getElementById('feedbackList');
        
        if (data.feedbacks && data.feedbacks.length > 0) {
            feedbackList.innerHTML = data.feedbacks.map(fb => `
                <div class="feedback-item">
                    <h3>${fb.category}</h3>
                    <p>${fb.message}</p>
                    <div class="meta">${new Date(fb.date).toLocaleString()}</div>
                </div>
            `).join('');
        } else {
            feedbackList.innerHTML = '<p>No feedbacks yet</p>';
        }
    } catch (error) {
        console.error('Error loading feedbacks');
    }
}

window.addEventListener('load', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        showAdminDashboard();
    }
});