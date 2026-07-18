/// <reference types="vite/client" />
import React from "react";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_COGNITO_DOMAIN: string;
  readonly VITE_COGNITO_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.jsx" {
  const JSX: React.FC;
  export default JSX;
}
declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}
