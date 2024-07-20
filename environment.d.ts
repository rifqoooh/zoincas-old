declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string;
      DATABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SERVICE_ROLE_KEY: string;
      PW: string;
      NEXT_PUBLIC_SITE_URL: string;
    }
  }
}

export {};
