import { RequireTenant } from "@/utils/decorators/auth.decorator";
import { ApiDomainHeader } from "@/utils/decorators/utils.decorator";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@RequireTenant()
@ApiDomainHeader()
@ApiTags('Commerce / Payments')
@Controller('payments')
export class PaymentController {

}