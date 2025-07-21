import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSavatDto } from './dto/create-savat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Savat } from './model/savat.model';
import { catchError } from 'src/utils/chatchError';
import { Request } from 'express';
import { Product } from 'src/product/model/product.entity';
@Injectable()
export class SavatService {
  constructor(@InjectModel(Savat) private readonly Model: typeof Savat,
  @InjectModel(Product) private readonly ProductModel: typeof Product,
) {}

  async create(createSavatDto: CreateSavatDto, req: Request) {
    try {
      const user = req['user'];
      let product = await this.ProductModel.findByPk(createSavatDto.productId)
      if(!product){
        throw new NotFoundException("Product by id not fount")
      }
      const data = await this.Model.create({
        ...createSavatDto,
        userId: user.id,
      });
      return { Message: 'creted', statusCode: 201, data:data };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(req: Request) {
    try {
      const user = req['user'];
      const data = await this.Model.findAll({
        where: { userId: user.id },
        include: [{ model: Product }],
      });
      if (!data.length) {
        throw new NotFoundException();
      }
      return { statusCode: 200, data: data };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      const user = req["user"]
      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount by id');
      }
      if(data.dataValues.userId !== user.id){
        throw new ForbiddenException("Siz faqat o'zingizga tegishliy savatni o'chira olasiz")
      }
      return {
        message: 'Deleted',
        data: await this.Model.destroy({ where: { id } }),
      };
    } catch (error) {
      return catchError(error);
    }
  }
}