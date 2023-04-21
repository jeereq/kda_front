import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: 'd4dl1jep',
  dataset: 'production',
  apiVersion: '2022-04-16',
  useCdn: true,
  token: 'skJRl62J4NNoq4DC8RFfiSsCUh0mefT1n4wthiHADWe5zSyYkftaPAT9QUH6IlIe9MgWZCd0HEfjzJxOhQGdid6Hl6g5UjRR8kSXYjz05L5IiegCutHmzLvi32FCvJDOIza10cFx8T7VarHqiClgCbHRZxBWvABoA5ZXlWF2qVApDPX34MLN',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
