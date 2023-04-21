import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: 'd4dl1jep',
  dataset: 'production',
  apiVersion: '2022-04-16',
  useCdn: true,
  token: 'skFIDoE8OmlFYu3MC3xCWxEx8BVClBYAcVWcethI0GAoWVBUDAHjn2RAsyjNuHzHHN8A3bY2MwFELRCM8dAzDmMczVSioLtAZufiuEOZWnvrOi6XJuro1k8n83I4T8dUf80A9nZkWE0OWGXWotjouMOF16GPEvA8ox8G1xfeHDvvCU2g0rqL',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
