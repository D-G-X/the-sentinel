// utils/helpers.js
export function getLineNumber(code, index) {
  return code.substring(0, index).split("\n").length;
}