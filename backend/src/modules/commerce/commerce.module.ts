import { Module } from "@nestjs/common";
import { OrderService } from "./services/order-service";

@Module({
    controllers: [],
    providers: [OrderService]
})
export class CommerceModule{}