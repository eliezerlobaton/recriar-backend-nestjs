import { BucketObjectDTO } from '../dto/bucket.object.dto';

export interface FilesServiceInterface {
  listPublicFiles(bucketName: string): Promise<BucketObjectDTO[]>;
}
