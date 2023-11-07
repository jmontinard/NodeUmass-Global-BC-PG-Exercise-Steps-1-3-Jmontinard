DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;


\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  industry text UNIQUE
);


CREATE TABLE industries_tags (
com_code  TEXT NOT NULL REFERENCES companies,
ind_code text NOT NULL REFERENCES industries,
PRIMARY KEY (com_code, ind_code)
);


INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('Mtx', 'ModernaTx', 'Global leader in biotech.'),
            ('Soc', 'Social Marketers', 'All your marketing needs in one location.')
         ;
    

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries 
VALUES
('tech', 'Technology'),
('mrkt', 'Marketing'),
('bTech', 'Biotech'),
('mfg', 'Manufacturing');



INSERT INTO industries_tags
VALUES
  ('apple', 'tech'),
  ('ibm', 'tech'),
  ('Soc', 'mrkt'),
  ('Mtx', 'bTech'),
  ('Mtx', 'mfg');