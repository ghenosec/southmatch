import type { ThemeDefinition } from "@/core/types";
import { likertPtBr } from "../shared/likert-pt-br";
import { axes } from "./axes";
import { characters } from "./characters";
import { description, id, name, texts, versions, visual } from "./config";
import { questions } from "./questions";

export const southParkTheme: ThemeDefinition = {
  id,
  name,
  description,
  locale: "pt-BR",
  versions,
  listed: true,
  visual,
  texts,
  scale: likertPtBr,
  axes,
  questions,
  characters,
};
