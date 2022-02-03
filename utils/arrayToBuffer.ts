const _arrayBufferToBase64 = (buffer: ArrayBuffer): { base64: string; size: number } => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i++)
        binary += String.fromCharCode(bytes[i]);

    const base64: string = window.btoa(binary);
    const size: number = Buffer.byteLength(base64, 'utf8') * 0.00000095367432;

    return {
        base64,
        size
    };
}

export default _arrayBufferToBase64;