const { Router } = require('express');
const authController = require('../authController/authController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.post(
    '/registration',
    [
        check('username', 'name must not be empty').notEmpty(),
        check(
            'password',
            'password cannot be less than 4 and more than 10 characters'
        ).isLength({ min: 4, max: 10 }),
    ],
    authController.registration
);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getUsers);

module.exports = router;
