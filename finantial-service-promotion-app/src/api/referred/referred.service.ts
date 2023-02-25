import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Exceptions
import { NotFoundException } from '../../config/exceptions/not.found.exception';
import { EXCEPTION_CODES } from '../../config/exceptions/codes/exception.codes';

//DTO´s
import { ReferredRegisterDTO } from './dto/referred.register.dto';
import { ReferredResponseDTO } from './dto/referred.response.dto';
import { PartnerResponseDTO } from './dto/partner.response.dto';
import { ReferredFindDTO } from './dto/referred.find.dto';
//Schemas
import { ReferredEntity } from '../../common/database_entities/referred.entity';
import { Partner } from '../../common/database_entities/partner.entity';
import { PartnerFile } from 'src/common/database_entities/partnerFile.entity';
//Utils
import config from '../../config';
import { TotalCoursesResponseDTO } from './dto/total.courses.response.dto';
import { EnumCoursesStatus, AsociadoStatus } from '../../common/constants';
import { Length } from 'class-validator';
import { CourseToPartner } from '../../common/database_entities/coursePartner.entity';
@Injectable()
export class ReferredService {
  constructor(
    @InjectRepository(ReferredEntity) private readonly referredModel: Repository<ReferredEntity>,
    @InjectRepository(PartnerFile) private partnerFileRepository: Repository<PartnerFile>,
    @InjectRepository(Partner) private partnerRepository: Repository<Partner>,
  ) {}

  /**
   * Register referred
   * @return {*}  {Promise<ReferredResponseDTO>}
   * @memberof ReferredService
   */
  async registerReferred(referredDTO): Promise<void> {
    let referredRegisterDTO = new ReferredRegisterDTO();
    referredRegisterDTO.partner = await this.partnerRepository.findOne(referredDTO.partner);
    referredRegisterDTO.referred = await this.partnerRepository.findOne(referredDTO.referred);

    const newStatement = await this.referredModel.save(this.referredModel.create(referredRegisterDTO));
  }

  /**
   * Get referred list
   * @param {Partner} partner
   * @return {*}  {Promise<ReferredResponseDTO[]>}
   * @memberof ReferredService
   */
  async listReferred(partner: Partner): Promise<ReferredResponseDTO[]> {
    const referred = await this.referredModel.find({
      relations: ['referred', 'partner'],
      where: { partner: partner },
    });
    const referredList = referred.filter(el => el.referred.status === AsociadoStatus.ACTIVE && el.isDeleted !== true);

    const response: ReferredResponseDTO[] = [];
    for (const referredItem of referredList) {
      response.push(
        new ReferredResponseDTO(
          referredItem.referred.id,
          referredItem.referred.name + ' ' + referredItem.referred.lastName ||
            undefined + ' ' + referredItem.referred.lastName ||
            undefined + ' ' + referredItem.referred.motherLastName ||
            undefined,
        ),
      );
    }
    return response;
  }

  /**
   * Get referred data by logged user
   * @param {ReferredRegisterDTO} referredRegisterDTO
   * @return {*}  {Promise<ReferredResponseDTO>}
   * @memberof ReferredService
   *
   */
  async getAcreditationData(partner: Partner): Promise<PartnerResponseDTO> {
    //Get photo and signature from logged user
    const files = await this.partnerFileRepository.find({ partnerId: partner.id });
    let signature = files.filter(item => item.type == 'signature');
    let photo = files.filter(item => item.type == 'profilePhoto');
    const signature_path = signature[0] ? signature[0].path : undefined;
    const photo_path = photo[0] ? photo[0].path : undefined;

    if (!partner) {
      throw new NotFoundException(EXCEPTION_CODES.USER.NOT_FOUND_USER, 'userNotFound');
    }
    const { HOST } = process.env;
    const response = new PartnerResponseDTO(
      `${config().filesHost}/${photo_path}`,
      partner.name + ' ' + partner.lastName + ' ' + partner.motherLastName,
      `${config().filesHost}/${signature_path}`,
      partner.folio,
      `${HOST}auth_firm.png`,
      partner.alphanumeric,
      partner.alphanumeric,
      `${config().filesHost}/consentimiento.pdf`,
    );

    return response;
  }

