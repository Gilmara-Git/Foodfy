const { dateInTimeStamp } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {

    all(filter) {
      try {
        let filterQuery = "";
        let query = `
          SELECT recipes.*, files.path, chefs.name AS recipe_author
          FROM recipes  
          LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
          LEFT JOIN files ON (files.id = recipe_files.file_id)
          LEFT JOIN chefs ON(recipes.chef_id =  chefs.id)
  
  `;

        if (filter) {
                  filterQuery = `
          WHERE recipes.title ILIKE '%${filter}%'`;
        }

        query = ` 
          SELECT recipes.*, files.path, chefs.name AS recipe_author
          FROM recipes  
          LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
          LEFT JOIN files ON (files.id = recipe_files.file_id)
          LEFT JOIN chefs ON(recipes.chef_id =  chefs.id)  
          ${filterQuery}`;

        return db.query(`

          ${query}
          GROUP BY recipes.id, files.id, recipe_files.id, chefs.name
          ORDER BY chefs.name`);

      } catch (error) {
        console.error(error);
      }
    },

    allChefsSelectOne() {
      try {

        return db.query(`
          SELECT id, name 
          FROM chefs ORDER BY chefs.name`);

      } catch (error) {
        console.error(error);
      }
    },

    create(data) {
      try {
        const query = `INSERT INTO recipes (
          chef_id,
          title,
          ingredients,
          steps,
          information,
          created_at                                                  
          ) VALUES ( $1, $2, $3, $4, $5, $6)
          RETURNING id`;

        const values = [
          data.recipe_author_id,
          data.recipe_title,
          data.ingredients,
          data.steps,
          data.add_information,
          dateInTimeStamp(Date.now()).iso,
        ];

        return db.query(query, values);
      } catch (error) {
        console.error(error);
      }
    },

    find(id) {
      //console.log(id)
      try {
        return db.query(
          `SELECT recipes.*, chefs.name AS recipe_author
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id =chefs.id)
            WHERE recipes.id = $1
            GROUP BY recipes.id, chefs.id      
  `,
          [id]
        );
      } catch (error) {
        console.error(error);
      }
    },

    update(data) {

      try {
      const query = `UPDATE recipes SET 
        title=($1),
        information=($2),
        chef_id=($3),
        steps=($4),
        ingredients=($5)
        WHERE id = ($6)

  `;
      const values = [

        data.recipe_title,
        data.add_information,
        data.recipe_author_id,
        data.steps,
        data.ingredients,
        data.id,

      ];

    return db.query(query, values);

  } catch (error) {
    console.error(error);
  }

    },

    delete(id) {

      try {
        
        db.query(
          `
    DELETE FROM recipes
    WHERE id = $1 `,
          [id]);
          
      } catch (error) {
        console.error(error);
      }
    
    },

    paginate(params) {
      const { filter, limit, offset } = params;
      //console.log(filter)

      try {

      let filterQuery = "",
        query = "",
        totalQuery = `(SELECT COUNT(*)
        FROM recipes) AS total`;

      if (filter) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
  `;

        totalQuery = ` (SELECT COUNT(*) 
        FROM recipes
        ${filterQuery}) AS total`;
      }

      query = ` 
        SELECT recipes.*, ${totalQuery}, files.path, chefs.name AS recipe_author
        FROM recipes
        LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
        LEFT JOIN files ON (files.id = recipe_files.file_id)
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        GROUP BY recipes.id, files.id, recipe_files.id, chefs.name
        ORDER BY chefs.name
        LIMIT $1
        OFFSET $2`;

      return db.query(query, [limit, offset]);
                
    } catch (error) {
      console.error(error);
    }

    },
    
};
