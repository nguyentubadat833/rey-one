import { User } from "@/persistence/entities/iam.user-entity";
import { AppError } from "@/utils/errors/app.error";
import { EntityRepository } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends EntityRepository<User> {

    async verifyBaseCredential(email: string, password: string) {

        const err = new AppError('INVALID_CREDENTIAL')
        const user = await this.findOneOrFail(
            { email },
            {
                populate: ['password'],
                failHandler: () => err
            }
        )

        if (await user.verifyPassword(password)) {
            return user;
        }

        throw err;
    }

    async verifyOAuthCredential(){
        
    }
}