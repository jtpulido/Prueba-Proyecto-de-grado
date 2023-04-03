
const pool = require('../db')
const getAllTask = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM task')
        res.json(result.rows)
    } catch (error) {
        next(error)
    }
}
const getTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await pool.query('SELECT * FROM task WHERE id=$1', [id])
        if (result.rowCount === 1) {
            res.json(result.rows[0])
        } else {
            res.send("No hay un tarea con ese id")
        }

    } catch (error) {
        next(error)
    }
}
const createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body
        const result = await pool.query('INSERT INTO task (title,description) VALUES ($1,$2) RETURNING *', [
            title, description
        ])
        res.json(result.rows[0])
    } catch (error) {
        next(error)
    }

}
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await pool.query('DELETE FROM task WHERE id=$1 RETURNING *', [id])
        if (result.rowCount === 0) return res.status(404).json({ message: "Id de tarea no encontrada" })

        return res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, description } = req.body
        const result = await pool.query('UPDATE task SET title = $1 ,description = $2 WHERE id = $3 RETURNING *', [
            title, description, id
        ])
        if (result.rowCount === 0) return res.status(404).json({ message: "Id de tarea no encontrada" })

        return res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getAllTask, createTask, deleteTask, updateTask, getTask
}