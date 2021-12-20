import info from './info';
import servers from './servers';
import components from './components';
import tags from './tags';
import paths from './paths';

export default {
  openapi: '3.0.3',
  info,
  servers,
  components,
  tags,
  paths,
  // security: [{ bearerAuth: [] }], this applies
};
