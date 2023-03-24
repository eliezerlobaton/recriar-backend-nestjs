export interface BucketObjectDTO {
  Key: string;
  LastModified: string;
  ETag: string;
  ChecksumAlgorithm: string[];
  Size: number;
  StorageClass: string;
  Owner?: {
    DisplayName: string;
    ID: string;
  };
}
