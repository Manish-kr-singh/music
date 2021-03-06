const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/music', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.name){
    errors.push({text:'Please add a name'});
  }
  if(!req.body.years_active){
    errors.push({text:'Please add years of activeness'});
  }
  if(!req.body.description){
    errors.push({text:'Please add some details'});
  }
  if(!req.body.album){
    errors.push({text:'Please add a album'});
  }
  if(!req.body.releaseDate){
    errors.push({text:'Please add a date'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      name: req.body.name,
      years_active: req.body.years_active,
      description: req.body.description,
      album: req.body.album,
      releaseDate: req.body.releaseDate
    });
  } else {
    const newUser = {
      name: req.body.name,
      years_active: req.body.years_active,
      description: req.body.description,
      album: req.body.album,
      releaseDate: req.body.releaseDate
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.name = req.body.name;
    idea.years_active = req.body.years_active;
    idea.description = req.body.description;
    idea.album = req.body.album;
    idea.releaseDate = req.body.releaseDate;
    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  });
});

const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
