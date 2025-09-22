// server.js - simple Express server to serve static files and API routes
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files from project root
app.use(express.static(path.join(__dirname)));

// API routes
app.use('/api/register', require('./api/register'));
app.use('/api/feedback', require('./api/feedback'));

// fallback to index.html for SPA-ish routing
app.get('*', (req,res) => res.sendFile(path.join(__dirname,'index.html')));

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
