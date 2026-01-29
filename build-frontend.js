import { build } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildFrontend() {
  try {
    console.log("Building frontend with Vite...");

    // Ensure dist directory exists
    const distDir = path.resolve(__dirname, "dist");
    const publicDir = path.resolve(distDir, "public");

    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    await build({
      root: path.resolve(__dirname, "client"),
      build: {
        outDir: publicDir,
        emptyOutDir: true,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ["react", "react-dom"],
            },
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client/src"),
          "@shared": path.resolve(__dirname, "shared"),
          "@assets": path.resolve(__dirname, "attached_assets"),
        },
      },
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

    console.log("Frontend build completed successfully!");
    console.log("Output directory:", publicDir);

    // List built files
    const builtFiles = fs.readdirSync(publicDir);
    console.log("Built files:", builtFiles);
  } catch (error) {
    console.error("Frontend build failed:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

buildFrontend();
