const db = require ("../../config/db")

module.exports = {


    all(id) {
 //console.log(id)
        try {

            
        return db.query(`

        SELECT files.*, recipe_files.* 
        FROM files
        LEFT JOIN recipe_files ON ( files.id = recipe_files.file_id)
        WHERE recipe_id = $1
        GROUP BY files.id, recipe_files.id
        
        `, [id])
            
        } catch (error) {
            console.error(error);
        }


    },


    create({filename, path}) {
        
        try {
            const query = `
        
            INSERT INTO files (
            name,
            path
            ) VALUES ( $1, $2)
             RETURNING id       
        `
        

        const values = [

            filename,
            path
        ]
        
        return db.query(query, values)
    
        } catch (error) {
            console.error(error);
        }

        
    },

    
    

}