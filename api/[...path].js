import cjsModule from './_app.cjs';

const app = cjsModule.default?.default || cjsModule.default || cjsModule;

export default function handler(req, res) {
  const matched = req.headers['x-matched-path'];
  if (matched && matched !== req.url) {
    const qIndex = req.url.indexOf('?');
    const queryString = qIndex !== -1 ? req.url.slice(qIndex) : '';
    req.url = matched + queryString;
  }
  return app(req, res);
}
