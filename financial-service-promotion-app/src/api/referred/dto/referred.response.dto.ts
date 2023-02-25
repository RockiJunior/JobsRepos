import { ApiProperty } from '@nestjs/swagger';

export class ReferredResponseDTO {
  @ApiProperty()
  private readonly id: number;

  @ApiProperty()
  private readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
