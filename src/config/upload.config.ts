import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export const taskImageStorage = diskStorage({
  destination: './uploads/tasks',
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    cb(null, filename);
  },
});
