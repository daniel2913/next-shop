import { Schema } from 'mongoose';
import { BrandDefinition, IBrand } from '../dataTypes/Brand';

export const Brand = new Schema<IBrand>(BrandDefinition)