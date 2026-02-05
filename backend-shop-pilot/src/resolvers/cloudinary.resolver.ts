import { CloudinaryService } from '../services/cloudinary.service';

export const cloudinaryResolvers = {
  Query: {
    getUploadSignature: async () => {
      return CloudinaryService.getUploadSignature();
    },
  },
};
