"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "landing.html";
        return; // Stop further execution
    }

    let posts = [];

    // Function to fetch and display posts
    function fetchPosts() {
        const loginData = getLoginData();
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${loginData.token}`
            }
        };

        fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(data => {
                posts = data;
                displayPosts();
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    // Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Clear existing posts

    const sortOption = document.getElementById('sortPosts').value;
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOption === 'time') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOption === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortOption === 'username') {
            return a.username.localeCompare(b.username);
        }
    });

    sortedPosts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}


    // Function to create a DOM element for a post
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.classList.add('post-card', 'list-group-item'); // Add post-card class
        postElement.innerHTML = `
            <p> ${post.username}</p> 
            <p> ${post.text}</p>
            <p> ${formatCreatedAt(post.createdAt)}</p>
            <div class="icons">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart heart-icon" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat comment-icon" viewBox="0 0 16 16">
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                </svg>
            </div>
            <div class="comments-section" style="display: none;">
                <form class="comment-form">
                    <div class="mb-3">
                        <textarea class="form-control comment-content" rows="2" placeholder="Add a comment" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm">Comment</button>
                </form>
                <div class="comments-list">
                    ${post.comments ? post.comments.map(comment => `
                        <div class="comment">
                            <p><strong>${comment.username}:</strong> ${comment.text}</p>
                            <p class="timestamp">${formatCreatedAt(comment.createdAt)}</p>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        `;

        // Add event listener to toggle heart color
        const heartIcon = postElement.querySelector('.heart-icon');
        heartIcon.addEventListener('click', function() {
            if (heartIcon.getAttribute('fill') === 'currentColor') {
                heartIcon.setAttribute('fill', 'red');
            } else {
                heartIcon.setAttribute('fill', 'currentColor');
            }
        });

        // Add event listener to show/hide comment form
        const commentIcon = postElement.querySelector('.comment-icon');
        commentIcon.addEventListener('click', function() {
            const commentsSection = postElement.querySelector('.comments-section');
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });

        // Add event listener for comment form submission
        const commentForm = postElement.querySelector('.comment-form');
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const commentContent = postElement.querySelector('.comment-content').value;
            const loginData = getLoginData();

            fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                },
                body: JSON.stringify({ text: commentContent }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create comment');
                }
                return response.json();
            })
            .then(data => {
                console.log('Comment created:', data);
                postElement.querySelector('.comment-content').value = '';
                // Append new comment to the comments list
                const commentsList = postElement.querySelector('.comments-list');
                const newComment = document.createElement('div');
                newComment.classList.add('comment');
                newComment.innerHTML = `
                    <p><strong>${data.username}:</strong> ${data.text}</p>
                    <p class="timestamp">${formatCreatedAt(data.createdAt)}</p>
                `;
                commentsList.appendChild(newComment);
            })
            .catch(error => {
                console.error('Error creating comment:', error);
            });
        });

        return postElement;
    }

    // Function to format createdAt
    function formatCreatedAt(createdAt) {
        const now = new Date();
        const postDate = new Date(createdAt);
        const secondsAgo = Math.floor((now - postDate) / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(minutesAgo / 60);
        const daysAgo = Math.floor(hoursAgo / 24);

        if (daysAgo > 0) {
            return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        } else if (hoursAgo > 0) {
            return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        } else if (minutesAgo > 0) {
            return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
        } else {
            return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
        }
    }

    // Fetch posts when the page loads
    fetchPosts();

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
                body: JSON.stringify({ text: postContent }),
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

    // Event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }

    // Event listener for sorting posts
    const sortPostsSelect = document.getElementById('sortPosts');
    sortPostsSelect.addEventListener('change', displayPosts);
});


