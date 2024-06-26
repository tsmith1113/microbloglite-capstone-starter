"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in and redirect if not
    if (!isLoggedIn()) {
        window.location.href = "landing.html";
        return; // Stop further execution
    }

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
        <p>${post.text}</p>
        <p>username: ${post.username}</p>
        <p>postId: ${post.postId}</p>
        <p>Timestamp: ${formatcreatedAt(post.createdAt)}</p>
        <p>id: ${post.id}</p>
        <div class="post-actions">
            <button class="btn btn-outline-primary like-btn ${post.likedByCurrentUser ? 'liked' : ''}" data-post-id="${post.postId}">Like</button>
        </div>
    `;
    return postElement;
}


    // Function to format createdAt
    function formatcreatedAt(createdAt) {
        const date = new Date(createdAt);
        return date.toLocaleString();
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
// Event listener for delete and like buttons using event delegation
document.addEventListener('click', event => {
    if (event.target.classList.contains('like-btn')) {
        const likeButton = event.target;
        const postId = likeButton.dataset.postId;
        const isLiked = likeButton.classList.toggle('liked'); // Toggle the 'liked' class
        const loginData = getLoginData();

        const options = {
            method: isLiked ? 'POST' : 'DELETE',
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            },
        };

        fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/like/${postId}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${isLiked ? 'Like' : 'Unlike'} action failed`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Post ${isLiked ? 'liked' : 'unliked'} successfully:`, data);
            // Optionally, update the 'likedByCurrentUser' status of the post in your data
            // Example: post.likedByCurrentUser = isLiked;
            fetchPosts(); // Refresh the list of posts
        })
        .catch(error => {
            console.error(`Error ${isLiked ? 'liking' : 'unliking'} post:`, error);
            // Optionally, revert the 'liked' class toggle if there's an error
            // Example: likeButton.classList.toggle('liked');
        });
    }
});

    // Event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
            window.location.href = "landing.html"; // Redirect to landing page after logout
        });
    }
});
