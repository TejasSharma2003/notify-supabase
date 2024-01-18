import React from "react";
import edjsHTML from 'editorjs-html'
import { OutputData } from "@editorjs/editorjs";
import parse from "html-react-parser"

const edjsParser = edjsHTML();

// TODO define own parser for table
export default function Content({ content }: { content: string }) {
    if(!content) <h1>This post is empty.</h1>
    const editorjsHtml: OutputData = JSON.parse(content);
    let html = edjsParser.parse(editorjsHtml);
    return <div className="lg:prose-md prose" >{parse(html.join(""))}</div>
}

