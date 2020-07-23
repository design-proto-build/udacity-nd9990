import fs from 'fs';
import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async (resolve, reject) => {
        await Jimp
            .read(inputURL)
            .then(image => {
                const outpath = '/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
                image.resize(256, 256) // resize
                .quality(65) // set JPEG quality
                .greyscale() // set greyscale
                .write(tempDirectory+outpath, ()=>{
                    resolve(tempDirectory+outpath);
                });
            })
            .catch(err => {
                reject(`Could not find: ${inputURL} | ${err}`);
            })
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

export const tempDirectory = `${__dirname}/tmp`;