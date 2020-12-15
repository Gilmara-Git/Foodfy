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
        console.log('filename',filename)
        console.log('path name',path)
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

    getChefImageId(chef_id) {
        
        try {
            
            return db.query(`
            
                SELECT file_id FROM chefs 
                WHERE id = $1`, [chef_id])

        } catch (error) {
            console.error(error)
        }
    }, 

    update({path, filename}, id){

        try {
            
            const query = `UPDATE files SET 
                path = ($1),
                name = ($2)
                WHERE id = ($3)`


             const values =[

                path,
                filename,
                id

             ]   

              return db.query(query, values)  

        } catch (error) {
            console.error(error)
        }

    },

    path(id){

        console.log('id para o path', id)
        return db.query(`SELECT path FROM files WHERE id=$1`, [id])


    },


    delete(id){
        console.log('files no banco', id)
        
        try {
            return db.query(`DELETE FROM files 
                            WHERE id= $1`, [id])
        } catch (error) {
            console.error(error)
        }
    }
    

}