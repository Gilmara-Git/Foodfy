const db = require("../../config/db");
const fs = require('fs');

module.exports = {

find(id){
    try {
    return db.query(`SELECT * FROM 
        
        recipe_files WHERE recipe_id =$1`, [id])

    } catch (error) {
        console.error(error);
    }
},
create(file_id, recipe_id){

    try {
      const query = `
                INSERT INTO recipe_files (
                    
                    file_id, 
                    recipe_id
                    )

                    VALUES ($1, $2)
                    RETURNING id
                    `

    const values = [file_id, recipe_id]


    return db.query(query, values)
    
    } catch (error) {
        console.error(error);
    }

}, 
// async delete(id){
//     console.log('linha recipe_file', id)
    
//     try {
//          let result = await db.query (`SELECT file_id FROM recipe_files 
//          WHERE id = $1`, [id])
        
//         const imageId = result.rows[0];
//         //console.log(imageId.file_id)

//         result = await db.query(`SELECT path FROM files WHERE files.id = $1`, [imageId.file_id] )
//          const file = result.rows[0]
//          //console.log(file.path)

//          fs.unlinkSync(file.path)
        

//         await db.query(`DELETE from recipe_files WHERE id=$1`, [id])

//         await db.query(`DELETE FROM files WHERE id=$1`, [imageId.file_id])   

//     } catch (error) {
//         console.error(error);
//     }
// }, 


}