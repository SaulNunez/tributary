import { XMLParser } from "fast-xml-parser";

export function processOpml(input: string) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_" // Differentiates attributes from standard tags
    });

    const parsedData = parser.parse(input);

    if(parsedData.opml && parsedData.opml.body && parsedData.opml.body.outline && parsedData.opml.body.outline.length > 0){
        const feeds = Array.isArray(parsedData.opml.body.outline) ? parsedData.opml.body.outline : [parsedData.opml.body.outline];
        return feeds.map((feedElement : any) => ({
            url: feedElement["@xmlUrl"],
            name: feedElement["@text"]
        }));
    }

    return [];
}