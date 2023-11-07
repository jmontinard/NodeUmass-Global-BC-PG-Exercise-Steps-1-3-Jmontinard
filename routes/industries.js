/** Routes for  companies. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");



router.get('/', async (req, res, next) =>{
 
    try {
      const results = await db.query(   `SELECT * 
      FROM industries`);
      return res.json({invoices: results.rows})
    } catch (error) {
     return next(error);
    }
  })

router.post('/', async (req, res, next) => {
    try {
      const { code, industry } = req.body;
      const result = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *', [code, industry]);
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return next(error);
    }
  });


  module.exports = router;