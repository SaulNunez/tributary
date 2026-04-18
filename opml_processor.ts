import { XMLParser } from "fast-xml-parser";

export function processOpml(input: string) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_" // Differentiates attributes from standard tags
    });

    const parsedData = parser.parse(input);

    if (parsedData?.opml?.body?.outline) {
        const feeds = Array.isArray(parsedData.opml.body.outline) ? parsedData.opml.body.outline : [parsedData.opml.body.outline];
        return feeds
            .filter((feedElement: any) => feedElement["@_xmlUrl"])
            .map((feedElement: any) => ({
                url: feedElement["@_xmlUrl"],
                name: feedElement["@_text"]
            }));
    }

    return [];
}