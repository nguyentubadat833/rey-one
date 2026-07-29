import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PromotionService {
    constructor(
        private readonly em: EntityManager
    ){}

    createPromotion(){
        
    }
}