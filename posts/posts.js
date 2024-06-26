"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "landing.html";
        return; // Stop further execution
    }

    // Function to fetch and display posts
    function fetchPosts() {
        fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(posts => {
                const postsContainer = document.getElementById('posts');
                postsContainer.innerHTML = ''; // Clear existing posts
                posts.forEach(post => {
                    const postElement = createPostElement(post);
                    postsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    // Function to create a DOM element for a post
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
            <p>${post.content}</p>
            <p>Author: ${post.author}</p>
            <p>Timestamp: ${new Date(post.timestamp).toLocaleString()}</p>
        `;
        return postElement;
    }

    // Fetch posts when the page loads
    fetchPosts();

    // Event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', logout);

    // Event listener for post form submission
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const postContent = document.getElementById('postContent').value;
            const loginData = getLoginData();

            fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                },
                body: JSON.stringify({ content: postContent }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create post');
                }
                return response.json();
            })
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

    // Function to get all users via fetch
    function getAllUsers() {
        const loginData = getLoginData();
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${loginData.token}`,
            },
        };

        fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/users', options)
            .then(response => response.json())
            .then(users => {
                console.log('Users:', users);
                // Do something with the users array if needed
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    // Call function to get all users
    getAllUsers();
});

