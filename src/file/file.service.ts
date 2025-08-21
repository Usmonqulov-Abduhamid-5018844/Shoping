import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlink } from 'fs';
import { resolve, join } from 'path';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class FileService {
  private readonly filePath = join(process.cwd(), 'uploads');

  constructor() {

    if (!existsSync(this.filePath)) {
      mkdirSync(this.filePath, { recursive: true });
    }
  }

  async existFile(filename: string): Promise<boolean> {
    try {
      const file = resolve(this.filePath, filename);
      return existsSync(file);
    } catch (error) {
      throw catchError(error);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const file = resolve(this.filePath, filename);
      if (!existsSync(file)) {
        throw new BadRequestException(`File does not exist: ${filename}`);
      }
      await new Promise<void>((res, rej) => {
        unlink(file, (err) => {
          if (err) rej(err);
          res();
        });
      });
    } catch (error) {
      return catchError(error);
    }
  }
}
