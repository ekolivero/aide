'use client'
import {
    ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Textarea from "react-textarea-autosize";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TextAreaButton({
    inputRef,
    onKeyDown,
    inputValue,
    setInputValue
}: {
    inputRef: React.RefObject<HTMLTextAreaElement>;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
}) {
    return (
        <div>
            <Textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                placeholder="Type your preference here..."
                className="min-h-[60px] w-full bg-transparent placeholder:text-zinc-900 resize-none px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="absolute right-4 top-[13px] sm:right-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={inputValue === ""}
                            className="bg-transparent shadow-none text-zinc-950 rounded-full hover:bg-zinc-200"
                        >
                            <ArrowRight />
                            <span className="sr-only">
                                Send message
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}