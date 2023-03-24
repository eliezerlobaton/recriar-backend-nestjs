import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { BucketObjectDTO } from './dto/bucket.object.dto';
import { FilesServiceInterface } from './interfaces/files.service.interface';

@Injectable()
export class FilesService implements FilesServiceInterface {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  async listPublicFiles(bucketName: string): Promise<BucketObjectDTO[]> {
    const params = {
      Bucket: bucketName,
    };
    return new Promise((resolve, reject) => {
      this.s3.listObjectsV2(params, function (err, data) {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(<any>data.Contents);
      });
    });
  }
}
