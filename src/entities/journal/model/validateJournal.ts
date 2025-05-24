import { throwError } from "@/shared/error-handling";
import type {
	InstitutionSchema,
	JournalSchema,
	RecordsSchema,
} from "@/shared/journal-schema";
import {
	institutionSchema,
	journalSchema,
	recordsSchema,
} from "@/shared/journal-schema";
import { ZodError } from "zod";

export function validateJournal(data: object): JournalSchema {
	try {
		const validatedJournal = journalSchema.parse(data);
		return validatedJournal;
	} catch (e) {
		if (e instanceof ZodError) {
			throw Error(
				`Can't read a journal. Is it in SavNote format? ${JSON.stringify(
					e.errors,
				)}`,
			);
		}
		throwError(e);
	}
}
export function validateRecord(data: object): RecordsSchema {
	try {
		return recordsSchema.parse(data);
	} catch (e) {
		if (e instanceof ZodError) {
			throw Error(
				`Can't read a record. Is it in SavNote format? ${JSON.stringify(
					e.errors,
				)}`,
			);
		}
		throwError(e);
	}
}

export function validateInstitution(data: object): InstitutionSchema {
	try {
		return institutionSchema.parse(data);
	} catch (e) {
		if (e instanceof ZodError) {
			throw Error(
				`Can't read a record. Is it in SavNote format? ${JSON.stringify(
					e.errors,
				)}`,
			);
		}
		throwError(e);
	}
}
