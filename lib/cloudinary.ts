import { v2 as cloudinary } from "cloudinary";

export function cfgCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) throw new Error("CLOUDINARY_URL missing");
  cloudinary.config({ cloudinary_url: url, secure: true });
  return cloudinary;
}

export async function uploadFile(buf: Buffer, folder = "restaurant-menu") {
  const c = cfgCloudinary();
  return new Promise<string>((resolve, reject) => {
    const stream = c.uploader.upload_stream({ folder }, (err, res) => {
      if (err || !res?.secure_url) reject(err ?? new Error("Upload failed"));
      else resolve(res.secure_url);
    });
    stream.end(buf);
  });
}
