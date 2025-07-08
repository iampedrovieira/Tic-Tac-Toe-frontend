declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_SOCKET_SERVER: string;
      }
    }
  }
export {}