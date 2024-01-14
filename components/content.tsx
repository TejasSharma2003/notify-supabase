import React from "react";
import parse from "html-react-parser";
export default function Content({ content }: { content: string }) {
    const jsonBlocks = JSON.parse(content);
    return (
        <>
            <h1>JSON to html below</h1>
            <div className="prose">
                {convertToHtml(jsonBlocks)}
            </div>
        </>
    );
}

function convertToHtml({ blocks }) {
    let convertedHtml = "";
    blocks.map((block) => {
        switch (block.type) {
            case "header":
                convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case "embded":
                convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                break;
            case "paragraph":
                convertedHtml += `<p>${block.data.text}</p>`;
                break;
            case "delimiter":
                convertedHtml += "<hr />";
                break;
            case "image":
                convertedHtml += `<img class="img-fluid" src="${block.data.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                break;
            case "list":
                convertedHtml += "<ul>";
                block.data.items.forEach(function(li) {
                    convertedHtml += `<li>${li}</li>`;
                });
                convertedHtml += "</ul>";
                break;
            default:
                console.log(block.data);
                console.log("Unknown block type", block.type);
                break;
        }
    });

    return <React.Fragment>{parse(convertedHtml)}</React.Fragment>;
}
