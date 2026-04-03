import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

function createMissingConfigError() {
  return new Error(
    "Supabase is not configured for this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the hosting environment."
  );
}

function createSupabaseFallback() {
  const error = createMissingConfigError();

  const chain = {
    select() {
      return this;
    },
    order() {
      return this;
    },
    update() {
      return this;
    },
    eq() {
      return this;
    },
    single() {
      return Promise.resolve({ data: null, error });
    },
    insert() {
      return Promise.resolve({ data: null, error });
    },
    then(resolve, reject) {
      return Promise.resolve({ data: null, error }).then(resolve, reject);
    },
  };

  return {
    auth: {
      getSession: async () => ({
        data: { session: null },
        error,
      }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      }),
      signInWithPassword: async () => ({
        data: { session: null },
        error,
      }),
      signUp: async () => ({
        data: { session: null, user: null },
        error,
      }),
      signOut: async () => ({ error: null }),
    },
    from() {
      return chain;
    },
  };
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createSupabaseFallback();
