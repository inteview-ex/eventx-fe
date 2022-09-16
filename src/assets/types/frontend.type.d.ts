export {};

declare global {
  interface Window {
    _env_: any; // 👈️ turn off type checking
  }
}