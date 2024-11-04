const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read users from the JSON file
const readUsersFromFile = async () => {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
};

// Helper function to write users to the JSON file
const writeUsersToFile = async (users) => {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
};

// GET /users - Retrieve all user profiles
router.get('/', async (req, res) => {
    const users = await readUsersFromFile();
    res.status(200).json(users);
});

// POST /users - Create a new user profile
router.post('/', async (req, res) => {
    const users = await readUsersFromFile();
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    await writeUsersToFile(users);
    res.status(201).json(newUser);
});

// PUT /users/:id - Update a user profile entirely
router.put('/:id', async (req, res) => {
    const users = await readUsersFromFile();
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[index] = { id: userId, ...req.body };
    await writeUsersToFile(users);
    res.status(200).json(users[index]);
});

// PATCH /users/:id - Update specific fields of a user profile
router.patch('/:id', async (req, res) => {
    const users = await readUsersFromFile();
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[index] = { ...users[index], ...req.body };
    await writeUsersToFile(users);
    res.status(200).json(users[index]);
});

// DELETE /users/:id - Delete a user profile
router.delete('/:id', async (req, res) => {
    const users = await readUsersFromFile();
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users.splice(index, 1);
    await writeUsersToFile(users);
    res.status(204).send(); // No content
});

module.exports = router;
