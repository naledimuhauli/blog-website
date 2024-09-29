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
        image: req.body.image,         // If you need to handle an image
        description: req.body.description // For description handling
    };
    posts.push(newPost);
    savePosts(posts);
    res.status(201).json(newPost);
});

// Route to delete a post by id
app.delete('/api/posts/:id', (req, res) => {
    let posts = getPosts();
    const postIndex = posts.findIndex((p) => p.id === req.params.id);

    if (postIndex !== -1) {
        posts.splice(postIndex, 1);  // Remove the post
        savePosts(posts);            // Save the updated posts list
        res.status(200).json({ message: 'Post deleted successfully' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Route to add a comment to a post
app.post('/api/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { username, comment } = req.body;

    if (!username || !comment) {
        return res.status(400).json({ message: 'Username and comment are required.' });
    }

    const posts = getPosts(); // Fetch posts from your data store
    const post = posts.find((p) => p.id === postId); // Find the post by postId

    // Check if the post exists
    if (post) {
        // Initialize comments array if it doesn't exist
        if (!post.comments) {
            post.comments = [];
        }

        // Create the new comment object
        const newComment = {
            username,
            comment,
            date: new Date().toLocaleString(),
        };

        // Push the new comment into the comments array
        post.comments.push(newComment);

        // Save the updated post (depends on your data storage)
        savePosts(posts);

        // Return the newly added comment
        res.status(201).json(newComment);
    } else {
        // Return a 404 if the post was not found
        res.status(404).json({ message: 'Post not found.' });
    }
});



// Route to delete a comment from a post
app.delete('/api/posts/:postId/comments/:commentIndex', (req, res) => {
    const { postId, commentIndex } = req.params;
    const posts = getPosts();

    // Find the post by id
    const post = posts.find((p) => p.id === postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }

    // Check if the comment exists
    if (post.comments[commentIndex]) {
        post.comments.splice(commentIndex, 1); // Remove the comment by index
        savePosts(posts);  // Save the updated posts
        res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
