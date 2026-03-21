import axios from "axios";

export async function checkVulnerabilityOSV(lib, version) {
  try {
    const res = await axios.post("https://api.osv.dev/v1/query", {
      package: {
        name: lib,
        ecosystem: "npm"
      },
      version: version
    });
console.log("🔍 Checking:", lib, version);
    return res.data.vulns || [];
  } catch (error) {
    console.error("❌ OSV API Error:", error.message);
    return [];
  }
}