const request = require('supertest');
const app = require('../app'); // Import your Express app instance
const db = require('../db');
const { expect } = require('chai');

describe('Industries Routes', () => {
  let testIndustry;

  beforeEach(async () => {
    // Insert a test industry into the industries table
    const industryResult = await db.query(
      `INSERT INTO industries (code, industry)
       VALUES ('tech', 'Technology')
       RETURNING *`
    );
    testIndustry = industryResult.rows[0];
  });

  afterEach(async () => {
    // Clean up by deleting the test industry
    await db.query(`DELETE FROM industries WHERE code = $1`, [testIndustry.code]);
  });

  afterAll(async () => {
    // Close the database connection
    await db.end();
  });

  describe('GET /industries', () => {
    it('should return a list of all industries', (done) => {
      request(app)
        .get('/industries')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(Array.isArray(res.body.invoices)).to.be.true;
          expect(res.body.invoices.some((industry) => industry.code === testIndustry.code)).to.be.true;
          done();
        });
    });
  });

  describe('POST /industries', () => {
    it('should add a new industry', (done) => {
      const newIndustry = {
        code: 'new-industry',
        industry: 'New Industry Name',
      };

      request(app)
        .post('/industries')
        .send(newIndustry)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body.code).to.equal(newIndustry.code);
          expect(res.body.industry).to.equal(newIndustry.industry);
          done();
        });
    });
  });
});
