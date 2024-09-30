const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON data from the frontend
app.use(express.json());

// Path to the JSON file where blog posts will be stored
const postsFilePath = path.join(__dirname, 'posts.json');

// Function to read posts from the JSON file with error handling
function getPosts() {
    try {
        // Read the posts.json file and return the parsed data
        const postsData = fs.readFileSync(postsFilePath, 'utf-8');
        return JSON.parse(postsData);
    } catch (error) {
        console.error('Error reading posts file:', error);
        // Return an empty array if there's an error
        return [];
    }
}

// Function to write posts to the JSON file with error handling
function savePosts(posts) {
    try {
        // Write the posts array to posts.json, with indentation for readability
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to posts file:', error);
    }
}

// Route to fetch all blog posts
app.get('/api/posts', (req, res) => {
    // Fetch all posts and send them as JSON
    const posts = getPosts();
    res.json(posts);
});

// Route to get a specific post by id
app.get('/api/posts/:id', (req, res) => {
    // Fetch all posts
    const posts = getPosts();
    // Find the post with the requested id
    const post = posts.find((p) => p.id === req.params.id);
    // If found, return the post, otherwise send a 404 error
    if (post) {
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to create a new post
app.post('/api/posts', (req, res) => {
    // Fetch all posts
    const posts = getPosts();
    // Create a new post object
    const newPost = {
        id: String(posts.length + 1),  // Create a new id based on the number of posts
        title: req.body.title,          // Title sent from the frontend
        content: req.body.content,      // Content sent from the frontend
        image: req.body.image,          // Image sent from the frontend (optional)
        description: req.body.description // Description sent from the frontend (optional)
    };
    // Add the new post to the posts array
    posts.push(newPost);
    // Save the updated posts array back to the file
    savePosts(posts);
    // Respond with the new post and 201 (Created) status
    res.status(201).json(newPost);
});

// Route to delete a post by id
app.delete('/api/posts/:id', (req, res) => {
    // Fetch all posts
    let posts = getPosts();
    // Find the index of the post to delete
    const postIndex = posts.findIndex((p) => p.id === req.params.id);

    // If the post is found, delete it from the array
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);  // Remove the post
        savePosts(posts);            // Save the updated posts list
        // Respond with success message
        res.status(200).json({ message: 'Post deleted successfully' });
    } else {
        // If the post is not found, respond with a 404 error
        res.status(404).json({ message: 'Post not found' });
    }
});

// Route to add a comment to a post
app.post('/api/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;  // Get the postId from the URL params
    const { username, comment } = req.body;  // Get username and comment from the request body

    // Check if both username and comment are provided
    if (!username || !comment) {
        return res.status(400).json({ message: 'Username and comment are required.' });
    }

    // Fetch all posts
    const posts = getPosts();
    // Find the post with the provided postId
    const post = posts.find((p) => p.id === postId);

    // Check if the post exists
    if (post) {
        // Initialize the comments array if it doesn't exist
        if (!post.comments) {
            post.comments = [];
        }

        // Create a new comment object with the current date
        const newComment = {
            username,  // Username from request body
            comment,   // Comment from request body
            date: new Date().toLocaleString(),  // Current date and time
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);
        // Save the updated posts array back to the file
        savePosts(posts);
        // Respond with the newly added comment
        res.status(201).json(newComment);
    } else {
        // If the post is not found, respond with a 404 error
        res.status(404).json({ message: 'Post not found.' });
    }
});

// Route to delete a comment from a post
app.delete('/api/posts/:postId/comments/:commentIndex', (req, res) => {
    const { postId, commentIndex } = req.params;  // Get postId and commentIndex from the URL params
    // Fetch all posts
    const posts = getPosts();

    // Find the post by its id
    const post = posts.find((p) => p.id === postId);
    if (!post) {
        // If the post is not found, respond with a 404 error
        return res.status(404).send('Post not found');
    }

    // Check if the comment exists in the comments array
    if (post.comments[commentIndex]) {
        // Remove the comment from the array using splice
        post.comments.splice(commentIndex, 1);  // Remove the comment by index
        savePosts(posts);  // Save the updated posts array
        // Respond with success message
        res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
        // If the comment is not found, respond with a 404 error
        res.status(404).json({ message: 'Comment not found' });
    }
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
