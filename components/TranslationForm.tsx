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
import { useState } from "react";
import { useFormState } from "react-dom";
import translate from "@/actions/translate";

const initialState = {
  inputLanguage: "auto",
  input: "",
  outputLanguage: "",
  output: "",
};

export type State = typeof initialState;

function TranslationForm({ languages }: { languages: TranslationLanguage }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [state, formAction] = useFormState(translate, initialState);

  return (
    <div>
      <form action={formAction}>
        <div>
          <Select name="inputLanguage" defaultValue="auto">
            <SelectTrigger className="w-[280px]">
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

        <div>
          <Select name="outputLanguage" defaultValue="es">
            <SelectTrigger className="w-[280px]">
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
            name="output"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
        </div>
        <div className="">
          <button className="" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
