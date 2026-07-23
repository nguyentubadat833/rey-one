import z from "zod";
import { DomainDetailShema, DomainSchema } from "./domain-schema";

export type DomainView = z.infer<typeof DomainSchema>
export type DomainDetailView = z.infer<typeof DomainDetailShema>