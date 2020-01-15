const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const config = require('config');
const Token = require('../models/Token');

const generateAccessToken = (userId) => {
    const token = jwt.sign(
        { userId, type: 'access' },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
    );

    return token;
};

const generateRefreshToken = () => {
    const id = uuid();
    const token = jwt.sign(
        { id, type: 'refresh' },
        config.get('jwtSecret'),
        { expiresIn: '24h' }
    );

    return { token, id };
};

const replaceDbRefreshToken = async (tokenId, userId) => {
    try {
        await Token.findOneAndRemove({ userId });
        await Token.create({ tokenId, userId })
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken
};