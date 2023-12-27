import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'libs/database.module';
import { CreateBillDTO } from './dto/create.bill.dto';

@Injectable()
export class BillService {
  @Inject()
  private readonly prisma: DatabaseService;

  async createBill(body: CreateBillDTO, userId: string) {
    const newBill = await this.prisma.bill.create({
      data: {
        ...body,
        User: { connect: { id: userId } },
      },
    });
    return newBill;
  }

  async getBillList(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        bills: true,
      },
    });
    return user.bills.length === 0 ? [] : user.bills;
  }

  async getBillDetail(id: string) {
    return await this.prisma.bill.findFirst({ where: { id } });
  }
}
