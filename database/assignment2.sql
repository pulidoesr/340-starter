-- ASSIGNMENT 2 
-- TASK 1


-- Insert data to clsaasification table
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
   ('Sport'),
   ('SUV'),
   ('Truck'),
   ('Sedan');

-- Query 1
-- Insert a new record to the `account` table
-- account_id is auto generated
-- account_type default is `Client`

INSERT INTO public.account (
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password
)
VALUES (
    'Tony', 
    'Stark', 
    'tony@starkent.com', 
    'Iam1ronM@n'
);

-- Query 2
-- Table account, modify account type
-- account_id = 1 or account_email = 'tony@starkent.com'

UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Query 3
-- Table account, delete record
-- account_type = 'Admin' and account_email = 'tony@starkent.com'

DELETE FROM public.account
WHERE account_type = 'Admin' AND account_email = 'tony@starkent.com';

-- Query 4
-- Table `inventory`
-- Update inv_description with `a huge interior` where `smal interiors`
-- Update the records for Make = 'GM' and Model = 'Hummer'
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model ='Hummer';

-- Query 5
-- Tables: `inventory` & `classification`
-- Fields selection: make, model, classification name
-- Classification name = 'Sport'
SELECT 
    i.inv_make, 
    i.inv_model, 
    c.classification_name
FROM 
    public.inventory AS i
INNER JOIN 
    public.classification AS c
ON 
    i.classification_id = c.classification_id
WHERE 
    c.classification_name = 'Sport';

-- Query 6
-- Update the `Inventory` table
-- Fields: inv_image and inv_thumbnail
-- Value: '/images/' with '/images/vehicles/'
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');