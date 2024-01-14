const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    express.static(path.join(__dirname, 'dist'))(req, res, next);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
