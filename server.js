const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const treeController = require('./controllers/treeController');


// Load environment variables
dotenv.config();

const app = express();

// Middleware - ORDER IS IMPORTANT
// CORS should be one of the first middleware
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const imageUploadRoute = require('./routes/imageUploadRoute');
app.use('/api', imageUploadRoute);

// Body parser middleware - these need to come BEFORE route handlers
app.use(express.json()); // This replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // This replaces bodyParser.urlencoded()

// Test route to verify body parsing
app.post('/api/test-body', (req, res) => {
  try {
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Received body:', req.body);
    res.json({ received: req.body });
  } catch (error) {
    console.error('Error in test-body route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MongoDB Connection
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tree', require('./routes/tree'));
app.use('/api/search', require('./routes/search'));
app.use('/api/profile', require('./routes/profile'));

// Family Member Routes
app.post('/api/family-members', treeController.createFamilyMember);
app.get('/api/family-members', treeController.getAllMembers);
app.get('/api/family-members/:id', treeController.getMember);
app.put('/api/family-members/:id', treeController.updateMember);
app.delete('/api/family-members/:id', treeController.deleteMember);

// Serve static files in production - should be one of the last middleware
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
}

// Error handling middleware - should be the last middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});