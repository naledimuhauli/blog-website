const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware

const app = express();

// Enable CORS for all routes
app.use(cors());

// To parse JSON data from the frontend
app.use(express.json());

// Path to the JSON file where blog posts will be stored
const postsFilePath = path.join(__dirname, 'posts.json');

// Read posts from the JSON file with error handling
function getPosts() {
    try {
        const postsData = fs.readFileSync(postsFilePath, 'utf-8');
        return JSON.parse(postsData);
    } catch (error) {
        console.error('Error reading posts file:', error);
        return []; // Return an empty array if there's an error
    }
}

// Write posts to the JSON file with error handling
function savePosts(posts) {
    try {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to posts file:', error);
    }
}

// Route to fetch all blog posts
app.get('/api/posts', (req, res) => {
    const posts = getPosts();
    res.json(posts);
});

// Route to get a specific post by id
app.get('/api/posts/:id', (req, res) => {
    const posts = getPosts();
    const post = posts.find((p) => p.id === req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to create a new post
app.post('/api/posts', (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: String(posts.length + 1),  // Create a new id based on the length
        title: req.body.title,
        content: req.body.content,
    };
    posts.push(newPost);
    savePosts(posts);
    res.status(201).json(newPost);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
