import { RequireAuth } from '@/utils/decorators/auth.decorator';
import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@RequireAuth()
@ApiDomainHeader()
@ApiTags('Commerce / Orders')
@Controller('orders')
export class OrderController {
  constructor() {}
}
