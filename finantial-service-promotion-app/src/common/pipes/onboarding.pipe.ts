import { Injectable, PipeTransform } from '@nestjs/common';
import { UpdatePartnerDto } from '../../api/partners/dtos/partner.dto';

@Injectable()
export class OnboardingPipe implements PipeTransform {
  transform(data: UpdatePartnerDto) {
    if (data.clabe) {
      if (data.clabe.length === 17) {
        data.clabe = `${data.clabe}0`;
      }
      if (!data.bank) {
        data.bank = data.clabe.substring(0, 3);
      }
      if (!data.accountNumber) {
        data.accountNumber = data.clabe.substring(6, 17);
      }
    }
    return data;
  }
}
