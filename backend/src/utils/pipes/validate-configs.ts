import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodDto } from "nestjs-zod";
import { ZodError } from "zod";

@Injectable()
export class ZodValidationPipeConfig implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata) {
        const schema = (metadata.metatype as ZodDto)?.schema;

        // không phải ZodDto thì bỏ qua
        if (!schema) return value;

        try {
            const parsedValue = schema.parse(value);
            return parsedValue;
        } catch (error) {
            let message: string = 'Validation failed'

            if (error instanceof ZodError) {
                message = `${error.issues[0].path} | ${error.issues[0].message}`
            }

            throw new BadRequestException(message);
        }
    }
}