import { Types } from 'mongoose';

export function defaultId(){
	return new Types.ObjectId().toString()
}
export const imageMatch = {match:/\c+\.(jpg|jpeg)/, minLength:4, maxLength:17}