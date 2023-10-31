const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) =>{
 
    try {
      const results = await db.query(   `SELECT id, comp_code
      FROM invoices 
      ORDER BY id`);
      return res.json({invoices: results.rows})
    } catch (error) {
     return next(error);
    }
  })

  router.post('/', async (req, res, next) =>{
 
    try {
        const {comp_code,amt} = req.body
        const results = await db.query(`INSERT INTO invoices (comp_code,amt) VALUES ($1, $2) RETURNING  *`, [comp_code,amt])
        return res.status(201).json(results.rows[0])
    } catch (error) {
     return next(error);
    }
  })

  router.put("/:id", async function (req, res, next) {
    try {
      const {amt, paid} = req.body;
      const {id} = req.params;
      let paidDate = null;
  
      const currResult = await db.query(
            `SELECT paid
             FROM invoices
             WHERE id = $1`,
          [id]);
  
      if (currResult.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
      }
  
      const currPaidDate = currResult.rows[0].paid_date;
  
      if (!currPaidDate && paid) {
        paidDate = new Date();
      } else if (!paid) {
        paidDate = null
      } else {
        paidDate = currPaidDate;
      }
  
      const result = await db.query(
            `UPDATE invoices
             SET amt=$1, paid=$2, paid_date=$3
             WHERE id=$4
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
          [amt, paid, paidDate, id]);
  
      return res.json({"invoice": result.rows[0]});
    }
  
    catch (err) {
      return next(err);
    }
  
  });
  router.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { amt} = req.body;
      const results = await db.query('UPDATE  invoices SET amt=$1 WHERE id=$2 RETURNING *', [amt, id])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update invoice with id of ${id}`, 404)
      }
      return res.send({ invoice: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const results = db.query('DELETE FROM invoices WHERE id = $1', [req.params.id])
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
      }
  
      return res.json({"status": "deleted"});
    }
    catch (e) {
      return next(e)
    }
  })


module.exports = router;