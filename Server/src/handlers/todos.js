const Express = require('express');
const { getDBHandler } = require('../lib/db');
const { Router } = require('express');

const RequestHandler = Router();

RequestHandler.post('/to-dos', async (request, response, next) => {
    try {
        const dbHandler = await getDBHandler();
        const { title, description, isDone: is_done } = request.body;
        const newTodo = await dbHandler.run(`
            INSERT INTO todos (title, description, is_done)
            VALUES(
                "${title}",
                "${description}",
                ${is_done}
            )
        `);
        await dbHandler.close();
        response.send({
            todoAdded: {
                title,
                description,
                is_done,
            },
            newTodo,
            //creationInfo,
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            errorMessage: 'There was an unexpected error trying to create a new to do',
            errorDetails: error.message,
            errorDetails: error,
        });
    }
});

RequestHandler.patch('/to-dos/:id', async(req,res,next) => {
    try {
        const todoId = req.params.id;

        if(!todoId){
            res.status(400).send({ error: `A to do id was expected, got ${todoId}`});
            next();
        }

        const { title, description, isDone: is_done} = req.body;

        const dbHandler = await getDBHandler();
        const updateTodo = await dbHandler.run(
            `UPDATE todos
                SET title = '${title}',
                    description = '${description}',
                    is_done = ${is_done}
                WHERE id = ${todoId}`
        );

        await dbHandler.close();

        res.send({
            updateTodo: {title, description, isDone: is_done},
        });
    } catch (error) {
        res.status(500).send({
            error: `There was an unexpected error tryinh to update a to do`,
            errorMessage: error.message,
            errorDetails: error,
        });
    }
});

RequestHandler.get('/to-dos', async(req, res, next) => {
    try {
        const dbHandler = await getDBHandler();
        const todos = await dbHandler.all('SELECT * FROM todos');

        if(!todos){
            res.status(404).send({ message: 'To do not found'});
            next();
        }
        dbHandler.close();
        res.send(todos);
    } catch (error) {
        res.status(500).send({
            error: `There was an unexpected error trying to get the to dos`,
            errorMessage : error.message,
            errorDetails: error,
        });
    }
});

RequestHandler.get('/to-dos/:id', async (req, res, next) => {
    try {
        const todoId = req.params.id;

        const dbHandler = await getDBHandler();
        const todoFound = await dbHandler.get(
            'SELECT * FROM todos WHERE id = ?',
            todoId
        );

        if(!todoFound){
            res.status(404).send( { message: ' To do not found'});
            next();
        }
        dbHandler.close();
        res.send(todoFound);

    } catch (error) {
        res.status(500).send({
            error: `There was an unexpected error trying to get the to dos`,
            errorMessage: error.message,
            errorDetails: error,
        });
    }
});

RequestHandler.delete('/to-dos/:id', async(req, res, next) => {
    try {
        const dbHandler = await getDBHandler();
        const todoId = req.params.id;
        const deletedTodo = await dbHandler.run(
            'DELETE FROM todos WHERE ID = ?',
            todoId
        );

        dbHandler.close();
        res.send(deletedTodo);
    } catch (error) {
        res.status(500).send({
            error: `There was an unexpected error trying to delete a todo`,
            errorMessage: error.message,
            errorDetails: error,
        });
    }
});

module.exports = RequestHandler;