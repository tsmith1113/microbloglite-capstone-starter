"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "landing.html";
    }

    // Function to fetch and display profile information
    function fetchProfile() {
        const loginData = getLoginData();

        fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${loginData.username}`, {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
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
            logout(); // Ensure logout function is correctly implemented
        });
    }
});
