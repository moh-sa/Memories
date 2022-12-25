import { v2 as cloudinary } from "cloudinary";
import configs from "../../configs/cloudinary.js";

cloudinary.config(configs);

export default cloudinary.uploader;
