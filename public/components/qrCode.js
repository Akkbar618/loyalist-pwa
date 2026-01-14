/**
 * QR Code Component
 * Generates and displays user's QR code
 */

/**
 * Generates a QR code image for the given data
 * @param {string} data - Data to encode in QR code
 * @param {number} cellSize - Size of each cell in pixels (default: 6)
 * @returns {string} HTML img tag
 */
export function generateQRCode(data, cellSize = 6) {
    // Uses global qrcode library loaded from CDN
    const qr = qrcode(0, 'M');
    qr.addData(data);
    qr.make();
    return qr.createImgTag(cellSize);
}

/**
 * Renders QR code into a container element
 * @param {HTMLElement} container - Container to render QR code into
 * @param {string} data - Data to encode
 * @param {number} cellSize - Size of each cell in pixels (default: 6)
 */
export function renderQRCode(container, data, cellSize = 6) {
    container.innerHTML = generateQRCode(data, cellSize);
}
