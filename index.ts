import axios from "axios";
import Sitemapper from "sitemapper";

const sitemapUrl = process.argv[2];

interface BrokenUrl {
  url: string;
  status: number;
}

async function getBrokenLinks(sitemapUrl: string) {
  const sitemap = new Sitemapper({ url: sitemapUrl });

  const { sites: siteUrls } = await sitemap.fetch();

  const brokenUrls = [] as BrokenUrl[];

  for await (const url of siteUrls) {
    try {
      console.log("parsing", url);
      const res = await axios.get(url, { timeout: 2000 });
      if (res.status !== 200) {
        brokenUrls.push({
          status: res.status,
          url,
        });
      }
    } catch (err) {
      brokenUrls.push({ status: 0, url });
    }
  }
  console.log(JSON.stringify(brokenUrls, null, 2));
}

getBrokenLinks(sitemapUrl);
