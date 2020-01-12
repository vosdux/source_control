const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const router = Router();

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректные данные'
                })
            }

            const { email, password } = req.body
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'Неверный логин' });
            }


            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            console.log(token)

            res.cookie('jwt', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.send();

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Что-то пошло не так' });
        }
    });

module.exports = router;