import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsStrongPassword,
  IsUrl,
  IsMongoId,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateEntryPayload {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsStrongPassword({ minLength: 5 })
  password: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsIn(['active', 'expired'])
  status: 'active' | 'expired';
}

export class ChangeCategoryPayload {
  @IsMongoId()
  oldCategoryId: string;

  @IsMongoId()
  newCategoryId: string;
}

export class CategoryIdInQuery {
  @IsMongoId()
  categoryId: string;
}

export class EditEntryPayload {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsMongoId()
  category: string;

  @IsOptional()
  @IsIn(['active', 'expired'])
  status: 'active' | 'expired';
}
