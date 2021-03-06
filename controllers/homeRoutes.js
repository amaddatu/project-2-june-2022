const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/seedTest', async (req, res) => {
  // res.send("page will have data");
  // let project = {name: "test"}
  try{
    let project = await Project.findOne({
      where: {
        description: "All turtles need a home"
      }
    });
    project = project.get({ plain: true });
    // "description": "All turtles need a home"
    res.render('seedtest', {project});
  }
  catch(error){
    res.status(404).send("Turtle project not found");
  }
});

router.get('/helloUser', withAuth, async (req, res) => {
  console.log({turtle: req.turtle, session: req.session});
  const userData = await User.findByPk(req.session.user_id);

  // serialize (unpack)
  const user = userData.get({ plain: true });

  // res.send("Hello....");
  // res.json(user);
  res.render('hellouser', { 
    otherData: "blahblahblah",
    user: {
      name: user.name,
      email: user.email
    }
  });
});

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    console.log({turtle: req.turtle, session: req.session});
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
