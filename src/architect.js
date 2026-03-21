import architectService from '../services/architectService.js';

// Wrapper function for backward compatibility
async function analyzeArchitecture(files, architectRules) {
  return await architectService.analyzeArchitecture(files, architectRules);
}

export default analyzeArchitecture;