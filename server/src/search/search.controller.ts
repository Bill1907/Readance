import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { SearchService } from './search.service';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class SearchQueryDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  maxResults?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeImages?: boolean;

  @IsOptional()
  @IsEnum(['basic', 'advanced'])
  searchDepth?: 'basic' | 'advanced';
}

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query(new ValidationPipe({ transform: true })) queryParams: SearchQueryDto,
  ) {
    if (!queryParams.query || queryParams.query.trim() === '') {
      throw new BadRequestException('Search query cannot be empty');
    }

    return this.searchService.search(queryParams.query);
  }
}
