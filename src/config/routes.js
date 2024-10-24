/**
 * ! Used by next.config.js to create redirects, so it must be a .js file
 * This file defines the route paths used throughout the application.
 */

/**
 * @typedef {import('next').Route|string} Route //TODO: Remove the or string part when next is updated
 */

/**
 * Type definition for a route object
 * @typedef {Object} RouteObject
 * @property {string} path - The route path
 * @property {Object<string, any>} [params] - Optional parameters for dynamic segments
 */

/**
 * Creates a route object with optional dynamic segments
 * @param {string} path - The route path
 * @param {Object<string, any>} [params] - Optional parameters for dynamic segments
 * @returns {RouteObject} Route object with path and optional params
 */
export const createRoute = (path, params = {}) => ({ path, params });

/**
 * @typedef {Route|RouteObject} RouteValueBase
 * @interface RoutesInterface
 * @property {Object<string, RouteValueBase>} [children]
 * @typedef {RouteValueBase} RouteValue
 * @typedef {Object<string, RouteValue>} Routes
 */
/**
 * @constant {Routes} routes - An object containing all the route paths used in the application.
 */
export const routes = {
  // Public routes
  home: "/",
  docs: "/docs",
  tasks: "/tasks",

  // Authentication routes
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    signOut: "/sign-out",
    forgotPassword: "/forgot-password",
    signInPage: "/api/auth/signin", // This is the default sign in page provided by Auth.js
    signOutPage: "/api/auth/signout", // This is the default sign out page provided by Auth.js
    signOutIn: "/sign-out-in", // Special page that signs the user out then redirects to the sign in page
    error: "/error",
  },

  app: {
    dashboard: "/app",
    apiKeys: "/api-keys",
    logs: "/logs",
    network: "/network",
    live: "/live",
    settings: "/settings",
  },

  // API routes
  api: {
    logs: "/api/logs",
    live: "/api/live-logs",
    sse: "/api/sse-logs",
    apiKeys: "/api/api-keys",
    apiKey: createRoute("/api/api-keys/:key", { key: null }),
    sendTestLog: "/api/send-test-log",
  },

  // From the public directory
  // Web Service Workers
  workers: {
    logger: "/workers/workers/logger-worker.js", // Used to log errors and other events to the server
  },

  // Demo routes
  demo: {
    network: "/demo/network",
  },

  // External links
  social: {
    github: "https://github.com/lacymorrow/ship-kit",
    x: "https://x.com/intent/follow?screen_name=lacybuilds",
    email: "mailto:l@lacy.is",
  },

  // TODO: Used to mark routes that are not yet implemented
  todo: "/",
};

export const redirects = async () => {
  return [
    ...createRedirects(["/join", "/signup"], routes.auth.signUp),
    ...createRedirects(["/login", "/log-in", "/signin"], routes.auth.signIn),
    ...createRedirects(
      ["/logout", "/log-out", "/signout"],
      routes.auth.signOut,
    ),
  ];
};

/*
 * Helper functions
 */

/**
 * Create redirects for an array of sources to the destination
 * @param {string[]} sources - An array of source paths
 * @param {string} destination - The destination path
 * @param {boolean} [permanent=false] - Whether the redirect is permanent
 * @returns {Array<{source: string, destination: string, permanent: boolean}>} An array of redirect objects
 */
export const createRedirects = (sources, destination, permanent = false) => {
  return sources.map((source) => ({
    source,
    destination,
    permanent,
  }));
};

/**
 * Generates a full path for a route, replacing any dynamic segments with provided values
 * @param {string|RouteObject} route - The route string or object from ROUTES
 * @param {Object<string, any>} [params] - Values for dynamic segments
 * @returns {Route} The full path with dynamic segments replaced
 */
export const getRoutePath = (route, params = {}) => {
  if (typeof route === "string") {
    return route;
  }

  let path = route.path;
  Object.entries(route.params ?? {}).forEach(([key, defaultValue]) => {
    const value = Object.prototype.hasOwnProperty.call(params, key)
      ? params[key]
      : defaultValue;
    if (value !== null) {
      path = path.replace(`:${key}`, value);
    }
  });
  return path;
};

/**
 * Helper function to lookup routes easily
 * @param {string} path - Dot-notation path to the desired route
 * @param {Object} [params] - Optional parameters for dynamic segments
 * @returns {Route} The resolved route path
 */
export const rx = (path, params = {}) => {
  const parts = path.split(".");
  /**
   * @type {any}
   */
  let current = routes;

  for (const part of parts) {
    if (current[part] === undefined) {
      throw new Error(`Route not found: ${path}`);
    }
    current = current[part];
  }

  if (typeof current === "object" && "index" in current) {
    return getRoutePath(current.index, params);
  }

  return getRoutePath(current, params);
};
