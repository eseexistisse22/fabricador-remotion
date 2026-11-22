// GERADO por scripts/registrar_videos_auto.mjs — não editar à mão.
import V_AutoAlexandria from "./AutoAlexandria.json";
import V_AutoAlexandriaE from "./AutoAlexandriaE.json";
import V_AutoEgito from "./AutoEgito.json";
import V_AutoVikings from "./AutoVikings.json";
export type VideoAutoDados = { id: string; audio: string; duracao: number; cenas: any[]; caps: any[] };
export const VIDEOS_AUTO: VideoAutoDados[] = [V_AutoAlexandria, V_AutoAlexandriaE, V_AutoEgito, V_AutoVikings] as VideoAutoDados[];
