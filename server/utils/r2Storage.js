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
    // Ensure the URL starts with https://
    let publicBaseUrl = process.env.R2_PUBLIC_URL;

    // If PUBLIC_URL is missing or incorrectly set to the main domain, use the S3 API endpoint as fallback
    if (!publicBaseUrl || publicBaseUrl === 'rcs.com.np' || publicBaseUrl === 'www.rcs.com.np') {
      publicBaseUrl = process.env.R2_ENDPOINT.replace('https://', `https://${bucketName}.`);
    }

    if (!publicBaseUrl.startsWith('http')) {
      publicBaseUrl = `https://${publicBaseUrl}`;
    }

    // Clean trailing slash from base URL
    const cleanBaseUrl = publicBaseUrl.endsWith('/') ? publicBaseUrl.slice(0, -1) : publicBaseUrl;

    return `${cleanBaseUrl}/${fileName}`;
  } catch (err) {
    console.error('R2 Upload Error:', err);
    throw err;
  }
};

export default r2Client;
