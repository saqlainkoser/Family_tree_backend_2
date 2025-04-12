// import { v2 as cloudinary } from 'cloudinary';

// (async function(image) {

//     // Configuration
//     cloudinary.config({ 
        
//     });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            "https://hips.hearstapps.com/hmg-prod/images/close-up-portrait-of-cat-sitting-on-floor-royalty-free-image-1718201739.jpg?crop=0.668xw:1.00xh;0.180xw,0&resize=980:*", {
//             folder: "familyTree",
//             public_id: 'kitty',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('kitty', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('kitty', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();