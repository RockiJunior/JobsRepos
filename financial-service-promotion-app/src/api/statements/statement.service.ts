import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Exceptions
import { NotFoundException } from '../../config/exceptions/not.found.exception';
import { EXCEPTION_CODES } from '../../config/exceptions/codes/exception.codes';

//DTO´s
import { StatementsResponseDTO } from './dto/statement.response.dto';
import { StatementsRegisterDTO, UpdateStatementsFilesDto } from './dto/statement.register.dto';

//Schemas
import { StatementsEntity } from '../../common/database_entities/statements.entity';
//Utils
import config from '../../config';
import * as fs from 'fs';
import { EnumStatus } from 'src/common/constants';

@Injectable()
export class StatementsService {
  constructor(@InjectRepository(StatementsEntity) private readonly statementsModel: Repository<StatementsEntity>) {}

  /**
   * Register statement
   * @param {UpdateStatementsFilesDto} files
   * @param {StatementsRegisterDTO} statementsRegisterDTO
   * @return {*}  {Promise<StatementsResponseDTO>}
   * @memberof StatementsService
   */
  async createStatement(files, statementsRegisterDTO: StatementsRegisterDTO): Promise<void> {
    const response: any = [];

    const newStatement = await this.statementsModel.save(this.statementsModel.create(statementsRegisterDTO));

    if (files.pdfUrl) {
      const transformedFiles = await this.transformFiles(newStatement, files);
      await this.statementsModel.update(newStatement['id'], { pdfUrl: transformedFiles[0]['name'] });
    } else if (files.videoUrl) {
      const transformedFiles = await this.transformFiles(newStatement, files);
      await this.statementsModel.update(newStatement['id'], { videoUrl: transformedFiles[0]['name'] });
    }

    const updateStatement = await this.statementsModel.findOne(newStatement['id']);
    response.push(updateStatement);
    return response;
  }

  transformFiles(statement, files: UpdateStatementsFilesDto) {
    return Promise.all(
      Object.entries(files || []).map(async ([key, value]) => {
        const file = value.shift();
        const ext = file.originalname.split('.').pop();
        const name = `${statement.id}_.${ext}`;
        await this.renameFile(file.path, `${config().files_path}/${name}`);

        return { key: key, name: `${config().filesHost}/${name}` };
      }),
    );
  }

  renameFile(oldName, newName) {
    return new Promise((resolve, reject) => {
      return fs.rename(oldName, newName, err => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }

  /**
   * Get statements list
   * @param {StatementsFindDTO} statementsFindDTO
   * @return {*}  {Promise<StatementsResponseDTO[]>}
   * @memberof StatementsService
   */
  async listStatements(): Promise<StatementsResponseDTO[]> {
    const statementsList = await this.statementsModel.find({
      order: {
        createdAt: 'ASC',
      },
    });
    const current_date = Date.now();
    for (let statement of statementsList) {
      if (statement.validityDate.getTime() <= current_date) {
        statement.status = EnumStatus.DISABLE;
        await this.statementsModel.update(statement.id, {
          status: EnumStatus.DISABLE,
        });
      }
    }
    let response: any = [];
    response = statementsList;
    return response;
  }

  /**
   * Get statements for apps list
   * @param {StatementsFindDTO} statementsFindDTO
   * @return {*}  {Promise<StatementsResponseDTO[]>}
   * @memberof StatementsService
   */
  async statementsForApps(): Promise<StatementsResponseDTO[]> {
    let response: any = [];
    let weekly = [];
    let monthly = [];
    let datesBefore = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const statementsList = await this.statementsModel.find({
      order: {
        createdAt: 'ASC',
      },
    });
    // weeklyes
    let dates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    });
    weekly = statementsList.filter(
      el => new Date(el.createDate) > dates[dates.length - 1] && el.status === EnumStatus.ACTIVE,
    );
    monthly = statementsList.filter(
      el =>
        new Date(el.createDate) < dates[dates.length - 1] &&
        el.validityDate.getMonth() === currentMonth &&
        el.status === EnumStatus.ACTIVE,
    );
    datesBefore = statementsList.filter(
      el => el.validityDate.getMonth() !== currentMonth && el.status === EnumStatus.ACTIVE,
    );

    response = [
      {
        title: 'Esta semana',
        items: weekly,
      },
      {
        title: 'Este mes',
        items: monthly,
      },
      {
        title: 'anterior',
        items: datesBefore,
      },
    ];
    return response;
  }

  /**
   * Get statements by ID
   * @param {string} idSetting
   * @return {*}  {Promise<StatementsResponseDTO>}
   * @memberof StatementsService
   */
  async statementsByID(idSetting: string): Promise<StatementsResponseDTO> {
    const settingItem = await this.statementsModel.findOne(idSetting);

    if (!settingItem) {
      throw new NotFoundException(EXCEPTION_CODES.STATEMENTS.NOT_FOUND_STATEMENTS, 'settingNotFound ');
    }

    let response: any = {};
    response = settingItem;

    return response;
  }

  /**
   * Update a business type
   * @param {string} statementsId
   * @param {SettingDTO} settingDTO
   * @return {*}  {Promise<StatementsResponseDTO>}
   * @memberof StatementsService
   */
  async updateStatements(
    idStatement: string,
    statementsRegisterDTO: StatementsRegisterDTO,
    files,
  ): Promise<StatementsResponseDTO> {
    const statement = await this.statementsModel.findOne(idStatement);

    if (!statement) {
      throw new NotFoundException(EXCEPTION_CODES.STATEMENTS.NOT_FOUND_STATEMENTS, 'statementNotFound ');
    }

    await this.statementsModel.update(idStatement, await this.statementsModel.create(statementsRegisterDTO));

    if (files.pdfUrl) {
      const transformedFiles = await this.transformFiles(statement, files);
      await this.statementsModel.update(statement['id'], {
        pdfUrl: transformedFiles[0]['name'],
        url: null,
        videoUrl: null,
      });
    } else if (files.videoUrl) {
      const transformedFiles = await this.transformFiles(statement, files);
      await this.statementsModel.update(statement['id'], {
        videoUrl: transformedFiles[0]['name'],
        url: null,
        pdfUrl: null,
      });
    } else if (statementsRegisterDTO.url) {
      await this.statementsModel.update(statement['id'], {
        videoUrl: null,
        pdfUrl: null,
      });
    }

    const settingFind = await this.statementsModel.findOne(idStatement);

    const response: any = [];
    response.push(settingFind);

    return response;
  }

  /**
   * Delete a cms setting
   * @param {string} statementsId
   * @return {*}  {Promise<void>}
   * @memberof StatementsService
   */
  async deleteStatements(statementsId: string): Promise<void> {
    const settingFind = await this.statementsModel.findOne(statementsId);

    if (!settingFind) {
      throw new NotFoundException(EXCEPTION_CODES.STATEMENTS.NOT_FOUND_STATEMENTS, 'settingNotFound ');
    }

    await this.statementsModel.delete(statementsId);
  }

  async updateValidityDate() {
    const statementsList = await this.statementsModel.find({
      order: {
        createdAt: 'ASC',
      },
    });
    const current_date = Date.now();
    for (let statement of statementsList) {
      if (statement.validityDate.getTime() <= current_date) {
        await this.statementsModel.update(statement.id, {
          status: EnumStatus.DISABLE,
        });
      }
    }
    return { message: 'Cron update validity date.' };
  }
}
