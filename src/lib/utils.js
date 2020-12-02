
module.exports = {

dateInTimeStamp(timestamp) { 

    const date = new Date(timestamp)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1 
    const day = date.getUTCDate()

    return  {

        day, 
        month,
        year,
        iso: `${year}/${month}/${day}`,
        format: `${day}/${month}/${year}`
    }

},
// Ref: https://www.youtube.com/watch?v=Hr5pAAIXjkA
createRandomPassword(size){

    console.log(size)

    let password = '';

    do{
        password += Math.random().toString(36).substr(2)
        password = password.substr(0, size) // cortando a string do 0 ate o tamanho (size)

    }while(password.length < size)
        return password;
    }
   
    
}

