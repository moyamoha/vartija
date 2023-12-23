import { IsMongoId } from 'class-validator';
import { SHOULD_BE_MONGO_ID } from '../constants';

export class IdInParams {
  @IsMongoId({ message: SHOULD_BE_MONGO_ID })
  id: string;
}

export class IdInQuery {
  @IsMongoId({ message: SHOULD_BE_MONGO_ID })
  id: string;
}
