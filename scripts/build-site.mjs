import fs from 'node:fs/promises';
import path from 'node:path';

const assets = {
  'couture-exterior.jpg': [
    'https://thecouturemke.com/wp-content/uploads/elementor/thumbs/HOME-BODY-01-rpfnr1fm9zixi5qzbu5g0elntteoggstsqlwh2nbi8.jpg'
  ],
  'couture-interior.jpg': [
    'https://thecouturemke.com/wp-content/uploads/elementor/thumbs/Couture-Milwaukee-Apartments-DSC_8231-copy-1-scaled-rpfko4h7trovimuyzw69se7kd03g68h2jrb9tn3pq8.jpg'
  ],
  '777-exterior.webp': [
    'https://image.thum.io/get/width/1400/noanimate/https://www.live7seventy7.com/'
  ],
  '777-interior.webp': [
    'https://i.rent.com/t_3x2_fixed_webp_w1440/ad8003ecea157860779595639d9dd9ba',
    'https://i.rent.com/t_3x2_fixed_webp_w720/d324e6654c0286366f8a4fbdde19b638'
  ],
  'ovation-exterior.jpg': [
    'https://image.thum.io/get/width/1400/noanimate/https://www.apartments.com/ovation-309-madison-wi/1p8z475/'
  ],
  'ovation-interior.jpg': [
    'https://image.thum.io/get/width/1400/noanimate/https://ovation309.com/gallery/'
  ],
  'heyday-exterior.jpg': [
    'https://heydaysp.com/wp-content/uploads/2024/07/HH-43F.jpg',
    'https://chambermaster.blob.core.windows.net/images/customers/2844/members/2534/photos/GALLERY_MAIN/Heyday_Sun_Prairie_Rendering_3.jpg'
  ],
  'heyday-interior.jpg': [
    'https://chambermaster.blob.core.windows.net/images/customers/2844/members/2534/photos/GALLERY_MAIN/Heyday_Sun_Prairie_24.jpg',
    'https://chambermaster.blob.core.windows.net/images/customers/2844/members/2534/photos/GALLERY_MAIN/Heyday_Sun_Prairie_25.jpg'
  ],
  'oakview-exterior.jpg': ['https://residencesatoakview.com/assets/images/cache/MCvzbQKZnCAdVP9Ijz49GbJTDKXHxPdPiwgPjJMv-7b693377a2ccb843767cc49985837749.jpg'],
  'oakview-interior.jpg': ['https://residencesatoakview.com/assets/images/cache/home_parallax2-e4ee9a1a53160b6203855d5f9b28e1b1.jpg'],
  'carillon-exterior.webp': ['https://www.liveatthecarillon.com/grafton/assets-lite/hero-lite.webp'],
  'carillon-interior.webp': ['https://www.liveatthecarillon.com/grafton/assets-lite/g1-lite.webp']
};

await fs.rm('_site', { recursive: true, force: true });
await fs.mkdir('_site/images', { recursive: true });
await fs.mkdir('_site/sections', { recursive: true });
await fs.copyFile('index.html', '_site/index.html');
await fs.copyFile('sections/benchmarks.html', '_site/sections/benchmarks.html');
await fs.copyFile('sections/alternatives.html', '_site/sections/alternatives.html');
await fs.writeFile('_site/.nojekyll', '');

const headers = {
  'user-agent': 'Mozilla/5.0 (compatible; WisconsinApartmentShortlist/1.0)',
  'accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
};

async function download(name, urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers, redirect: 'follow' });
      if (!response.ok) continue;
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 3000) continue;
      await fs.writeFile(path.join('_site/images', name), bytes);
      console.log(`Downloaded ${name}: ${bytes.length} bytes`);
      return;
    } catch (error) {
      console.log(`Failed ${url}: ${error.message}`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540"><rect width="100%" height="100%" fill="#ecebe4"/><text x="50%" y="48%" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" fill="#68706c">Photo temporarily unavailable</text><text x="50%" y="57%" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#68706c">Use the official gallery link below</text></svg>`;
  await fs.writeFile(path.join('_site/images', name), svg);
  console.warn(`Using placeholder for ${name}`);
}

for (const [name, urls] of Object.entries(assets)) await download(name, urls);
