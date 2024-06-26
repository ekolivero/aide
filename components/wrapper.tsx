"use client"
import React, { useEffect, useState } from 'react';
import Tooltip from './tooltip';
import './hover.css'; // Import the CSS file
import { Textarea } from './ui/textarea';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

import { Button } from './ui/button';
import { set } from 'zod';
import { getCode } from '@/app/actions/show-code';
import { getFileSystem } from '@/app/actions/get-file-system';

const HoverHighlightWrapper = ({ children }: { children: any }) => {

    const { formRef, onKeyDown } = useEnterSubmit();


    const [isOptionPressed, setIsOptionPressed] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState(null);
    const [tooltipText, setTooltipText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [code, setCode] = useState('');
    const [inputValue, setInputValue] = useState('')

    const [modalOpen, setModalOpen] = useState(false);
    const [showCode, setShowCode] = useState(false)

    const [selectedElement, setSelectedElement] = useState(null);


    useEffect(() => {
        const handleMouseMove = (e: any) => {
            if (!isOptionPressed) return;

            const closestElement = e.target.closest('[data-vscode-file-name]');
            if (highlightedElement && highlightedElement !== closestElement) {
                highlightedElement.classList.remove('highlight-border');
                setHighlightedElement(null);
            }

            if (closestElement) {
                closestElement.classList.add('highlight-border');
                const tooltipText = closestElement.getAttribute('data-vscode-file-name');
                const parts = tooltipText.split('/');
                const elementsAfterFifthSlash = parts.slice(6);
                setHighlightedElement(closestElement);
                setTooltipText(elementsAfterFifthSlash.join('/'));
                setTooltipPosition({ x: e.pageX, y: e.pageY });
            }
        };

        const handleKeyDown = (e: any) => {
            if (e.key === 'Alt') {
                setIsOptionPressed(prev => !prev);
            }
        };

        const handleClick = async (e) => {
            if (isOptionPressed) {
                e.preventDefault()
            }
            const element = e.target.closest('.highlight-border');
            if (element) {
                const attributeValue = element.getAttribute('data-vscode-file-name');
                if (attributeValue) {
                    setModalOpen(true)
                    setIsOptionPressed(false);
                    setSelectedElement(element)
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleClick);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOptionPressed, highlightedElement]);

    useEffect(() => {
        if (!isOptionPressed) {
            document.querySelectorAll('.highlight-border').forEach((element) => {
                element.classList.remove('highlight-border');
            });
            setHighlightedElement(null);
        }
    }, [isOptionPressed]);

    return (
        <div>
            {children}
            {highlightedElement && (
                <Tooltip visible={true} text={tooltipText} position={tooltipPosition} />
            )}
            <Dialog open={modalOpen} onOpenChange={() => {
                setModalOpen(false)
                setShowCode(false)
                setCode("")
            }}>
                <DialogContent className='w-[900px]'>
                    <DialogHeader>
                        <DialogTitle>Request some changes or add a comment</DialogTitle>

                    </DialogHeader>
                    <form className="py-4 px-4" ref={formRef} onSubmit={async (e) => {
                        e.preventDefault()
                        setModalOpen(false)
                        selectedElement?.classList?.add('update-animation');
                        const attributeValue = selectedElement?.getAttribute('data-vscode-file-name');
                        // Simulate fetching file system data
                        const data = await getFileSystem({ path: attributeValue, request: inputValue });
                        setInputValue("")

                        selectedElement.classList.remove('update-animation');
                    }}>
                        <Textarea placeholder='Write the changes you wanna see' onChange={(e) => setInputValue(e.target.value)} value={inputValue} onKeyDown={onKeyDown} />
                    </form>
                    {
                        showCode && (
                            <DialogDescription>
                                <SyntaxHighlighter language="typescript" style={docco}
                                    lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                                    wrapLines={true}
                                    customStyle={{
                                        maxHeight: '400px',
                                        overflow: 'auto'
                                    }}
                                >
                                    {code}
                                </SyntaxHighlighter>
                            </DialogDescription>
                        )
                    }
                    <DialogFooter>
                        <div className="flex flex-1 flex-row gap-4 justify-end">
                            <Button onClick={async () => {
                                if (showCode) {
                                    setShowCode(false)
                                    return
                                }
                                const attributeValue = selectedElement?.getAttribute('data-vscode-file-name');
                                if (attributeValue) {
                                    const code = await getCode({ path: attributeValue });
                                    setCode(code)
                                    setShowCode(true)
                                }

                            }}> {!showCode ? 'Show code' : 'Hide code'} </Button>
                            <Button variant={"secondary"} onClick={() => {
                                window.location.href = `vscode://file/${selectedElement?.getAttribute('data-vscode-file-name')}`;
                            }}>
                                Open in VSCODE
                            </Button>
                        </div>

                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </div>
    );
};

export default HoverHighlightWrapper;