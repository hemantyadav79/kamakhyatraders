import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

// -----------------------------------------------------------------------------
// Cloudinary config for product image uploads. The admin uploads directly from
// the browser to Cloudinary using a short-lived SIGNED signature generated here
// on the server — so the API secret never reaches the client.
// -----------------------------------------------------------------------------

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configure() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const FOLDER = 'kamakhya-traders/products';

/** Build a signature for a browser-side signed upload. */
export function createUploadSignature() {
  configure();
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: FOLDER };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );
  return {
    signature,
    timestamp,
    folder: FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

/** Delete an image by its public_id (used when a product image is replaced). */
export async function deleteImage(publicId: string): Promise<void> {
  configure();
  await cloudinary.uploader.destroy(publicId);
}
