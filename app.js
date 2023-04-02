const express = require('express');
const api = require('./routes/index.js');
const fs = require('fs')
const { body, validationResult } = require('express-validator')

const PORT = process.env.PORT || 3001;
const app = express();

app.set('view engine', 'pug')

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   // true-more accurate but slower, false-faster but less accurate
app.use('/api', api);
app.use(express.static('public'));    // 'public' folder


//Form
app.get('/login', function (req, res) {
  res.render('index')
})


/*app.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req)

    try {
      if (!errors.isEmpty() && errors.errors[0].param === 'email') {
        return res.status(400).render('login', { emailErr: true })
      }
      if (!errors.isEmpty() && errors.errors[0].param === 'password') {
        return res
          .status(400)
          .render('login', { passErr: true })
      }
      //const user = await User.create(req.body)
      req.login('./db/user.json', err => (err ? next(err) : res.json(user)))
    } catch (err) {
      next(err)
    }
  }
)*/

app.post('/login', 
body('email').isEmail(),
body('password').isLength({ min: 6 }),(req, res) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)

  if (email.trim() === '' && password.trim() === '') {
    res.render('login', { error: true })
  } 
  if (!errors.isEmpty() && errors.errors[0].param === 'email') {
    return res.status(400).render('login', { emailErr: true })
  }
  if (!errors.isEmpty() && errors.errors[0].param === 'password') {
    return res
      .status(400)
      .render('login', { passErr: true })
  }
  else {
    fs.readFile('./db/user.json', (err, data) => {
      if (err) throw err

      const notes = JSON.parse(data)

      notes.push({
        id: id(),
        email: email,
        password: password,
      })
      fs.writeFile('./db/user.json', JSON.stringify(notes), err => {
        if (err) throw err
        
        res.render('index')


      })
    })
  }

})

// GET route for landing page                             
app.get('/', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err

    const notes = JSON.parse(data)

    res.render('login', { notes: notes })
  })
});


// GET route for notes page                               
app.get('/notes', (req, res) => {

  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err

    const notes = JSON.parse(data)

    res.render('notes', { notes: notes })
  })
});

// wildcard route for 404 page. should ALWAYS be below ALL other routes.
app.get('*', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err

    const notes = JSON.parse(data)

    res.render('404', { notes: notes })
  })
}
  //res.sendFile(path.join(__dirname, '/public/404.html'))
);


function id () {
  return '_' + Math.random().toString(20).substr(5, 10)
}

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
