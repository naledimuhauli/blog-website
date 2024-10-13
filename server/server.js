const express = require('express');
const cors = require('cors'); // Middleware that allows cross-origin requests
const mysql = require('mysql2'); // MySQL driver
const path = require('path'); // Required for serving static files
const app = express(); // Initialize Express app

// Middleware
app.use(cors()); // Allow frontend to communicate with backend from different domains
app.use(express.json()); // Parse incoming JSON data

// Create MySQL connection pool
const db = mysql.createPool({
    host: 'localhost', // Replace with your MySQL host
    user: 'root', // Replace with your MySQL username
    password: 'Naledim.130305', // Replace with your MySQL password
    database: 'blog_website', // Replace with your MySQL database name
});

// Serve images from the public/images directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Route to fetch all blog posts from MySQL, ordered by creation date
app.get('/api/posts', (req, res) => {
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Error fetching posts' });
        }

        // Modify results to prepend the correct image path
        const formattedResults = results.map(post => ({
            ...post,
            image: `${req.protocol}://${req.get('host')}/images/${post.image}`, // Ensure the image path is correct
        }));

        res.json(formattedResults);
    });
});

// Route to create a new post in MySQL
app.post('/api/posts', (req, res) => {
    const { title, content, description, image } = req.body;

    // Validate input
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    // Validate the image URL (Optional)
    const isValidImageUrl = (url) => {
        return /\.(jpeg|jpg|gif|png|svg)$/.test(url);
    };

    if (!isValidImageUrl(image)) {
        return res.status(400).json({ message: 'Invalid image URL' });
    }

    // MySQL query to insert the new post
    const query = 'INSERT INTO posts (title, content, description, image, created_at) VALUES (?, ?, ?, ?, NOW())';
    db.query(query, [title, content, description, image], (err, result) => {
        if (err) {
            console.error('Error inserting post:', err);
            return res.status(500).json({ message: 'Error creating post' });
        }

        // Respond with the new post's ID and timestamp
        res.status(201).json({
            id: result.insertId,
            title,
            content,
            description,
            image: `${req.protocol}://${req.get('host')}/images/${image}`, // Ensure the image path is correct
            created_at: new Date(),
        });
    });
});

// Route to fetch a specific post by its ID
app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT * FROM posts WHERE id = ?';

    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error('Error fetching post:', err);
            return res.status(500).json({ error: 'Failed to fetch post' });
        }
        if (result.length > 0) {
            // Prepend the image path
            const post = {
                ...result[0],
                image: `${req.protocol}://${req.get('host')}/images/${result[0].image}`,
            };
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    });
});

// Route to delete a post by its ID
app.delete('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'DELETE FROM posts WHERE id = ?';

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

// Route to add a comment to a post
app.post('/api/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { username, comment } = req.body;

    // Validate input
    if (!username || !comment) {
        return res.status(400).json({ message: 'Username and comment are required.' });
    }

    // Insert comment into the database
    const query = 'INSERT INTO comments (post_id, username, comment, date) VALUES (?, ?, ?, NOW())';
    db.query(query, [postId, username, comment], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500).json({ error: 'Failed to add comment' });
        }

        // Respond with the newly created comment
        const newComment = { id: result.insertId, post_id: postId, username, comment, date: new Date() };
        res.status(201).json(newComment);
    });
});

// Route to delete a comment by ID
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;
    const query = 'DELETE FROM comments WHERE id = ? AND post_id = ?';

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
