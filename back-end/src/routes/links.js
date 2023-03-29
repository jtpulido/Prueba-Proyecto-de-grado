const express = require("express");
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database')
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add')
})

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newlink = {
        title,
        url,
        description
    }
    await pool.query('INSERT INTO links (title,url,description) VALUES ($1,$2,$3)', [newlink.title, newlink.url, newlink.description]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links')
})

router.get('/', isLoggedIn, async (req, res) => {
    const links = (await (pool.query('SELECT * FROM links'))).rows
    res.render('links/list', { links })

})

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM links WHERE id = $1', [id])
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links')
})

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const links = (await (pool.query('SELECT * FROM links WHERE id= $1', [id]))).rows
    res.render('links/edit', { link: links[0] })

})
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const { title, url, description } = req.body;
    const linkedit = {
        title,
        url,
        description
    }
    await pool.query('UPDATE links SET title= $1, url=$2,description=$3 WHERE id = $4', [linkedit.title, linkedit.url, linkedit.description, id])
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links')

})




module.exports = router;