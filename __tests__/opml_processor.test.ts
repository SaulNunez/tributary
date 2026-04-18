import { processOpml } from '../opml_processor';

describe('processOpml', () => {
    it('should parse valid OPML with multiple feeds correctly', () => {
        const opmlString = `
            <?xml version="1.0" encoding="UTF-8"?>
            <opml version="2.0">
                <head>
                    <title>Subscriptions</title>
                </head>
                <body>
                    <outline text="TechCrunch" xmlUrl="https://techcrunch.com/feed/" />
                    <outline text="The Verge" xmlUrl="https://www.theverge.com/rss/index.xml" />
                </body>
            </opml>
        `;

        const result = processOpml(opmlString);

        expect(result).toEqual([
            { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
            { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' }
        ]);
    });

    it('should parse valid OPML with a single feed correctly', () => {
        const opmlString = `
            <?xml version="1.0" encoding="UTF-8"?>
            <opml version="2.0">
                <head>
                    <title>Subscriptions</title>
                </head>
                <body>
                    <outline text="TechCrunch" xmlUrl="https://techcrunch.com/feed/" />
                </body>
            </opml>
        `;

        const result = processOpml(opmlString);

        expect(result).toEqual([
            { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' }
        ]);
    });

    it('should return an empty array for empty OPML', () => {
        const opmlString = `
            <?xml version="1.0" encoding="UTF-8"?>
            <opml version="2.0">
                <head>
                    <title>Subscriptions</title>
                </head>
                <body>
                </body>
            </opml>
        `;

        const result = processOpml(opmlString);

        expect(result).toEqual([]);
    });

    it('should return an empty array for invalid OPML string', () => {
        const invalidOpml = `<invalid><opml>nothing here</opml></invalid>`;
        const result = processOpml(invalidOpml);
        expect(result).toEqual([]);
    });

    it('should handle Pocket Casts OPML format', () => {
        const pocketCastsOpml = `
            <?xml version="1.0" encoding="UTF-8"?>
            <opml version="2.0">
                <head>
                    <title>Pocket Casts Subscriptions</title>
                </head>
                <body>
                    <outline text="feeds">
                        <outline type="rss" text="TechCrunch" xmlUrl="https://techcrunch.com/feed/" />
                    </outline>
                </body>
            </opml>
        `;

        const result = processOpml(pocketCastsOpml);

        expect(result).toEqual([
            { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' }
        ]);
    });
});
