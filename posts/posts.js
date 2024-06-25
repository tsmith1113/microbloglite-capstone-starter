/* Posts Page JavaScript */

"use strict";
// Check if the user is logged in
const loggedIn = true; // Placeholder for actual check
if (!loggedIn) {
  window.location.href = "landing.html"; // Redirect to login page if not logged in
}

// Function to fetch and display posts
function fetchPosts() {
  fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts')
    .then(response => response.json())
    .then(posts => {
      const postsContainer = document.getElementById('posts');
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
          <p>${post.content}</p>
          <p>Author: ${post.author}</p>
          <p>Timestamp: ${post.timestamp}</p>
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
  logout(); // Assuming logout() function is defined elsewhere
});

// Function to handle form submission and create a new post
document.getElementById('postForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const postContent = document.getElementById('postContent').value;
  
    fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  
  // Mock logout function
  function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = "login.html";
  }