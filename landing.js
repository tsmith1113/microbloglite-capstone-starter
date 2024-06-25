/* Landing Page JavaScript */

"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

// Function to get the login data of the logged-in user
"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const loginData = { username, password };

            // Process the login using the function from auth.js
            login(loginData);
        });
    }
});