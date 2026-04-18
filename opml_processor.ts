import { XMLParser } from "fast-xml-parser";

export function processOpml(input: string) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_" // Differentiates attributes from standard tags
    });

    const parsedData = parser.parse(input);

    if (parsedData?.opml?.body?.outline) {
        // Pocket Casts has an extra layer of <outline> with type="feeds"
        const parent = parsedData.opml.body.outline["@_text"] == "feeds" ? parsedData.opml.body.outline.outline : parsedData.opml.body.outline;
        const feeds = Array.isArray(parent) ? parent : [parent];
        return feeds
            .filter((feedElement: any) => feedElement["@_xmlUrl"])
            .map((feedElement: any) => ({
                url: feedElement["@_xmlUrl"],
                name: feedElement["@_text"]
            }));
    }

    return [];
}