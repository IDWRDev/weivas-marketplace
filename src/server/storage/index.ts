export type UploadedFile={url:string;key:string;fileName:string;mimeType:string;size:number};
export interface StorageService{upload(file:File,scope:"seller-document"|"store-logo"|"store-banner"|"product-image"):Promise<UploadedFile>;remove(key:string):Promise<void>}
export const allowedUpload=(file:{mimeType:string;size:number},types:string[],maxBytes:number)=>types.includes(file.mimeType)&&file.size>0&&file.size<=maxBytes;
