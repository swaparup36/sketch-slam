export function hexToRgba(hex: string, alpha: number = 255): [number, number, number, number] {
    console.log("hex-color: ", hex);
    hex = hex.replace(/^#/, '');

    let r: number, g: number, b: number;

    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        throw new Error("Invalid HEX color.");
    }

    return [r, g, b, alpha];
}

export const getColorAtPixel = (imageData: ImageData, x: number, y: number) => {
    const offset = (y * imageData.width + x) * 4;
    return [
        imageData.data[offset],
        imageData.data[offset + 1],
        imageData.data[offset + 2],
        imageData.data[offset + 3],
    ];
};

export const setColorAtPixel = (imageData: ImageData, x: number, y: number, color: number[]) => {
        const offset = (y * imageData.width + x) * 4;
        imageData.data[offset] = color[0];
        imageData.data[offset + 1] = color[1];
        imageData.data[offset + 2] = color[2];
        imageData.data[offset + 3] = color[3];
};

export const colorsMatch = (color1: number[], color2: number[]) => {
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2] &&
        color1[3] === color2[3]
    );
};