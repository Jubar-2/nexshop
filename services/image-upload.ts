import { ImgBBResponse } from "@/types/imgbb";

export class ImageUploadService {
  private static instance: ImageUploadService;
  private readonly apiKey: string;
  private readonly apiUrl: string = process.env.IMGBB_API_URL as string;

  private constructor() {
    const key = process.env.IMGBB_API_KEY;
    if (!key) {
      throw new Error("[IMAGE_UPLOAD_SERVICE]: Missing IMGBB_API_KEY in environment variables.");
    }
    this.apiKey = key;
  }

  /**
   * Singleton Accessor
   */
  public static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  /**
   * Main Upload Method
   * Supports: Base64 String, File Object, or Buffer
   */
  public async upload(image: File | string | Buffer): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("key", this.apiKey);

      // Handle different input types and convert to format ImgBB understands
      if (typeof image === "string") {
        // If it's already a base64 string, remove the data prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        formData.append("image", base64Data);
      } else {
        formData.append("image", image as Blob);
      }

      const response = await fetch(this.apiUrl, {
        method: "POST",
        body: formData,
      });

      const result: ImgBBResponse = await response.json();

      if (!result.success) {
        throw new Error(`ImgBB Upload Failed: Status ${result.status}`);
      }

      // Return the direct URL for storage in your database
      return result.data.url;

    } catch (error) {
      console.error("[IMAGE_UPLOAD_ERROR]:", error);
      throw new Error("Failed to upload image to storage provider.");
    }
  }
}

// Export a constant instance for easy use
export const imageUploader = ImageUploadService.getInstance();