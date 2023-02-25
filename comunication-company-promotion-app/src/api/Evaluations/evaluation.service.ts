import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEvaluationQuestionDto } from './dto/create-evaluation-question.dto';
import { UpdateEvaluationQuestionDto } from './dto/update-evaluation-question.dto';
import { EvaluationQuestion } from './entities/evaluation-question.entity';
import { EvaluationAnswer } from './entities/evaluation-answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(EvaluationQuestion)
    private evaluationQuestionRepository: Repository<EvaluationQuestion>,

    @InjectRepository(EvaluationAnswer)
    private evaluationAnswerRepository: Repository<EvaluationAnswer>,
  ) {}

  async create(createEvaluationQuestionDto: CreateEvaluationQuestionDto) {
    // Check for mandatory input params
    if (!createEvaluationQuestionDto) {
      throw new BadRequestException('Sin datos para realizar el registro.');
    } else {
      if (!createEvaluationQuestionDto.documentType) {
        createEvaluationQuestionDto.documentType = 0;
      }
      if (this.findEvaluationByType(createEvaluationQuestionDto.documentType)) {
        throw new BadRequestException(
          'El tipo de documento ya tiene una evaluación registrada. Puede editar la ya existente o eliminarla antes de crear una nueva.',
        );
      }
      if (!createEvaluationQuestionDto.question) {
        throw new BadRequestException('El campo "pregunta" es obligatorio.');
      }
      if (createEvaluationQuestionDto.answers.length < 2) {
        throw new BadRequestException(
          'La evaluación debe contar con al menos 2 opciones de respuesta.',
        );
      }

      if (createEvaluationQuestionDto.answers.length > 4) {
        throw new BadRequestException(
          'La evaluación no puede tener más de 4 opciones de respuesta.',
        );
      }
    }
    // Creates Evaluation Question Entity and fills it
    const questionId = uuid();
    const question = this.evaluationQuestionRepository.create({
      IdEvaluationQuestion: questionId,
      QuestionName: createEvaluationQuestionDto.question,
      QuestionVideo: false,
      documentType: {
        IdDocumentType: createEvaluationQuestionDto.documentType,
      },
    });
    // Saves Evaluation Question
    await this.evaluationQuestionRepository.save(question);
    for (
      let index = 0;
      index < createEvaluationQuestionDto.answers.length;
      index++
    ) {
      const answerDto = createEvaluationQuestionDto.answers[index];
      const answerEntity = this.evaluationAnswerRepository.create({
        IdEvaluationAnswers: uuid(),
        AnswerName: answerDto.answer,
        Weight: 0,
        Priority: index + 1,
        question: {
          IdEvaluationQuestion: questionId,
        },
      });
      // Saves Evaluation Answer
      await this.evaluationAnswerRepository.save(answerEntity);
    }
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async findEvaluationByType(type: number) {
    const result = await this.evaluationQuestionRepository.find({
      where: {
        documentType: {
          IdDocumentType: type,
        },
      },
    });
    return result;
  }

  findAll() {
    return `This action returns all documents`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateEvaluationQuestionDto: UpdateEvaluationQuestionDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
