const PhotosUpload = {
    input: "",
    uploadLimit: 5 ,
    photosPreview : document.querySelector('#photos-preview'),
    files: [],

    handleFileInput(event){
        
        const { files : fileList} = event.target;
        // console.log(event)
        // console.log(fileList)
        console.log(files)

        if(PhotosUpload.hasLimit(event)) { return true;}
        
        
        Array.from(fileList).forEach(file => {
            const reader =  new FileReader();

            reader.readAsDataURL(file);

            reader.onload = ()=>{
                const image = new Image();
                image.src = String(reader.result);
                //console.log(image.src)

                const div = PhotosUpload.getContainer(image);
                PhotosUpload.photosPreview.appendChild(div);

                PhotosUpload.files.push(file);
                PhotosUpload.input.files = PhotosUpload.getAllFiles();
                

            }
        })

    },

    getContainer(image){

        const div = document.createElement('div');
                div.classList.add('photo')
                div.onclick = PhotosUpload.deletePhotosOnFrontEnd;
                div.appendChild(image)

                div.appendChild(PhotosUpload.deleteButton());
                return div;
    },

    getAllFiles(){

        const dataTransfer =  new ClipboardEvent("").clipboardData || new DataTransfer();

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        //console.log(dataTransfer.files)
        return dataTransfer.files

    },

    deleteButton(){

       const i =  document.createElement('i');
        i.classList.add('material-icons');
        i.innerHTML = "delete_forever"; 
        return i;
    },

    deletePhotosOnFrontEnd(event){
        
        const { photosPreview } = PhotosUpload;
        
        const photoDiv = event.target.parentNode; //<i>  - parentNode - <div'photo'>
        const photosArray = Array.from(photosPreview.children);

        const index = photosArray.indexOf(photoDiv);
        PhotosUpload.files.splice(index, 1); // removing from array that is replacing the input.files (event.target)
        PhotosUpload.input.files = PhotosUpload.getAllFiles(); 

        photoDiv.remove(); 


    },

    deletePhotosOnDbBySendingImagesId(event){
       
        const photoDiv = event.target.parentNode;
        let removedImagesIds = document.querySelector('input[name="removed_images_ids"]')
            

           if(photoDiv.id){
            removedImagesIds.value += `${photoDiv.id},`; 
           }
                
            console.log(removedImagesIds)         
            photoDiv.remove();
        
    },
    

    hasLimit(event){
        
        const { files : fileList} = event.target;
        const { uploadLimit , photosPreview} = PhotosUpload;

        if(fileList.length > uploadLimit) {            
            alert(`Por favor envie até ${uploadLimit} fotos.`)
            event.preventDefault(); 
            return true;

        }

        const divPhotos = [];
      
        photosPreview.childNodes.forEach(item =>{
            if(item.classList && item.classList.value === 'photo') {
                divPhotos.push(item);
                                
            }
            
        })
        //console.log(divPhotos.length)

         const totalPhotos = fileList.length + divPhotos.length;   
            if(totalPhotos > uploadLimit){
                alert(`Você atingiu mais de ${uploadLimit} fotos.`)
                eventPreventDefault();
                return true;
         }

            return false;        
    }
}

const GalleryPhotos = {

    sendMetoHighlight(event){
    const highlightImg = document.querySelector('.gallery-highlight img')
    //console.log(highlightImg)
    // console.log(highlightImg.src)
    
    const clickedPhoto = event.target;
    
    const smallGallery =  document.querySelectorAll('.small-gallery img')
    for (let one of smallGallery){
        one.classList.remove('active')
    }
    clickedPhoto.classList.add('active')    
       
    highlightImg.src = clickedPhoto.src;
    // console.log(highlightImg.src)
    // console.log(clickedPhoto.src)

    }


   
}

// Chef Avatar photo input and photo Show Avatar on the edit page

const ChefAvatar = {

    inputField : document.querySelector('#photos-input'),
    uploadLimit: 1,
    showAvatar: document.querySelector('.show-avatar'),
    filesFromInput: [],
    
    

    handleAvatar(event){
        const {files : fileList} = event.target;
                    
       if(ChefAvatar.hasLimit(event)) return true; 
        
        Array.from(fileList).forEach(file => { 
        
            const reader =  new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = () =>{                
            const image = new Image();
            image.src = String(reader.result);
            
            const  divImage = ChefAvatar.createDivImage(image);
            ChefAvatar.showAvatar.appendChild(divImage)
            
            //getting files from input to pass to datatransfer
            ChefAvatar.filesFromInput.push(file)
         
            //ChefAvatar.input.files was returning undefined  - This is to replace input.files from browser with of Array
            ChefAvatar.inputField.files = ChefAvatar.transferedFiles();
            //console.log(ChefAvatar.inputField.files)    
            }
         
        })
              
    }, 

    transferedFiles(){

        const { filesFromInput } = ChefAvatar;
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

        filesFromInput.forEach(file=>dataTransfer.items.add(file)) 
        return dataTransfer.files 

    },

    createDivImage(image){

        const divImage = document.createElement('div')
        divImage.classList.add('photo')
        divImage.onclick = ChefAvatar.removePhotosOnFrontEnd;  

        divImage.appendChild(image)
        divImage.appendChild(ChefAvatar.removeButton())
        return divImage;

    },

    removeButton(){

       const  i = document.createElement('i')
        i.classList.add('material-icons')
        i.innerHTML = 'delete_forever'
        
        return i; 
    }, 

    removePhotosOnFrontEnd(event) {            
        const { showAvatar, inputField }  = ChefAvatar; 

        const clickedPhoto = event.target.parentNode; //div class='photo'
        const showAvatarChildren =  Array.from(showAvatar.children)
        const indexOfClickedPhoto = showAvatarChildren.indexOf(clickedPhoto);
        // what is on showAvatarChildren is on filesFromInput
        ChefAvatar.filesFromInput.splice(indexOfClickedPhoto, 1);
        inputField.files = ChefAvatar.transferedFiles();
        console.log(inputField.files)

        clickedPhoto.remove();

    },

    removePhotosOnDbBySendingImagesId(event){

        const clickedPhotoContainer = event.target.parentNode;
        const divPhoto = document.querySelector('.photo')
        const removeImagesIds  = document.querySelector('input[name="removed_image_id"]')

        if(divPhoto.id){

            removeImagesIds.value += `${divPhoto.id}`
        }
        console.log('photo id',removeImagesIds)
        clickedPhotoContainer.remove();
    },  

    hasLimit(event){
        const {files : fileList} = event.target
        const {uploadLimit, showAvatar } = ChefAvatar;
        

        if(fileList.length > uploadLimit){            
            alert(`Please send max of ${uploadLimit} image.`)
            event.PreventDefault();
            return true; 
        }


        const photosOnShowAvatar = [];

        showAvatar.childNodes.forEach(child=>{

            if(child.classList && child.classList.value === 'photo') {
                photosOnShowAvatar.push(child);
            }
            })

        const totalPhotos = photosOnShowAvatar.length + fileList.length;
        if(totalPhotos > uploadLimit){
            alert(`You have reached more than ${uploadLimit}, which is the number of allowed photos.`)
            event.preventDefault();
            return true;
        }

            return false; 
    }


}

