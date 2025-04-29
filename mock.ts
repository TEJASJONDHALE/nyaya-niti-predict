function formatCaseDate(date: Date): FormattedDateTimeString {
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // Month is 0-indexed
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const paddedMonth = month.toString().padStart(2, "0");
	const paddedDay = day.toString().padStart(2, "0");
	const paddedHours = hours.toString().padStart(2, "0");
	const paddedMinutes = minutes.toString().padStart(2, "0");
	const paddedSeconds = seconds.toString().padStart(2, "0");

	return `${year}-${paddedMonth}-${paddedDay} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}
type FormattedDateTimeString =
	`${number}-${string}-${string} ${string}:${string}:${string}`;

type LawType =
	| "IPC"
	| "CPC"
	| "Contract Law"
	| "Tort Law"
	| "NDPS Act"
	| "Property Law"
	| "Other";

type RelevantSection = {
	type: LawType;
	codes: string[]; // Array of specific sections or relevant codes
};

const allCourts = [
	"Supreme Court",
	"High Court",
	"District Court",
	"Magistrate Court",
	"Special Criminal Court",
] as const;

type Court = (typeof allCourts)[number];

const criminalSubTypes = [
	"Theft",
	"Assault",
	"Fraud",
	"Homicide",
	"Drug Possession",
] as const;

const civilSubTypes = [
	"Contract Dispute",
	"Personal Injury",
	"Property Dispute",
] as const;

namespace CaseTypes {
	export type Criminal = (typeof criminalSubTypes)[number];
	export type Civil = (typeof civilSubTypes)[number];
}

// Mapping subtypes to relevant legal sections
type SubtypeToSections = {
	[K in CaseTypes.Criminal | CaseTypes.Civil]: RelevantSection[];
};

const subtypeToSections: SubtypeToSections = {
	Theft: [{ type: "IPC", codes: ["378", "379", "380", "381", "382"] }],
	Assault: [
		{
			type: "IPC",
			codes: ["351", "352", "353", "354", "355", "356", "357", "358"],
		},
	],
	Fraud: [{ type: "IPC", codes: ["415", "416", "417", "418", "419", "420"] }],
	Homicide: [
		{ type: "IPC", codes: ["299", "300", "301", "302", "303", "304", "304A"] },
	],
	"Drug Possession": [
		{
			type: "NDPS Act",
			codes: [
				"Relevant sections of the NDPS Act depend on the specific drug and quantity",
			],
		},
		{
			type: "IPC",
			codes: [
				"Relevant sections like criminal conspiracy (e.g., 120B) might apply depending on the context",
			],
		},
	],
	"Contract Dispute": [
		{
			type: "Contract Law",
			codes: ["Relevant sections of the Indian Contract Act, 1872"],
		},
		{
			type: "CPC",
			codes: [
				"Relevant orders and sections of the Code of Civil Procedure, 1908",
			],
		},
		{ type: "Other", codes: ["Specific relief act, etc."] },
	],
	"Personal Injury": [
		{ type: "Tort Law", codes: ["Principles of negligence, etc."] },
		{
			type: "CPC",
			codes: [
				"Relevant orders and sections of the Code of Civil Procedure, 1908",
			],
		},
		{
			type: "IPC",
			codes: [
				"Sections like 279, 337, 338, 304A might apply if the injury is a result of a criminal act",
			],
		},
	],
	"Property Dispute": [
		{
			type: "Property Law",
			codes: ["Relevant acts like Transfer of Property Act, 1882"],
		},
		{
			type: "CPC",
			codes: [
				"Relevant orders and sections of the Code of Civil Procedure, 1908",
			],
		},
		{
			type: "IPC",
			codes: [
				"Sections like 425-440 (Mischief), 441-462 (Criminal Trespass) might apply",
			],
		},
	],
};

// Base type for a case
interface BaseCase {
	court: Court;
	date_of_occurrence: FormattedDateTimeString;
}

type FIRNumber = `FIR/${number}/${number}/${string}`;

// Criminal Case type
interface CriminalCase extends BaseCase {
	type: "Criminal";
	subType: CaseTypes.Criminal;
	fir_number: FIRNumber; // Added FIR number
	date_of_fir: FormattedDateTimeString; // Date of FIR is only relevant for criminal cases
	sections: RelevantSection[]; // Use the array of RelevantSection
}

// Civil Case type
interface CivilCase extends BaseCase {
	type: "Civil";
	subType: CaseTypes.Civil;
	sections: RelevantSection[];
}

function randomItem<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateFIRNumber(): FIRNumber {
	const id = Math.floor(Math.random() * 1000);
	const year = 2020 + Math.floor(Math.random() * 6);
	const station = ["CENTRAL", "SOUTH", "EAST", "WEST", "NORTH"][
		Math.floor(Math.random() * 5)
	];
	return `FIR/${id}/${year}/${station}`;
}

function randomDate(start?: Date, end?: Date): Date {
	const startTime = start?.getTime() ?? new Date(2000, 0, 1).getTime();
	const endTime = end?.getTime() ?? new Date().getTime();
	const time = startTime + Math.random() * (endTime - startTime);

	return new Date(time);
}

const generateMockCases = (
	count: number,
	dateRange: {
		start: Date;
		end: Date;
	},
) =>
	Array.from({ length: count }).map(() => {
		const isCriminal = Math.random() < 0.5;
		const court = randomItem(allCourts);
		const date_of_occurrence = randomDate(dateRange?.start, dateRange?.end);
		const formatted_date_of_occurrence = formatCaseDate(date_of_occurrence);

		if (isCriminal) {
			const subType = randomItem(criminalSubTypes);
			const fir_number = generateFIRNumber();
			const date_of_fir = randomDate(date_of_occurrence, dateRange?.end);
			const sections = subtypeToSections[subType];
			const formatted_date_of_fir = formatCaseDate(date_of_fir);

			return {
				type: "Criminal",
				court,
				date_of_occurrence: formatted_date_of_occurrence,
				subType,
				fir_number,
				date_of_fir: formatted_date_of_fir,
				sections,
			};
		}

		const subType = randomItem(civilSubTypes);
		const sections = subtypeToSections[subType];

		return {
			type: "Civil",
			court,
			date_of_occurrence: formatted_date_of_occurrence,
			subType,
			sections,
		};
	});
