// Pagination - PUt this in a function 

function paginate(selectedPage, totalPages){
    console.log(selectedPage)
    console.log(totalPages)
    let 
        pages = [], 
        lastShownPage
    
        //[1,..11,12,13,14,15..,20]
      
    for (let currentPage = 1; currentPage <=totalPages; currentPage++){
    
        const firstAndLastPages = currentPage == 1  || currentPage == totalPages
        const beforeSelectedPage = currentPage >= selectedPage - 2
        const afterSelectedPage = currentPage <= selectedPage + 2 
    
       
          if(firstAndLastPages || beforeSelectedPage && afterSelectedPage ) {       
            
            if(lastShownPage && currentPage - lastShownPage>2 ){
              pages.push("...")
    
            }
    
            if(lastShownPage && currentPage - lastShownPage==2 ){
              pages.push(lastShownPage + 1)
    
            }
         
            pages.push(currentPage) 
            lastShownPage = currentPage
                
          }
    
        }
          return pages
    
    }
    
    pagination = document.querySelector(".pagination")
    
    const actualPage = +pagination.dataset.page
    const totalOfPages = +pagination.dataset.total
    const filter = pagination.dataset.filter
    const pages = paginate(actualPage, totalOfPages)
    
    console.log(pages)
    
    let elements = ""
    
    for (let page of pages){
    
      if (String(page).includes("...")){
    
        elements += `<span>${page}</span>`
    
      } else {
    
        
      if (filter) { 
    
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>` // filter was added here, so when user changes page, filter remains 
      
      } else {
    
        elements += `<a href="?page=${page}">${page}</a>`
      }
      }
        pagination.innerHTML = elements
    
    }
  
  
  