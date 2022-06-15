const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const seedDatabaseRoutes = require('./seedDatabaseRoutes');

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

router.use('/seedDatabase', seedDatabaseRoutes);

module.exports = router;
