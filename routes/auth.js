const express = require('express');

const router = express.Router();
const { getUser, addUser } = require('../data/data');
const { createJWToken } = require('../utils/token');

router.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const serverErrors = {};

    const existingUser = await getUser({ email, password });
    if (existingUser) {
        serverErrors.email = 'Email already exists. ';
    }

    if (password.length < 8) {
        serverErrors.password = 'Password must be at least 8 characters long. ';
    }

    if (Object.keys(serverErrors).length > 0) {
        return res.status(422)
            .json({ serverErrors: serverErrors });
    }

    try {
        const newUser = await addUser({ email, password, name });
        const authToken = createJWToken(email);
        res.status(201)
            .json({ message: 'User created. ', user: newUser, token: authToken })
    } catch (error) {

    }
})

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await getUser({ email, password });
    if (!user) {
        return res.status(422).json({
            message: 'Invalid credentials. ',
            serverError: 'Invalid email or password'
        })
    }

    const token = createJWToken(email);
    res.json({ token, "user": { "name": user.name } });

})

module.exports = router;