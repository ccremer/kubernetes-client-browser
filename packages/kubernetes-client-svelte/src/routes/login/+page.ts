import type { PageLoad, PageLoadEvent } from "./$types.d.ts"
import { z } from "zod"

export const load = ((e: PageLoadEvent) => {
  return {
    fetch: e.fetch,
  }
}) satisfies PageLoad
