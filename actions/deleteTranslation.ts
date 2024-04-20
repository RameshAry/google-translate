'use server';

import { removeTranslation } from "@/mangodb/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export default async function deleteTranslation(id: string) {
    auth().protect()
    
    const { userId } = auth();
    
    const user = await removeTranslation(userId!, id);

    revalidateTag("translationHistory")

    return {
        translations: JSON.stringify(user.translations)
    }
}