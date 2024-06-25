"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }

    // Function to fetch and display profile information
    function fetchProfile() {
        const loginData = loginData();

        fetch(`${apiBaseURL}/api/users/${loginData.username}`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        })
        .then(response => response.json())
        .then(user => {
            const profileContainer = document.getElementById('profileInfo');
            profileContainer.innerHTML = `
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    }

    // Fetch profile information when the page loads
    fetchProfile();

    // Event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }
});
