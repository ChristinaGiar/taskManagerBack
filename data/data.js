const fs = require('node:fs/promises');
const { hash, compare } = require('bcryptjs');
const { v4: id} = require('uuid');
var path = require('path');
const pathRoot = path.resolve(__dirname);

async function addUser(data) {
    const storedUsers = await readData();
    const hashPass = await hash(data.password, 10);
    const userId = id();

    if(!storedUsers.users) {
        storedUsers.users = [];
    }

    storedUsers.users.push({ ...data, password: hashPass, id: userId, name: data.name});
    await writeData(storedUsers);
    return{ id: userId, email: data.email, name: data.name}
}

async function getUser(data) {
    const storedUsers = await readData();
    if(!storedUsers.users || storedUsers.users.length === 0) {
        return null;
    }
    const user = storedUsers.users.find(user => user.email === data.email);
    if(!user) {
        return;
    }
    const result = await checkPassword(data.password, user.password) ? user : null;
    return result;
}

async function checkPassword(enteredPass, DBpassword) {
    const validPass = await compare(enteredPass, DBpassword);
    return !!validPass;
}


async function readData() {
    const data = await fs.readFile(path.join(pathRoot, '..', 'users.json'), { encoding: 'utf8' });
    return JSON.parse(data);
}

async function writeData(newData) {
    await fs.writeFile(path.join(pathRoot, '..', 'users.json'), JSON.stringify(newData));
}

exports.addUser = addUser;
exports.getUser = getUser;