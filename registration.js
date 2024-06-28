"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const fullName = document.getElementById('fullName').value;
            const password = document.getElementById('password').value;

            // Prepare registration data
            const registrationData = {
                username: username,
                fullName: fullName,
                password: password
            };

            // Send registration request to backend
            fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Registration successful:', data);
                // Optionally, redirect to login page or handle success message
                window.location.href = 'landing.html';
            })
            .catch(error => {
                console.error('Error registering user:', error);
                // Display error message to user
                alert(`Registration failed: ${error.message}`);
            });
        });
    }
});
