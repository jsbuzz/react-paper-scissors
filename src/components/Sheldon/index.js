import Connect from "../../react-signal";
import { Sheldon } from "./Sheldon";

export default Connect(Sheldon, ({ sheldonState }) => ({ sheldonState }));
