"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "/landing.html";
        return; // Stop further execution
    }
       
    // Event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton){
        logoutButton.addEventListener('click', () => {
            logout();
        })
    }
});
