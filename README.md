
<h1 align="center">Rocketseat</h1>

<h1 align="center"><b>Foodfy Admin</b></h1>
<h1 align="center"><b>Recipes & Chefs</b></h1>

<h1 align="center">
    <img src="https://ik.imagekit.io/cnbmdh4b9w/ezgif.com-gif-maker_Tb3FKTbxZEq.gif">
</h1>


## About
Foodfy is a Web Application project to manage Recipes and Chefs.

## Learning Objectives
- Recipes can be created edited and deleted as long as there is no image on the recipe profile. 
- Chefs can be created, edited and deleted **when** there is no **recipe** tied to it. 
- Postgres database is being used to store data persistently.

Extra features implemented on this application:
- **For recipes**:
Applied a filter to the main page and on the Admin Index page. So, user can search by recipe's name. 
- Applied pagination on the Admin Index page.
- Implemented a validation for when user wants to delete a recipe. 
If a recipe contains images, there will be a message advising to remove recipe's images first. 
Then recipe can be removed from the system. 
- Applied a redirection to Home page when user clicks on the Foodfy Logo.


- **For chefs**:
Applied a filter on chef's Admin Index page. So, user can search by chefs' name. 

- New field **updated_at** created on **recipes** and **chefs** tables. 
Comands used : ALTER TABLE recipes ADD COLUMN updated_at timestamp DEFAULT (now()) **and** ALTER TABLE chefs ADD COLUMN updated_at timestamp DEFAULT (now())

- Created a procedure to register everytime a record (recipes or chefs is updated):
CREATE FUNCTION  trigger_set_time_stamp()
RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

Then, created a trigger for tables recipes and for the table Chefs: 
- CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_time_stamp();
- CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_time_stamp();

## Languages used
- Html5 (Hypertext)
- Css3 (Cascading Style Sheet)
- Javascript
- Postgres




