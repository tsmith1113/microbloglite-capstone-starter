"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

// Function to get the login data of the logged-in user
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

// Function to check if the visitor is logged in
function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

// Function to check if the user is logged in and redirect if not
function checkLogin() {
    if (!isLoggedIn()) {
        window.location.href = "login.html"; // Redirect to login page if not logged in
    }
}

// Call checkLogin() when the page loads
document.addEventListener('DOMContentLoaded', checkLogin);

// Function to fetch and display posts
function fetchPosts() {
    fetch(`${apiBaseURL}/api/posts`)
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = ''; // Clear existing posts
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <p>${post.content}</p>
                    <p>Author: ${post.author}</p>
                    <p>Timestamp: ${new Date(post.timestamp).toLocaleString()}</p>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

// Event listener for logout button
document.getElementById('logoutButton').addEventListener('click', () => {
    logout();
});

// Function to handle form submission and create a new post
document.getElementById('postForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const postContent = document.getElementById('postContent').value;
    const loginData = getLoginData();

    fetch(`${apiBaseURL}/api/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({ content: postContent }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post created:', data);
        document.getElementById('postContent').value = '';
        fetchPosts(); // Refresh the list of posts
    })
    .catch(error => {
        console.error('Error creating post:', error);
    });
});

// Call fetchPosts() when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);

// Function to handle logout
function logout() {
    const loginData = getLoginData();

    fetch(`${apiBaseURL}/auth/logout`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${loginData.token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .finally(() => {
        window.localStorage.removeItem('login-data'); // Remove login data from LocalStorage
        window.location.assign('/'); // Redirect back to landing page
    });
}
