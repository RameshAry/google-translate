import { NextRequest, NextResponse } from "next/server"; 
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";


export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    console.log(">>>>>", file);

    if (
        process.env.AZURE_API_KEY === undefined ||
        process.env.AZURE_ENDPOINT === undefined ||
        process.env.AZURE_DEPLOYMENT_NAME === undefined
    ) {
        console.error("Azure credentials not set");
        return NextResponse.json({
        error: "Azure credentials not set",
        });
    }
    
    
    if (file.size === 0) {
        return NextResponse.json({
            error: "No audio file provided",
        });
    }

    const arrayBuffer = await file.arrayBuffer();
    const audio = new Uint8Array(arrayBuffer);

    const client = new OpenAIClient(
        process.env.AZURE_ENDPOINT,
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    )
    const result = await client.getAudioTranscription(
        process.env.AZURE_DEPLOYMENT_NAME,
        audio
    );
    console.log(`Transcription: ${result.text}`)

    return NextResponse.json({ text: result.text });


}