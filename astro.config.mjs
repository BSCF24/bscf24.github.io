import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://bscf.dev',
  output: 'static',
  build: {
    format: 'directory'
  },
  trailingSlash: 'ignore'
});
