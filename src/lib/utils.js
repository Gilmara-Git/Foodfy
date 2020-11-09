
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


}

}