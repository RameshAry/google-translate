'use server'

import { State } from "@/components/TranslationForm";
import { addOrUpdateUser } from "@/mangodb/models/User";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { v4 } from "uuid";

async function translate(prevState: State, formData: FormData) {
    auth().protect();
    const { userId } = auth();
    if (!userId) throw new Error("use not found!");

    const rawFormData = {
        input: formData.get('input') as string,
        inputLanguage: formData.get('inputLanguage') as string,
        output: formData.get('output') as string,
        outputLanguage: formData.get('outputLanguage') as string
    }

    // request to the Azure translator api

    const response = await axios({
        baseURL: process.env.AZURE_TEXT_TRANSLATION,
        url: 'translate',
        method: 'POST',
        headers: {
            "Ocp-Apim-Subscription-Key": process.env.AZURE_TEXT_TRANSLATION_KEY!,
            "Ocp-Apim-Subscription-Region": process.env.AZURE_TEXT_LOCATION,
            "Content-Type": "application/json",
            'X-ClientTraceId': v4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': rawFormData.inputLanguage === 'auto' ? null : rawFormData.inputLanguage,
            'to': rawFormData.outputLanguage
        },
        data: [{
            'text': rawFormData.input
        }],
        responseType: 'json'

    });

    const data = response.data;
    if (data.error) {
        console.log(`Error ${data.error.code}: ${data.error.message}`)
    }

    // push to mangoDB
    if (rawFormData.inputLanguage === 'auto') {
        rawFormData.inputLanguage = data[0].detectedLanguage.language;
    }

    try {
        const translation = {
            to: rawFormData.outputLanguage,
            from: rawFormData.inputLanguage,
            fromText: rawFormData.input,
            toText: data[0].translations[0].text
        }
        addOrUpdateUser(userId, translation)
        
    } catch (err) {
        console.log("Error adding translation to use: ", err)
    }

    revalidateTag('translationHistory');

    return {
        ...prevState, 
        output: data[0].translations[0].text,
    }
        

}

export default translate;