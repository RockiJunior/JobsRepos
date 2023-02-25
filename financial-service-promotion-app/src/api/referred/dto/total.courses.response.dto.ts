import { ApiProperty } from '@nestjs/swagger';

export class TotalCoursesResponseDTO {
  @ApiProperty()
  private readonly dateStart: Date;

  @ApiProperty()
  private readonly dateEnd: Date;
  
  @ApiProperty()
  private readonly news_pendings: number;

  @ApiProperty()
  private readonly news_aproved: number;

  @ApiProperty()
  private readonly total_pendings: number;

  @ApiProperty()
  private readonly total_aproved: number;

  constructor(
    dateStart: Date,
    dateEnd: Date,
    news_pendings: number,
    news_aproved: number,
    total_pendings: number,
    total_aproved: number,
  ) {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.news_pendings = news_pendings;
    this.news_aproved = news_aproved;
    this.total_pendings = total_pendings;
    this.total_aproved = total_aproved;
  }
}
