import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { SignUpSchema } from "@/lib/validations/signup";
import Validation from "@/lib/Validation";
import { ApiResponse } from "@/lib/apiResponse";

export async function POST(request: Request) {
    try {

        // Attempt to parse
        const body = await request.json().catch(() => null);

        if (!body) {
            return ApiResponse.error("Request body is empty or invalid JSON", 400);
        }

        // Validate Input using Zod
        const validation = SignUpSchema.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;;
            return ApiResponse.error("Validation failed", 400, errors);
        }

        // Extract validated data
        const { fullName, email, password, phoneNumber } = validation.data;

        const validationObject = new Validation();

        // Check if email and phone number already exists
        await Promise.all([
            validationObject.emailConflict(email),
            validationObject.phoneNumberConflict(phoneNumber)
        ]);


        // If there are any conflicts, return a 409 Conflict response with details
        if (validationObject.hasError()) {
            return ApiResponse.error(
                "Conflict error",
                409,
                validationObject.getErrorMessage()
            );
        }

        // Hash the password (Professional Salt Rounds: 12)
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await prisma.$transaction(async tx => {

            const defaultPlan = await tx.membershipPlan.findFirst({
                where: { isDefault: true }
            });

            if(!defaultPlan){
                 throw new Error("default membership plan is not found")
            }

            // Create the User in Database
            const user = await tx.user.create({
                data: {
                    fullName,
                    phoneNumber: phoneNumber.trim(),
                    email: email.trim().toLowerCase(),
                    password: hashedPassword
                },
                // Select only the fields we want to return (exclude password)
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    createdAt: true,
                }
            });

            const freelancer = await tx.freelancer.create({
                data: {
                    userId: user.id,
                    memberPlanId: defaultPlan.id
                }
            })

            return { user, freelancer }
        })

        return ApiResponse.success(result, "User created successfully", 201);

    } catch (error: unknown) {
        console.error("SIGNUP_ERROR:", error);
        return ApiResponse.fatal("Internal Server Error");
    }
}