export interface CloudinaryUploadResult {
    secure_url: string;
    public_id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow additional fields for flexibility
}
