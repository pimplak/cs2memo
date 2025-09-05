type LoadResult = {
    image: HTMLImageElement | null;
    url: string | null;
    error?: unknown;
};

export class ImageLoader {
    private static supportsWebpPromise: Promise<boolean> | null = null;
    private cache: Map<string, Promise<LoadResult>> = new Map();

    private static async detectWebp(): Promise<boolean> {
        if (this.supportsWebpPromise) return this.supportsWebpPromise;
        this.supportsWebpPromise = new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img.width === 1);
            img.onerror = () => resolve(false);
            img.src =
                'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBgAAAAwAQCdASoEAAQAAVAfCWkAANwAP7mAAQAAAA==';
        });
        return this.supportsWebpPromise;
    }

    async load(webpUrl?: string, pngUrl?: string): Promise<LoadResult> {
        const key = `${webpUrl ?? ''}|${pngUrl ?? ''}`;
        if (this.cache.has(key)) return this.cache.get(key)!;

        const promise = (async (): Promise<LoadResult> => {
            const canWebp = await ImageLoader.detectWebp();
            const tryUrls: (string | undefined)[] = canWebp ? [webpUrl, pngUrl] : [pngUrl, webpUrl];
            for (const url of tryUrls) {
                if (!url) continue;
                try {
                    const img = await loadImage(url);
                    return { image: img, url };
                } catch (err) {
                    //  next
                }
            }
            return { image: null, url: null, error: new Error('All sources failed') };
        })();

        this.cache.set(key, promise);
        return promise;
    }

    preloadBatch(entries: { webp?: string; png?: string }[], concurrency = 4): Promise<LoadResult[]> {
        const results: LoadResult[] = [];
        let index = 0;
        const runNext = async (): Promise<void> => {
            const i = index++;
            if (i >= entries.length) return;
            try {
                const r = await this.load(entries[i].webp, entries[i].png);
                results[i] = r;
            } catch (err) {
                results[i] = { image: null, url: null, error: err };
            }
            await runNext();
        };
        const workers = new Array(Math.min(concurrency, entries.length)).fill(0).map(() => runNext());
        return Promise.all(workers).then(() => results);
    }
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = url;
    });
}

let singleton: ImageLoader | null = null;
export function getImageLoader(): ImageLoader {
    if (!singleton) singleton = new ImageLoader();
    return singleton;
}


