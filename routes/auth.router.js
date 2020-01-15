const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const Token = require('../models/Token');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const router = Router();
const authHelper = require('../helpers/authHelpers');

const updateToken = async (userId) => {
    try {
        const accessToken = authHelper.generateAccessToken(userId);
        const refreshToken = authHelper.generateRefreshToken();
        await authHelper.replaceDbRefreshToken(refreshToken.id, userId);
        
        return { accessToken, refeshToken: refreshToken.token };
    } catch (error) {
        console.log(error);
    }
};

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            console.log(req.body);
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

            const tokens = await updateToken(user._id);
            console.log(tokens);
            res.json(tokens);
            // const secret = config.get('jwtSecret'),

            // const token = jwt.sign(
            //     { userId: user.id, type: 'access' },
            //     secret,
            //     { expiresIn: '1h' }
            // );

            // const refreshToken = jwt.sign(
            //     { id: uuid(), type: 'refresh'},
            //     secret,
            //     { expiresIn: '24h' }
            // );

            // Token.findOneAndRemove()
            // res.cookie('jwt', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Что-то пошло не так' });
        }
    });

router.post('/refresh-token', async (res, req) => {
    try {
        const { refeshToken } = req.body;
        const payload = jwt.verify(refreshToken, secret);
        if (payload.type !== 'refresh') {
            res.status(400).json({ message: 'Неверный токен!' });
        }
         
        const tokenData = await Token.findOne({ tokenId: payload.id });

        if (tokenData = null) {
            res.status(400).json({ message: 'Неверный токен!' });
        }

        const tokens = await updateToken(tokenData.userId);

        res.json(tokens);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(400).json({ message: 'Токен протух' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: 'Неверный токен' });
        }
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

module.exports = router;