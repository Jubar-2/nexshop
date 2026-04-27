import { customAlphabet } from "nanoid";

const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const generateCode = customAlphabet(alphabet, 8); // 8 chars for massive collision safety