const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // To parse incoming JSON data

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//Retrieving all posts 
app.get('/posts', (req, res) => {
    fs.readFile('./posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading posts.' });
        res.json(JSON.parse(data));
    });
});


//add new posts 
app.post('/posts', (req, res) => {
    const newPost = req.body;
    fs.readFile('./posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading posts.' });

        const posts = JSON.parse(data);
        posts.push(newPost);

        fs.writeFile('./posts.json', JSON.stringify(posts), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving the post.' });
            res.status(201).json(newPost);
        });
    });
});

//deleting a post 
app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;
    fs.readFile('./posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading posts.' });

        let posts = JSON.parse(data);
        posts = posts.filter(post => post.id !== postId);

        fs.writeFile('./posts.json', JSON.stringify(posts), (err) => {
            if (err) return res.status(500).json({ error: 'Error deleting the post.' });
            res.status(200).json({ message: 'Post deleted successfully.' });
        });
    });
});
