const fs = require("fs");

////////////////////////////// utils /////////////////////////////

export const findFilePathByNamePattern = (
  filePattern: string,
  fileExtension: string
) => {
  const dirPath = `${process.cwd()}/node_modules/@medusajs/dashboard/dist`;

  // Read the list of files in the directory
  const files = fs.readdirSync(dirPath);

  // Find the first file that matches the pattern
  const fileName = files.find(
    (file: string) =>
      file.startsWith(filePattern) && file.endsWith(fileExtension)
  );

  if (!fileName) {
    throw new Error(`No file found matching pattern: ${filePattern}`);
  }

  const filePath = `${dirPath}/${fileName}`;

  return filePath;
};

export function findChunkFileByContainingText(text: string) {
  try {
    const dirPath = `${process.cwd()}/node_modules/@medusajs/dashboard/dist`;

    // Read the list of files in the directory
    const files = fs.readdirSync(dirPath);

    // Filter out files that match the pattern chunk-*.mjs
    const targetFiles = files.filter(
      (file: string) => file.startsWith("chunk-") && file.endsWith(".mjs")
    );

    // Loop over the matching files and check their content
    for (const fileName of targetFiles) {
      const filePath = `${dirPath}/${fileName}`;
      const content = fs.readFileSync(filePath, "utf8");

      // If the file contains the target string, print its name
      if (content.includes(text)) {
        console.log(`Found '${text}' in file: ${filePath}`);
        return filePath;
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export const readFileAsLines = (filePath: string) => {
  // Read the file content
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Split the file into lines
  const lines = fileContent.split("\n");

  return lines;
};

export const removeOccurrence = (
  lines: string[],
  value: string,
  skipFirst = true
) => {
  const updatedLines = lines.reduce(
    (acc, line) => {
      if (line.includes(value)) {
        if (acc.foundFirst) {
          acc.result.push(""); // Change only after the first occurrence
        } else {
          acc.foundFirst = true; // Skip the first occurrence
          acc.result.push(line); // Keep the first occurrence as it is
        }
      } else {
        acc.result.push(line); // Keep other lines unchanged
      }
      return acc;
    },
    { result: [], foundFirst: !skipFirst }
  ).result;

  return updatedLines;
};

export const writeFile = (lines: string[], filePath: string) => {
  // Write the modified content back to the file
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  console.log(`Updated ${filePath} successfully.`);
};

////////////////////////////// usage /////////////////////////////

const APP_MJS_PATH = `${process.cwd()}/node_modules/@medusajs/dashboard/dist/app.mjs`;
const VITE_CACHE_PATH = `${process.cwd()}/node_modules/@medusajs/admin-bundler/node_modules/.vite`;
const LOGIN_PATH = findFilePathByNamePattern("login-", ".mjs");
const REST_PASSWORD_PATH = findFilePathByNamePattern("reset-password-", ".mjs");

// 1) Welcome to Medusa -> Welcome to Marketplace
let lines: string[];
const CHUNK_1 = findChunkFileByContainingText("Welcome to Medusa");
if (CHUNK_1) {
  lines = readFileAsLines(CHUNK_1);
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/Welcome to Medusa/g, "Welcome to Marketplace");
  }
  writeFile(lines, CHUNK_1);
}

// 2) hide avatar logo on login page
lines = readFileAsLines(LOGIN_PATH);
lines = removeOccurrence(lines, "AvatarBox");
writeFile(lines, LOGIN_PATH);

// 3) hide avatar logo on reset password page
lines = readFileAsLines(REST_PASSWORD_PATH);
lines = removeOccurrence(lines, "LogoBox");
writeFile(lines, REST_PASSWORD_PATH);

// // 4) hide documentation and changelog links from menu
lines = readFileAsLines(APP_MJS_PATH);
lines.forEach((line: string, index: number) => {
  if (line.includes("app.menus.user.documentation")) {
    lines[index - 3] = "";
    lines[index - 2] = "";
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
  }

  if (line.includes("app.menus.user.changelog")) {
    lines[index - 2] = "";
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
  }
  // hide sales channels from settings
  if (line.includes('label: t2("salesChannels.domain"),')) {
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
    lines[index + 2] = "";
  }
  // hide workflows from settings
  if (line.includes('label: t2("workflowExecutions.domain"),')) {
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
    lines[index + 2] = "";
  }
  // hide return reasons from settings
  if (line.includes('label: t2("returnReasons.domain"),')) {
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
    lines[index + 2] = "";
  }
  // hide product types from settings
  if (line.includes('label: t2("productTypes.domain"),')) {
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
    lines[index + 2] = "";
  }
  // hide product tags from settings
  if (line.includes('label: t2("productTags.domain"),')) {
    lines[index - 1] = "";
    lines[index] = "";
    lines[index + 1] = "";
    lines[index + 2] = "";
  }
  // hide inventory from sidebar
  if (line.includes('label: t2("inventory.domain"),')) {
    for (let i = -2; i <= 8; i++) {
      lines[index + i] = "";
    }
  }
  // hide promotions from sidebar
  if (line.includes('label: t2("promotions.domain"),')) {
    for (let i = -2; i <= 8; i++) {
      lines[index + i] = "";
    }
  }
});
writeFile(lines, APP_MJS_PATH);

// // 5) add Impersonate block
lines = readFileAsLines(APP_MJS_PATH);
lines.forEach((line: string, index: number) => {
  if (line.includes("var MainLayout")) {
    const newCode = `var MainLayout=()=>{const impersonateKey="IMPERSIONATED_AS";const removeImpersonate=async()=>{localStorage.removeItem(impersonateKey);await fetch("/admin/impersonate",{method: "DELETE"});window.location.href="/app"};const impersionatedAs=localStorage.getItem(impersonateKey);const children=[];if(impersionatedAs){children.push(jsx14("div",{className:"flex justify-between bg-ui-tag-purple-icon px-2 py-1 h-8 text-ui-fg-on-inverted",children:[jsx14("p",{children:\`Impersonated as \${impersionatedAs}\`}),jsx14("button",{onClick:removeImpersonate,className:"border border-ui-tag-neutral-border px-2",children:"Remove Impersonation"})]}));}children.push(jsx14(Shell,{children:jsx14(MainSidebar,{})}));return jsx14("div",{children});};`;
    lines[index] = newCode;
    lines[index + 1] = "";
    lines[index + 2] = "";
  }
});
writeFile(lines, APP_MJS_PATH);

// Reset Vite cache
if (fs.existsSync(VITE_CACHE_PATH)) {
  fs.rmSync(VITE_CACHE_PATH, { recursive: true, force: true });
  console.log("Vite cache cleared successfully.");
} else {
  console.log("Vite cache directory not found.");
}
