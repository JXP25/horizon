import { pointSources} from "./point";
import { roadSources } from "./road";
import { localLines } from "./line";
import { navigationSources } from "./navigation";
import { polygonSources } from "./polygon";

export const sources = [
  ...polygonSources,
  ...roadSources,
  localLines,
  ...pointSources,
  ...navigationSources,
];
