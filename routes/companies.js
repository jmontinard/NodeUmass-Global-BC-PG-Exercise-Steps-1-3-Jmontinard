/** Routes for  companies. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) =>{
 
    try {
      const results = await db.query(`SELECT code, name 
      FROM companies 
      ORDER BY name`);
      return res.json({companies: results.rows})
    } catch (error) {
     return next(error);
    }
  })

  router.post('/', async (req, res, next) =>{
    try {
        const {code,name, description} = req.body
        const results = await db.query(`INSERT INTO companies (code,name, description) VALUES ($1, $2, $3) RETURNING  *`, [code,name, description])
        return res.status(201).json(results.rows[0])
    } catch (error) {
     return next(error);
    }
  })


 
  router.get("/:code", async function (req, res, next) {
    try {
      const { code } = req.params;
  
      const companyResult = await db.query(
        `SELECT c.code, c.name, c.description, 
                ARRAY_AGG(it.ind_code) AS industry_codes,
                ARRAY_AGG(i.industry) AS industries
         FROM companies c
         LEFT JOIN industries_tags it ON c.code = it.com_code
         LEFT JOIN industries i ON it.ind_code = i.code
         WHERE c.code = $1
         GROUP BY c.code, c.name, c.description`,
        [code]
      );
  
      const invoiceResult = await db.query(
        `SELECT id, amt, paid, paid_date
         FROM invoices
         WHERE comp_code = $1`,
        [code]
      );
  
      if (companyResult.rows.length === 0) {
        throw new ExpressError(`No such company: ${code}`, 404);
      }
  
      const company = companyResult.rows[0];
      const invoices = invoiceResult.rows;
  
      company.invoices = invoices;
  
      return res.json({ company });
    } catch (err) {
      return next(err);
    }
  });
  
  



  router.put('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const { name, description } = req.body;
      const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update company with code of ${code}`, 404)
      }
      return res.send({ company: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })

  router.delete('/:code', async (req, res, next) => {
    try {
        const results = await db.query('DELETE FROM companies WHERE code = $1', [req.params.code]);
        if (results.rowCount === 0) {
            throw new ExpressError(`No such company: ${req.params.code}`, 404);
        } else {
            return res.json({ "status": "deleted" });
        }
    } catch (e) {
        return next(e);
    }
});


// industrie routes 
// Associate an industry with a company
router.post('/:code/industries', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { ind_code } = req.body;
    const result = await db.query('INSERT INTO industries_tags (com_code, ind_code) VALUES ($1, $2) RETURNING *', [code, ind_code]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});




  module.exports = router;