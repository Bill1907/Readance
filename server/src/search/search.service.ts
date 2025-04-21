import { Injectable, Logger } from '@nestjs/common';
import { tavily } from '@tavily/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly tavilyClient;
  private readonly logger = new Logger(SearchService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('TAVILY_API_KEY');
    if (!apiKey) {
      this.logger.error('TAVILY_API_KEY is not set in environment variables');
    }
    this.tavilyClient = tavily({ apiKey: apiKey });
  }

  async search(query: string) {
    try {
      this.logger.log(`Performing search for query: ${query}`);

      const response = await this.tavilyClient.search(query);

      return {
        success: true,
        response,
      };
    } catch (error) {
      this.logger.error(
        `Error searching Tavily: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: error.message,
        query,
      };
    }
  }
}
