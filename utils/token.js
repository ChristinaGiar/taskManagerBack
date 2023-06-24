const { sign } = require('jsonwebtoken');

const KEY = 'secretkey';

function createJWToken(email) {
    return sign({ email }, KEY, { expiresIn: '1h' });
}

exports.createJWToken = createJWToken;