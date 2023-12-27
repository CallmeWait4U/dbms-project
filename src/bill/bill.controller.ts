import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'libs/auth.guard';
import { GetUser } from 'libs/getuser.decorator';
import { BillService } from './bill.service';
import { CreateBillDTO } from './dto/create.bill.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async CreateBill(
    @Body() body: CreateBillDTO,
    @GetUser() user: { id: string; username: string },
  ) {
    await this.billService.createBill(body, user.id);
  }

  @UseGuards(AuthGuard)
  @Get('getList')
  async GetBillList(
    @GetUser() user: { id: string; username: string },
    @Query() id: string,
  ) {
    return await this.billService.getBillList(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('getDetail')
  async GetBillDetail(@Query() id: string) {
    return await this.billService.getBillDetail(id);
  }
}
