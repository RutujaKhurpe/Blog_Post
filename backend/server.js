const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const methodOverride = require('method-override');
const bodyParser = require('body-parser')

const app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))

const userRoutes = require("./routes/userRoutes");
const blogRoutes= require("./routes/blog")

app.use("/public", express.static('public')); // Serve static files
app.use(methodOverride('_method'));

app.use(cors());
// Route to serve the profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));


mongoose.connect("mongodb://127.0.0.1:27017/Blog_assignment")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Connection error", error));

app.use("/user", userRoutes);
app.use("/blog", blogRoutes)

app.listen(8000, () => {
    console.log(`Server running at http://localhost:8000/`);
});
