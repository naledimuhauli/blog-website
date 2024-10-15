const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');


const app = express();// Initializes an Express application
app.use(cors()); // Enables CORS for all routes so that the frontend can communicate with the backend from a different domain
app.use(express.json()); // This middleware parses incoming JSON requests, allowing the app to process JSON data sent from the frontend

// MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Naledim.130305',
    database: 'blog_website',
});

// Route to fetch all blog posts from MySQL
app.get('/api/posts', (req, res) => {
    const query = 'SELECT * FROM posts'; // SQL query to fetch all posts
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
        res.json(results); // Responds with all the posts
    });
});

// Route to get a specific post by id from MySQL
app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT * FROM posts WHERE id = ?'; // SQL query to fetch a specific post by id
    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error('Error fetching post:', err);
            return res.status(500).json({ error: 'Failed to fetch post' });
        }
        if (result.length > 0) {
            res.json(result[0]); // If post is found, return it
        } else {
            res.status(404).json({ message: 'Post not found' }); // If post not found, return a 404 response
        }
    });
});

// Route to create a new post in MySQL
app.post('/api/posts', (req, res) => {
    const { title, content, image, description } = req.body;
    const query = 'INSERT INTO posts (title, content, image, description) VALUES (?, ?, ?, ?)'; // SQL query to insert a new post
    db.query(query, [title, content, image, description], (err, result) => {
        if (err) {
            console.error('Error creating post:', err);
            return res.status(500).json({ error: 'Failed to create post' });
        }
        const newPost = { id: result.insertId, title, content, image, description }; // Respond with the created post
        res.status(201).json(newPost);
    });
});

// Route to delete a post by id from MySQL
app.delete('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'DELETE FROM posts WHERE id = ?'; // SQL query to delete a post by id
    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error('Error deleting post:', err);
            return res.status(500).json({ error: 'Failed to delete post' });
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    });
});

// Route to add a comment to a post in MySQL
app.post('/api/posts/:postId/comments', (req, res) => {
    const { postId } = req.params; // Get postId from the URL
    const { username, comment } = req.body; // Get username and comment from the request body

    // Validate that both username and comment are provided
    if (!username || !comment) {
        return res.status(400).json({ message: 'Username and comment are required.' });
    }

    // SQL query to insert a comment
    const query = 'INSERT INTO comments (post_id, username, comment, date) VALUES (?, ?, ?, NOW())';
    // Use NOW() to let the database handle the current timestamp

    // Execute the query and pass the postId, username, and comment
    db.query(query, [postId, username, comment], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500).json({ error: 'Failed to add comment' });
        }

        // Respond with the newly created comment, including the auto-generated id
        let date = new Date();
        let formattedDate = date.toLocaleString();
        const newComment = { id: result.insertId, post_id: postId, username, comment, date: formattedDate };
        res.status(201).json(newComment);
    });
});

// Route to delete a comment by index from MySQL
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;

    const query = 'DELETE FROM comments WHERE id = ? AND post_id = ?'; // SQL query to delete a comment by id and postId
    db.query(query, [commentId, postId], (err, result) => {
        if (err) {
            console.error('Error deleting comment:', err);
            return res.status(500).json({ error: 'Failed to delete comment' });
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    });
});

// Start the server on port 5001
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
