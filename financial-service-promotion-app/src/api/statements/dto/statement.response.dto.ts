import { ApiProperty } from '@nestjs/swagger';

export class StatementsResponseDTO {
  @ApiProperty()
  private readonly id: string;

  @ApiProperty()
  private readonly name: string;

  @ApiProperty()
  private readonly status;

  @ApiProperty()
  private readonly createDate: string;

  @ApiProperty()
  private readonly validityDate: string;

  @ApiProperty()
  private readonly title: string;

  @ApiProperty()
  private readonly description: string;

  @ApiProperty()
  private readonly type: string;

  @ApiProperty()
  private readonly url: string;

  constructor(
    id: string,
    name: string,
    status: string,
    createDate: string,
    validityDate: string,
    title: string,
    description: string,
    type: string,
    url: string,
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.createDate = createDate;
    this.validityDate = validityDate;
    this.title = title;
    this.description = description;
    this.type = type;
    this.url = url;
  }
}
