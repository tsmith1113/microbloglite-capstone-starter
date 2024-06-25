/* Posts Page JavaScript */

"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }

    // Function to fetch and display posts
    function fetchPosts() {
        fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts')
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

    // Fetch posts when the page loads
    fetchPosts();

    // Event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }

    // Event listener for post form submission
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', (event) => {
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
    }
});
