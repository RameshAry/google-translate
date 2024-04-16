import TranslationForm from "@/components/TranslationForm";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export type TranslationLanguage = {
  translation: {
    [key: string]: {
      name: string;
      nativeName: string;
      dir: "ltr" | "rtl";
    };
  };
};

async function Translate() {
  auth().protect();

  const { userId } = auth();

  if (!userId) throw new Error("user is not logged in!");

  const response = await fetch(
    "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0",
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );
  const languages = (await response.json()) as TranslationLanguage;

  return (
    <div>
      <TranslationForm languages={languages} />

      {/* Translation History */}
    </div>
  );
}

export default Translate;
