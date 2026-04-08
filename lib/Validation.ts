import { prisma } from "@/lib/prisma";


interface IValidation {
    emailConflict(email: string): Promise<void>;
    phoneNumberConflict(phoneNumber: string): Promise<void>;
    hasError(): boolean;
    getErrorMessage(): Record<string, string[]>;
    existsCategoryAndSubCategory(categoryId: number, subCategoryId: number): Promise<void>;
}


type ErrorMessage = Record<string, string[]>;

export default class Validation implements IValidation {

    private errorMessage: ErrorMessage = {};

    /**
     * @description Checks if the provided email already exists in the database. 
     * If it does, an error message is added to the errorMessage object.
     * 
     * @param email 
     */
    public async emailConflict(email: string): Promise<void> {
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { email: true }
        });

        if (existingUser) {
            this.errorMessage.email = ["This email already exists"];
        }
    }

    /**
     * @deprecated This method is currently not in use, but it can be implemented 
     * in the future to check for phone number conflicts.
     * 
     * @param phoneNumber 
     */
    public async phoneNumberConflict(phoneNumber: string): Promise<void> {
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber },
            select: { phoneNumber: true }
        });

        if (existingUser) {
            this.errorMessage.phoneNumber = ["This phone number already exists"];
        }
    }

    public async existsCategoryAndSubCategory(categoryId: number, subCategoryId: number): Promise<void> {
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId
            },
            include: {
                subCategories: true
            }
        });

        if (!category) {
            this.errorMessage.categoryId = ["Invalid category"];
        }

        if (!category?.subCategories.some(sub => sub.id === subCategoryId)) {
            this.errorMessage.subCategoryId = ["Invalid sub-category"];
        }
    }

    /**
     * @deprecated This method is currently not in use, but it can be implemented
     * 
     * @returns boolean
     */
    public hasError(): boolean {
        return Object.keys(this.errorMessage).length > 0;
    }

    /**
     * @deprecated This method is currently not in use, but it can be implemented
     * 
     * @returns ErrorMessage
     */
    public getErrorMessage(): ErrorMessage {
        return this.errorMessage;
    }
}