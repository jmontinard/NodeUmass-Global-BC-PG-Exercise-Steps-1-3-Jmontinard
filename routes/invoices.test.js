// const request = require('supertest');
// const app = require('../app');
// const db = require('../db');

// // Define a variable to store the test invoice
// let testInvoice;

// beforeEach(async () => {
//   // Insert a test company into the database
//   const companyResult = await db.query(
//     `INSERT INTO companies (code, name, description)
//      VALUES ('microsoft', 'windows', 'personal computer')
//      RETURNING *`
//   );

//   // Insert a test invoice associated with the test company
//   const invoiceResult = await db.query(
//     `INSERT INTO invoices (comp_code, amt)
//      VALUES ($1, 100)
//      RETURNING *`,
//     [companyResult.rows[0].code]
//   );

//   testInvoice = invoiceResult.rows[0];
// });

// afterEach(async () => {
//   // Clean up the test data
//   await db.query('DELETE FROM invoices');
//   await db.query('DELETE FROM companies');
// });

// afterAll(async () => {
//   await db.end();
// });

// describe("Invoice Routes", () => {
//   describe("GET /invoices", () => {
//     test("Get a list with all invoices", async () => {
//       const res = await request(app).get('/invoices');
//       expect(res.statusCode).toBe(200);
//       expect(Array.isArray(res.body.invoices)).toBe(true);
//     });
//   });

//   describe("POST /invoices", () => {
//     test("Creates a single invoice", async () => {
//       const newInvoice = {
//         comp_code: testInvoice.comp_code,
//         amt: 150,
//       };
//       const res = await request(app).post('/invoices').send(newInvoice);
//       expect(res.statusCode).toBe(201);
//       expect(res.body).toEqual(expect.objectContaining(newInvoice));
//     });
//   });

//   describe("GET /invoices/:id", () => {
//     test("Get a single invoice", async () => {
//         const res = await request(app).get(`/invoices/${testInvoice.id}`);
//         expect(res.statusCode).toBe(200);
//         expect(res.body.invoice).toEqual({
//           id: testInvoice.id,
//           comp_code: testInvoice.comp_code,
//           amt: testInvoice.amt,
//           paid: testInvoice.paid,
//           paid_date: testInvoice.paid_date,
//           add_date: expect.any(String), // Adjust this to the expected format
//         });
//       });

//     test("Responds with 404 for invalid ID", async () => {
//       const res = await request(app).get('/invoices/0');
//       expect(res.statusCode).toBe(404);
//     });
//   });

//   describe("PUT /invoices/:id", () => {
//     test("Updates a single invoice", async () => {
//       const updatedInvoice = {
//         amt: 200,
//         paid: true,
//       };
//       const res = await request(app).put(`/invoices/${testInvoice.id}`).send(updatedInvoice);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.invoice).toEqual(expect.objectContaining(updatedInvoice));
//     });

//     test("Responds with 404 for invalid ID", async () => {
//       const res = await request(app).put('/invoices/0').send({});
//       expect(res.statusCode).toBe(404);
//     });
//   });

// //   describe("PATCH /invoices/:id", () => {
// //     test("Updates a single invoice with partial data", async () => {
// //       const updatedInvoice = { amt: 300 };
// //       const res = await request(app).patch(`/invoices/${testInvoice.id}`).send(updatedInvoice);
// //       expect(res.statusCode).toBe(200);
// //       expect(res.body.invoice.amt).toBe(updatedInvoice.amt);
// //     });

// //     test("Responds with 404 for invalid ID", async () => {
// //       const res = await request(app).patch('/invoices/0').send({});
// //       expect(res.statusCode).toBe(404);
// //     });
// //   });

//   describe("DELETE /invoices/:id", () => {
//     test("Deletes a single invoice", async () => {
//       const res = await request(app).delete(`/invoices/${testInvoice.id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toEqual({ status: "deleted" });
//     });

//     test("Responds with 404 for invalid ID", async () => {
//         const res = await request(app).delete('/invoices/0');
//         expect(res.statusCode).toBe(404);
//       });
      
//   });
// });
