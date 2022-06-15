const router = require('express').Router();
const { User, Project } = require('../../models');

const userData = require('../../seeds/userData.json');
const projectData = require('../../seeds/projectData.json');

// POST /api/seedDatabase
router.post("/", async (req, res) => {
  // secure my seed route so only authorized users can do it!!!
  // SEEDPASS=something inside of your env file or as a config variable in heroku
  if(req.body.SEEDPASS === process.env.SEEDPASS){
    // reads an array of objects
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });


    // for data with foreign keys, you want to use a for loop to create each data
    // record and randomize the keys if needed
    for (const project of projectData) {
      await Project.create({
        ...project,
        user_id: users[Math.floor(Math.random() * users.length)].id,
      });
    }
    res.json({message: "Seed successful"});
  }
  else{
    res.json({test: "Turtle dies", userData, projectData});
  }
  
});

module.exports = router;