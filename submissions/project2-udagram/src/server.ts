import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, tempDirectory} from './util/util';
import fs from 'fs';
import {Request, Response} from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // Filtered Image Endpoint
  // Processes an image with a greyscale filter, then displays it
  app.get("/filteredimage", async(req:Request,res:Response) => {
    let {image_url} = req.query;

    if(!image_url){
      res.status(422).send("An image URL is required: /filteredimage?image_url={{url}}");
    }
    else {
      await filterImageFromURL(image_url)
        .then(image => {
          res.status(200).sendFile(image, (sendError) => {
            if(sendError) {
              console.warn(`Could not send the file in the response | ${sendError}`);
            }
            else {
              fs.readdir( tempDirectory, (readError, tempFiles) => {
                let imageFiles:Array<string> = [];
      
                if(readError) {
                  console.warn(`Could not read images from temp directory | ${readError}`);
                }
                else {
                  tempFiles.map(file => {
                    imageFiles.push(`${tempDirectory}/${file}`);
                  });
                  deleteLocalFiles( imageFiles );
                }
              })
            }
          });
        })
        .catch(error => {
          console.warn(error);
          res.sendStatus(404);
        });
    }
  });


  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req:Request, res:Response ) => {
    res.send("Instead, you should try GET /filteredimage?image_url={{url}}");
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();