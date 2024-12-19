import { CommandSay } from "./commands/CommadSay";
import Command from "./commands/Command";
import { CommandAI } from "./commands/CommandAI";
import { CommandMenu } from "./commands/CommandMenu";

const commands: Command[] = [
    new CommandSay(),
    new CommandMenu(),
    new CommandAI()
];

export default commands