  /**
   * Get todo courses network list
   * @param {Partner} partner
   * @return {*}  {Promise<TotalCoursesResponseDTO>}
   * @memberof ReferredService
   *
   */
  async getNetworkcourses(partner: Partner): Promise<TotalCoursesResponseDTO> {
    let data = {
      news_pendings: 0,
      news_aproved: 0,
      total_pendings: 0,
      total_aproved: 0,
    };
    const referredList = await this.referredModel.find({
      where: { partner: partner },
      relations: ['referred', 'referred.courseToPartner', 'referred.courseToPartner.course'],
    });

    const today = new Date();
    const weekDate = new Date();
    const current_month = today.getMonth() + 1;
    const dateStart = new Date(weekDate.setTime(today.getTime() - 15 * 24 * 3600000));
    const dateEnd = today;

    // si existe evaluationDate y el status es igual a 1, entonces, va a los aprobados.
    // despues filtrar si son nuevos o viejos..

    if (referredList.length > 0) {
      const newsApproved = () => {
        const filteredByDate = referredList.map(el =>
          el.referred.courseToPartner.filter(
            // si existe evaluationDate y la fecha corresponde a los ultimos 15 dias, y el mes coincide...
            // es porque es un aprovado actual, entonces lo agrega a la lista (array)
            item =>
              item.evaluationDate &&
              item.evaluationDate >= dateStart &&
              item.evaluationDate <= dateEnd &&
              dateStart.getMonth() + 1 == current_month,
          ),
        );
        const withOutEmptyArr = filteredByDate.filter(el => el.length !== 0);
        let newsApproved = [];
        withOutEmptyArr.map(i => {
          newsApproved.push(i.filter(item => item.status == EnumCoursesStatus.APPROVED));
        });

        return newsApproved.filter(el => el.length !== 0).length;
      };

      const newsPending = () => {
        const filteredByDate = referredList.map(el =>
          el.referred.courseToPartner.filter(
            item =>
              item.evaluationDate >= dateStart &&
              item.evaluationDate <= dateEnd &&
              dateStart.getMonth() + 1 == current_month,
          ),
        );
        const withOutEmptyArr = filteredByDate.filter(el => el.length !== 0);
        let newsPending = [];
        withOutEmptyArr.map(i => {
          newsPending.push(i.filter(item => item.status == EnumCoursesStatus.PENDING));
        });
        return newsPending.filter(el => el.length !== 0).length;
      };

      const totalApproveds = () => {
        const filteredWithOutDate = referredList.map(el =>
          el.referred.courseToPartner.filter(item => item.status == EnumCoursesStatus.APPROVED),
        );
        const withOutEmptyArr = filteredWithOutDate.filter(el => el.length !== 0);
        return withOutEmptyArr.length;
      };

      const totalPendings = () => {
        const filteredWithOutDate = referredList.map(el =>
          el.referred.courseToPartner.filter(item => item.status == EnumCoursesStatus.PENDING),
        );
        const withOutEmptyArr = filteredWithOutDate.filter(el => el.length !== 0);
        return withOutEmptyArr.length;
      };

      return new TotalCoursesResponseDTO(
        dateStart,
        dateEnd,
        (data.news_pendings = newsPending()),
        (data.news_aproved = newsApproved()),
        (data.total_pendings = totalPendings()),
        (data.total_aproved = totalApproveds()),
        // (data.news_pendings = 0),
        // (data.news_aproved = 0),
        // (data.total_pendings = 0),
        // (data.total_aproved = 0),
      );
    } else {
      return new TotalCoursesResponseDTO(
        dateStart,
        dateEnd,
        (data.news_pendings = 0),
        (data.news_aproved = 0),
        (data.total_pendings = 0),
        (data.total_aproved = 0),
      );
    }
  }

  /**
   * Delete a business type
   * @param {string} referredId
   * @return {*}  {Promise<void>}
   * @memberof ReferredService
   */
  async deleteReferred(referredId: string): Promise<void> {
    const referredFind = await this.referredModel.findOne(referredId);

    if (!referredFind) {
      throw new NotFoundException(EXCEPTION_CODES.REFERRED.NOT_FOUND_REFERRED, 'referredNotFound');
    }

    await this.referredModel.delete(referredId);
  }
}
