import { NextResponse } from 'next/server';

/**
 * Validation middleware for API routes
 * @param {Object} schema - Validation schema
 * @param {string} source - Source of data ('body', 'query', 'params')
 * @returns {Function} Middleware function
 */
export function validate(schema, source = 'body') {
  return async (request, context) => {
    try {
      let data;

      if (source === 'body') {
        data = await request.json();
      } else if (source === 'query') {
        const url = new URL(request.url);
        data = Object.fromEntries(url.searchParams);
      } else if (source === 'params') {
        data = context.params || {};
      }

      // Validate data with schema
      const result = schema.safeParse ? schema.safeParse(data) : schema.parse(data);

      if (!result.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: result.error.errors || result.error,
          },
          { status: 400 }
        );
      }

      // Attach validated data to request
      request.validatedData = result.data;
      
      return null; // Continue to next handler
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
  };
}

/**
 * Create validation wrapper for route handlers
 * @param {Object} schemas - Object with validation schemas for different sources
 * @param {Function} handler - Route handler function
 * @returns {Function} Wrapped handler
 */
export function withValidation(schemas, handler) {
  return async (request, context) => {
    // Validate body if schema provided
    if (schemas.body) {
      const bodyValidation = await validate(schemas.body, 'body')(request, context);
      if (bodyValidation) return bodyValidation;
    }

    // Validate query if schema provided
    if (schemas.query) {
      const queryValidation = await validate(schemas.query, 'query')(request, context);
      if (queryValidation) return queryValidation;
    }

    // Validate params if schema provided
    if (schemas.params) {
      const paramsValidation = await validate(schemas.params, 'params')(request, context);
      if (paramsValidation) return paramsValidation;
    }

    return handler(request, context);
  };
}


