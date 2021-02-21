
<h1 align="center">Rocketseat</h1>

<h1 align="center"><b>Foodfy</b></h1>
<h1 align="center"><b>Recipes & Chefs</b></h1>

<h1 align="center">
    <img src="https://ik.imagekit.io/cnbmdh4b9w/ezgif.com-gif-maker__5__ratIA-q48.gif">
</h1>
<h1 align="center">
    <img src="https://ik.imagekit.io/cnbmdh4b9w/ezgif.com-gif-maker__6__BBc20Li-7s.gif">
</h1>

## About
Foodfy is a Web Application project to manage Recipes and Chefs. It was developed during Launchbase bootcamp at Rocketseat.

## Learning:
- Users can login to the system and recover their password if it has been forgotten. Used "mailtrap" to send a password reset link by email.
- Recipes can be created by any user, but can only be edited by its user or by the admin.
- Admin can create, edit and delete any user, recipes and chef.
- Only admin can create new users.
- Admins cannot delete their own account. 
- Non Admin cannot edit or delete other user's recipes.
- Non Admin cannot view or delete other user's accounts.
- Non Admin cannot create, edit or delete chefs.
- Non Admins cannot delete their own account.
- When Admin creates a new user, an email is sent to the new user.
- Postgres database is being used to store data persistently.
- Created a search page, so when user search by either recipe's name or chef's name, user will be redirected to the search page and data will be shown by the most updated recipes. 
- On the other hand, the pages that show a list of recipes(home and admin.index), the recipes will be shown by the most recently created ones. 

    - New field **user_id** created on table **recipes**.

    - New field **updated_at** created on table **recipes**.  
    - New field **updated_at** created on **chefs** table. 
- Queries used : 

    <prep><code> 
    ALTER TABLE recipes ADD COLUMN user_id int;
    </code><prep>

    <prep><code>
    ALTER TABLE recipes ADD COLUMN updated_at timestamp DEFAULT (now());
    </code></prep> 
        
    <prep><code> 
    ALTER TABLE chefs ADD COLUMN updated_at timestamp DEFAULT (now());
    </code></prep> 

- For both **recipes** and **chefs** 
- Created a procedure to register everytime a record on(recipes or chefs) is updated:

    <prep><code> 
    CREATE FUNCTION  trigger_set_time_stamp()
    RETURNS TRIGGER AS
    $$
    BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    </code></prep> 

    - Then, created a trigger for tables recipes and for the table Chefs: 
       
    <prep><code> CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_time_stamp();
    </code></prep>

    <prep><code>CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON chefs
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_time_stamp();
    </code></prep> 

 - New table **session** created

## Extra features implemented on this application:
- Applied a redirection to Home page when user clicks on the Foodfy Logo. (For non Admin routes)
- **For recipes**: 
    - Applied pagination on the Admin Index page.
     - Implemented a not-found page. When recipe is not found this page is shown for 2 seconds, then user is redirected to recipe creation page.
        
        <prep><code>setTimeout(()=> { location.href = "/admin/receitas/create" }, 2000)
        </code></prep>

- **For chefs**:
    - Applied a filter on chef's Admin Index page. So, user can search by chefs' name. User will be redirected to the same page, but with filter applied. 

## Languages used
- Html5 (Hypertext)
- Css3 (Cascading Style Sheet)
- Javascript
- Postgres
- Node.js
- Mailtrap


## To clone: 
Clone this repository: $ git clone https://github.com/Gilmara-Git/Foodfy

Save it on C: drive

Enter in directory: $ cd Foodfy

Install dependencies: $ npm install

Execute application: $ npm start

Open your browser in: http://localhost:5500/

