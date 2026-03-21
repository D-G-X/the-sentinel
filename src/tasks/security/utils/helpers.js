// utils/helpers.js
export function getLineNumber(code, index) {
  return code.substring(0, index).split("\n").length;
}

export function removeUntilFirstMarker(str, marker) {
  const index = str.indexOf(marker);

  if (index === -1) {
    return str; // marker not found, return original string
  }

  return str.slice(index + marker.length);
}
