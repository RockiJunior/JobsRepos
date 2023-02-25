import { ApiProperty } from '@nestjs/swagger';

export class PartnerResponseDTO {
  @ApiProperty()
  private readonly photo: string;

  @ApiProperty()
  private readonly name: string;

  @ApiProperty()
  private readonly signature: string;

  @ApiProperty()
  private readonly folio: string;

  @ApiProperty()
  private readonly auth_signature: string;

  @ApiProperty()
  private readonly path_qr: string;

  @ApiProperty()
  private readonly alphanumeric: string;

  @ApiProperty()
  private readonly consent: string;

  constructor(
    photo: string,
    name: string,
    signature: string,
    folio: string,
    auth_signature: string,
    path_qr : string,
    alphanumeric: string,
    consent: string,
  ) {
    this.photo = photo;
    this.name = name;
    this.signature = signature;
    this.folio = folio;
    this.auth_signature = auth_signature;
    this.path_qr = path_qr;
    this.alphanumeric = alphanumeric;
    this.consent = consent;
  }
}
