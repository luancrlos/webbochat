import { Message } from "./Message.service";

export interface User {
    name: string;
    status: boolean;
    messages?: Message[];
}