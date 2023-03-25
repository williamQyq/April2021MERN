import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const returnImagesBucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_BUCKET_ACESS_KEY
const secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})


// // upload
// export function uploadFile(file:File):Promise<S3.ManagedUpload.SendData>{
    
//     const fileStream = fs.createReadStream(file.path)

//     const uploadParams = {
//         Bucket: returnImagesBucketName,
//         Body: fileStream,
//         key:file.filename
//     }
    
//     return s3.upload(uploadParams).promise()
// }

// //downloads

// export function getFileStream(fileKey){
//     const downloadParams = {
//         Key: fileKey,
//         Bucket: returnImagesBucketName
//     }

//     return s3.getObject(downloadParams).createReadStream()
// }