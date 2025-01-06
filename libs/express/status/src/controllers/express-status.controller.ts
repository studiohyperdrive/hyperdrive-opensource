import { Request, Response } from 'express';
import * as env from 'env-var';
import HttpCodes from 'http-status-codes';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';

import { ExpressStatusResponse } from '../express-status.types';

@ApiPath({
	name: 'Status',
	path: '/status',
})
export class ExpressStatusController {
	@ApiOperationGet({
		description: 'Get status',
		summary: 'Get server status',
		responses: {
			200: {
				description: 'OK',
				type: SwaggerDefinitionConstant.Response.Type.OBJECT,
				model: 'Status',
			},
		},
	})
	public get(req: Request, res: Response): Response {
		return res.status(HttpCodes.OK).json({
			project: {
				name: env.get('NAME').asString(),
				version: env.get('VERSION').asString(),
				environment: env.get('NODE_ENV').asString(),
				context: env.get('CONTEXT').asString(),
			},
			node: {
				version: process.version,
				timezone: env.get('TZ').asString(),
				time: new Date().toString(),
			},
			success: true,
		} as ExpressStatusResponse);
	}
}
