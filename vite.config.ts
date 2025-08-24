import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	preview: {
        allowedHosts: ["adnote.onrender.com", "localhost", "127.0.0.1"]
    }
});