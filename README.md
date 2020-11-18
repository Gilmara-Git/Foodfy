
<h1 align="center">Rocketseat</h1>

<h1 align="center"><b>Foodfy Admin</b></h1>
<h1 align="center"><b>Recipes & Chefs</b></h1>

<h1 align="center">
    <img src="https://ik.imagekit.io/cnbmdh4b9w/ezgif.com-gif-maker__5__ratIA-q48.gif">
</h1>


## About
Foodfy is a Web Application project to manage Recipes and Chefs. It is being developed during Lauchbase bootcamp at Rocketseat.

## What has been developed so far:
- Recipes can be created edited.
- Recipes can be deleted as long as there is no image on the recipe profile. 
- Chefs can be created, edited and deleted **when** there is no **recipe** tied to it. 
- Postgres database is being used to store data persistently.

- Created a search page, so when user search by either recipe's name or chef's name, user will be redirected to the search page and data will be shown by the most updated recipes. 
- On the other hand the pages that show a list of recipes(home and admin.index), recipes will be shown by the most recently created. 


    - New field **updated_at** created on **recipes** table.  
Command used : ALTER TABLE recipes ADD COLUMN updated_at timestamp DEFAULT (now()) 



    - New field **updated_at** created on **chefs** table. 
Command used : ALTER TABLE chefs ADD COLUMN updated_at timestamp DEFAULT (now())

- For both **recipes** and **chefs** 
    - Created a procedure to register everytime a record (recipes or chefs is updated):
CREATE FUNCTION  trigger_set_time_stamp()
RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

    - Then, created a trigger for tables recipes and for the table Chefs: 
    -   CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_time_stamp();
    - CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_time_stamp();



## Extra features implemented on this application:
- Applied a redirection to Home page when user clicks on the Foodfy Logo.
- **For recipes**: 
    - Applied pagination on the Admin Index page.
    - Implemented a validation for when user wants to delete a recipe. 
If a recipe contains images, there will be a message advising to remove recipe's images first. 
Then recipe can be removed from the system. 

    - Implemented a not-found page. When recipe is not found this page is shown for 2 seconds, then user isredirected to recipe creation page.
        - setTimeout(()=> { location.href = "/admin/receitas/create" }, 2000)

- **For chefs**:
    - Applied a filter on chef's Admin Index page. So, user can search by chefs' name. User will be redirected to the same page, but with filter applied. 

## Languages used
- Html5 (Hypertext)
- Css3 (Cascading Style Sheet)
- Javascript
- Postgres


## To clone: 
Clone this repository: $ git clone https://github.com/Gilmara-Git/Foodfy

Save it on C: drive

Enter in directory: $ cd Foodfy

Install dependencies: $ npm install

Execute application: $ npm start

Open your browser in: http://localhost:5500/

