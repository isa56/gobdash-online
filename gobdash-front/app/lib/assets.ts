export function publicAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}
