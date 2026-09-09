import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file buffer to Cloudflare R2
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Destination filename
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export const uploadToR2 = async (fileBuffer, fileName, contentType) => {
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_ENDPOINT) {
    console.error('R2 Configuration missing. Falling back to local/null.');
    return null;
  }

  const bucketName = process.env.R2_BUCKET_NAME || 'rcs';

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    // Return the public URL.
    // Usually R2 uses a custom domain or the bucket URL if configured for public access.
    const publicBaseUrl = process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT.replace('https://', `https://${bucketName}.`);
    return `${publicBaseUrl}/${fileName}`;
  } catch (err) {
    console.error('R2 Upload Error:', err);
    throw err;
  }
};

export default r2Client;
