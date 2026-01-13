import 'zone.js/node';

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
	const server = express();
	const distFolder = join(process.cwd(), 'dist/apps/docs/browser');
	const indexHtml = existsSync(join(distFolder, 'index.original.html'))
		? join(distFolder, 'index.original.html')
		: join(distFolder, 'index.html');

	const commonEngine = new CommonEngine();

	server.set('view engine', 'html');
	server.set('views', distFolder);

	// Example Express Rest API endpoints
	// server.get('/api/**', (req, res) => { });
	// Serve static files from /browser
	server.get(
		'**',
		express.static(distFolder, {
			maxAge: '1y',
			index: 'index.html',
		})
	);

	// All regular routes use the Angular engine
	server.get('**', (req, res, next) => {
		const { protocol, originalUrl, baseUrl, headers } = req;

		commonEngine
			.render({
				bootstrap,
				documentFilePath: indexHtml,
				url: `${protocol}://${headers.host}${originalUrl}`,
				publicPath: distFolder,
				providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
			})
			.then((html) => res.send(html))
			.catch((err) => next(err));
	});

	return server;
}

export default bootstrap;
