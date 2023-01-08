const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Role = require('../models/Role');
const { secret } = require('../secret');

const generateAccessToken = (id, roles) => {
    const payload = { id, roles };

    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class AuthController {
    async registration(req, res) {
        try {
            const validationError = validationResult(req);
            if (!validationError.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: validationError.errors[0].msg });
            }

            const { username, password } = req.body;
            const candidate = await User.findOne({ username });

            if (candidate) {
                return res.status(400).json({ message: 'user already exists' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const role = await Role.findOne({ value: 'USER' });
            console.log(role);
            const user = new User({
                username,
                password: hashPassword,
                roles: [role.value],
            });

            user.save();
            res.status(201).json({
                message: 'User is successfully registered',
            });
        } catch (err) {
            res.status(400).json({ error: 'registration error' });
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) {
                return res.status(403).json({ message: 'incorrect password' });
            }

            const token = generateAccessToken(user._id, user.roles);

            return res.json({ token });
        } catch (err) {
            res.status(400).json({ error: 'login error' });
        }
    }
    async getUsers(req, res) {
        try {
            const allUsers = await User.find();

            res.json(allUsers);
        } catch (err) {
            res.status(500).send({ error: 'server internal' });
        }
    }
}

module.exports = new AuthController();
