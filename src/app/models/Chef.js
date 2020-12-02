
//const { dateInTimeStamp} = require("../../lib/utils")
const db = require ("../../config/db")

module.exports = { 

all(filter) {

    try {

        let filterQuery = ""
    let query = `SELECT files.path, chefs.* 
    FROM chefs
    LEFT JOIN files ON (files.id = chefs.file_id)`

    if(filter){

        filterQuery = `WHERE chefs.name ILIKE '%${filter}%'`

        query = `${query}
                 ${filterQuery} `
                 
    }


    query = `${query}
            GROUP BY chefs.id, files.id
            ORDER BY chefs.file_id   `


   return db.query(query) 

    } catch (error) {
        
        console.error(error)
    }
    

},



create(data, id){

    try {

        const query = `
                    INSERT INTO chefs (
                        name,
                        file_id                          
                    )
                    VALUES ($1, $2)
                    RETURNING id
    
    `

    const values = [

            data.chef_name,
            id            
    ]     

    return db.query(query, values )
           
        
    } catch (error) {

        console.error(error)
    
    }
           
    },


findChefsData(id){

    try {
        
        return db.query (`
    

        SELECT chefs.*, count(recipes) AS qty_recipes, files.path, files.name AS image_name
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        LEFT JOIN files ON (files.id = chefs.file_id)
        where chefs.id = $1
        group by chefs.id, files.path, files.name`, [id]

)

    } catch (error) {
        console.error(error)
    }


},

recipesIds(id){
//console.log(id)
        try {
            
            return db.query(` SELECT recipes.id, recipes.chef_id 
                                FROM recipes WHERE chef_id = $1
                                ORDER by created_at DESC`, [id])

        } catch (error) {
            console.error(error)
        }

},

recipeJustOneImage({chef_id, id}){

    try {
        return db.query(`

        SELECT recipes.id, recipes.title, files.path
        FROM recipes
        LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
        LEFT JOIN files ON (files.id = recipe_files.file_id)
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1 and recipes.id =$2
        GROUP by files.id, recipes.id, chefs.id
        LIMIT 1
        
        `, [chef_id, id])
    } catch (error) {
        console.error(error)
        
    }
},

update(data){

    try {
        
        const query =  `
        UPDATE chefs SET
        name=($1)
        WHERE id = ($2) ` 
        
        const values = [

        data.chef_name,
        data.id
        ]                
                
        
return db.query(query, values)

    } catch (error) {
        console.error(error);
    }

},

verifyIfChefHasRecipes(id) {

    try {

        const query  = `   
        SELECT * FROM recipes
        WHERE recipes.chef_id = $1`


   return db.query(query, [id])

        
    } catch (error) {
        console.error(error)
    }

   
},

delete(id){  
    
    try {

        return db.query(`
    
                DELETE FROM chefs
                WHERE id=$1`, [id])

        
    } catch (error) {
        console.error(error)
    }
    

},


}