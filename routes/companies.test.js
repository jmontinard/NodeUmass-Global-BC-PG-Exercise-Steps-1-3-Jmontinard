// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

// let testCompany;
// beforeEach(async () => {
//   const result = await db.query(`INSERT INTO companies (code,name, description) VALUES ('microsoft','windows', 'personal computer') RETURNING *`);
//   testCompany = result.rows[0]
// })
let testCompany;

beforeEach(async () => {
  // Insert the company into the companies table
  const companyResult = await db.query(
    `INSERT INTO companies (code, name, description)
     VALUES ('microsoft', 'windows', 'personal computer')
     RETURNING *`
  );
  testCompany = companyResult.rows[0];

  // Query for the invoices associated with the company
  const invoicesResult = await db.query(
    `SELECT id
     FROM invoices
     WHERE comp_code = $1`,
    [testCompany.code]
  );

  // Add the invoices array to the testCompany
  testCompany.invoices = invoicesResult.rows.map((row) => row.id);
});

afterEach(async () => {
  await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
  await db.end()
})

describe("GET /companies", () => {
    test("Get a list with all company", async () => {
    //   const res = await request(app).get('/companies')
    //   expect(res.statusCode).toBe(200);
    //   expect(res.body).toEqual({companies:[testCompany]});
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.companies)).toBe(true);
    const found = res.body.companies.some(company => company.code === testCompany.code);
    expect(found).toBe(true);
    })
  })


  describe("POST /companies", () => {
    test("Creates a single company", async () => {
      const res = await request(app).post('/companies').send({ code: 'apple', name: 'Macintosh', description: 'osx' });
      expect(res.statusCode).toBe(201);
      // expect(res.body).toEqual({
      //   user: { id: expect.any(Number), name: 'BillyBob', type: 'staff' }
      // })
      expect(res.body).toEqual({
        code:  'apple',
        name: 'Macintosh',
        description: 'osx'
      });
      
    })
  })


  describe("GET /companies/:code", () => {
    test("Get a single company", async () => {
      const res = await request(app).get(`/companies/${testCompany.code}`)
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ company: testCompany });
    })
    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).get(`/companies/0`)
        expect(res.statusCode).toBe(404);
      })
  })



  describe("PUT /companies/:code", () => {
    test("Updates a single company", async () => {
      const res = await request(app).put(`/companies/${testCompany.code}`).send({ code: 'apple' , name: 'Macintosh', description: 'osx'});
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        company: { code: testCompany.code, name: 'Macintosh', description: 'osx' }
      })
    })
    test("Responds with 404 for invalid id", async () => {
      const res = await request(app).patch(`/companies/0`).send({ code: testCompany.code, name: 'Macintosh', description: 'osx'});
      expect(res.statusCode).toBe(404);
    })
  })
  
  describe("DELETE /companies/:code", () => {
    test("Deletes a single company", async () => {
      const res = await request(app).delete(`/companies/${testCompany.code}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ "status": "deleted" })
    })
  })
  