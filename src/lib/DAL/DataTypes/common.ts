import { Types } from 'mongoose';

export function defaultId(){
	return new Types.ObjectId()
}