CREATE TABLE invoice (
    invoice_id SERIAL PRIMARY KEY,      -- Auto-incrementing primary key
    invoice_number INTEGER NOT NULL,    -- Invoice number (must be provided)
    invoice_account_id INTEGER NOT NULL, -- Foreign key reference to account (if applicable)
    invoice_date DATE NOT NULL,         -- Date of invoice
    invoice_inv_id INTEGER NOT NULL,    -- Foreign key reference to inventory (if applicable)
    invoice_price NUMERIC(10,2) NOT NULL, -- Item price with two decimal places
    invoice_tax_rate NUMERIC(5,2) NOT NULL, -- Tax rate percentage (e.g., 10.00 for 10%)
    invoice_tax_amount NUMERIC(10,2) NOT NULL, -- Calculated tax amount
    invoice_discount NUMERIC(10,2) DEFAULT 0, -- Discount applied (default is 0)
    invoice_total NUMERIC(10,2) NOT NULL -- Total amount after tax and discount
);
