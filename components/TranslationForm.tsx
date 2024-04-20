"use client";

import { TranslationLanguage } from "@/app/translate/page";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import translate from "@/actions/translate";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import { Button } from "./ui/button";
import { Volume2Icon } from "lucide-react";
import Recorder from "./Recorder";

const initialState = {
  inputLanguage: "auto",
  input: "",
  outputLanguage: "",
  output: "",
};

export type State = typeof initialState;

function TranslationForm({ languages }: { languages: TranslationLanguage }) {
  const [state, formAction] = useFormState(translate, initialState);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const playAudio = async () => {
    const synth = window.speechSynthesis;

    if (!synth || !output) return;

    const wordToSay = new SpeechSynthesisUtterance(output);

    synth.speak(wordToSay);
  };

  const uploadAudio = async (blob: Blob) => {
    const mimeType = "audio/webm";

    const file = new File([blob], mimeType, { type: mimeType });

    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("/transcribeAudio", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.text.trim().length > 0) {
      setInput(data.text);
    }
  };

  useEffect(() => {
    if (input.trim().length === 0) return;
    const delayDebounce = setTimeout(() => {
      // submit the form after 1sec
      submitButtonRef.current?.click();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  useEffect(() => {
    if (state.output) {
      setOutput(state.output);
    }
  }, [state]);

  return (
    <div className="">
      <form action={formAction}>
        <div className="flex space-x-2">
          <div className="flex items-center group cursor-pointer border rounded-md w-fit px-3 py-2 bg-[#E7F0Fe] mb-5">
            <Image
              src="https://links.papareact.com/r9c"
              alt="logo"
              height={30}
              width={30}
            />
            <p className="text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1">
              Text
            </p>
          </div>

          <Recorder uploadAudio={uploadAudio} />
        </div>

        <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          <div className="flex-1 space-y-2">
            <Select name="inputLanguage" defaultValue="auto">
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Want us to figure it out?</SelectLabel>

                  <SelectItem key="auto" value="auto">
                    Auto-Detection
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              className="min-h-32"
              placeholder="Type your message here."
              name="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Select name="outputLanguage" defaultValue="es">
                <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Want us to figure it out?</SelectLabel>

                    <SelectItem key="auto" value="auto">
                      Auto-Detection
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {Object.entries(languages.translation).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                type="button"
                onClick={playAudio}
                disabled={!output}
              >
                <Volume2Icon
                  size={24}
                  className="text-blue-500 cursor-pointer disabled:cursor-not-allowed"
                />
              </Button>
            </div>
            <Textarea
              className="min-h-32"
              placeholder="Type your message here."
              name="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-5 justify-end flex">
          <SubmitButton disabled={!input} />
          <button className="" type="submit" ref={submitButtonRef} hidden />
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
