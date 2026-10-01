const configuredBase = process.env.REACT_APP_BASE_PATH || "";

export const basePath = configuredBase === "/" ? "" : configuredBase.replace(/\/$/, "");

export const toPublicPath = (path: string) => {
  if (!path.startsWith("/")) return path;
  if (!basePath) return path;
  if (path === "/") return basePath + "/";
  return basePath + path;
};

export const fromPublicPath = (pathname: string) => {
  if (basePath && pathname.startsWith(basePath)) {
    const stripped = pathname.slice(basePath.length);
    return stripped || "/";
  }
  return pathname || "/";
};
