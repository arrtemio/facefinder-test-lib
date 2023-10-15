import { Image, Iparams } from "./types/types";

export function unpack_cascade(bytes: Int8Array): (r: number, c: number, s: number, pixels: Int8Array, ldim: number) => number {
    const dview = new DataView(new ArrayBuffer(4));
    let p = 8;

    function readInt32(): number {
        for (let i = 0; i < 4; i++) {
            dview.setUint8(i, bytes[p + i]);
        }
        p += 4;
        return dview.getInt32(0, true);
    }

    function readFloat32(): number {
        for (let i = 0; i < 4; i++) {
            dview.setUint8(i, bytes[p + i]);
        }
        p += 4;
        return dview.getFloat32(0, true);
    }

    const tdepth: number = readInt32();
    const ntrees: number = readInt32();
    const tcodes_ls: number[] = [];
    const tpreds_ls: number[] = [];
    const thresh_ls: number[] = [];

    for (let t = 0; t < ntrees; ++t) {
        tcodes_ls.push(0, 0, 0, 0);
        tcodes_ls.push(...Array.from(bytes.slice(p, p + 4 * Math.pow(2, tdepth) - 4)));
        p += 4 * Math.pow(2, tdepth) - 4;

        for (let i = 0; i < Math.pow(2, tdepth); ++i) {
            tpreds_ls.push(readFloat32());
        }

        thresh_ls.push(readFloat32());
    }

    const tcodes: Int8Array = new Int8Array(tcodes_ls);
    const tpreds: Float32Array = new Float32Array(tpreds_ls);
    const thresh: Float32Array = new Float32Array(thresh_ls);

    return function classify_region(r: number, c: number, s: number, pixels: Int8Array, ldim: number): number {
        r = 256 * r;
        c = 256 * c;
        let root = 0;
        let o = 0.0;
        const pow2tdepth: number = Math.pow(2, tdepth) >> 0;

        for (let i = 0; i < ntrees; ++i) {
            let idx = 1;
            for (let j = 0; j < tdepth; ++j) {
                // @ts-ignore
                idx = 2 * idx + (pixels[((r + tcodes[root + 4 * idx + 0] * s) >> 8) * ldim + ((c + tcodes[root + 4 * idx + 1] * s) >> 8)] <= pixels[((r + tcodes[root + 4 * idx + 2] * s) >> 8) * ldim + ((c + tcodes[root + 4 * idx + 3] * s) >> 8)]);
            }

            o = o + tpreds[pow2tdepth * i + idx - pow2tdepth];

            if (o <= thresh[i]) {
                return -1;
            }

            root += 4 * pow2tdepth;
        }
        return o - thresh[ntrees - 1];
    };
}

export function run_cascade(image: Image, classify_region: (r: number, c: number, s: number, pixels: Int8Array, ldim: number) => number, params: Iparams): number[][] {
    const { pixels, nrows, ncols, ldim } = image;
    const { shiftfactor, minsize, maxsize, scalefactor } = params;
    let scale = minsize;
    const detections: number[][] = [];

    while (scale <= maxsize) {
        const step: number = Math.max(shiftfactor * scale, 1) >> 0;
        const offset: number = (scale / 2 + 1) >> 0;

        for (let r = offset; r <= nrows - offset; r += step) {
            for (let c = offset; c <= ncols - offset; c += step) {
                // @ts-ignore
                const q: number = classify_region(r, c, scale, pixels, ldim);
                if (q > 0.0) {
                    detections.push([r, c, scale, q]);
                }
            }
        }

        scale = scale * scalefactor;
    }

    return detections;
}

export function cluster_detections(dets: number[][], iouthreshold: number): number[][] {
    dets = dets.sort((a, b) => b[3] - a[3]);

    function calculate_iou(det1: number[], det2: number[]): number {
        const r1 = det1[0], c1 = det1[1], s1 = det1[2];
        const r2 = det2[0], c2 = det2[1], s2 = det2[2];
        const overr: number = Math.max(0, Math.min(r1 + s1 / 2, r2 + s2 / 2) - Math.max(r1 - s1 / 2, r2 - s2 / 2));
        const overc: number = Math.max(0, Math.min(c1 + s1 / 2, c2 + s2 / 2) - Math.max(c1 - s1 / 2, c2 - s2 / 2));
        return overr * overc / (s1 * s1 + s2 * s2 - overr * overc);
    }

    const assignments: number[] = new Array(dets.length).fill(0);
    const clusters: number[][] = [];

    for (let i = 0; i < dets.length; ++i) {
        if (assignments[i] === 0) {
            let r = 0.0, c = 0.0, s = 0.0, q = 0.0, n = 0;
            for (let j = i; j < dets.length; ++j) {
                if (calculate_iou(dets[i], dets[j]) > iouthreshold) {
                    assignments[j] = 1;
                    r = r + dets[j][0];
                    c = c + dets[j][1];
                    s = s + dets[j][2];
                    q = q + dets[j][3];
                    n = n + 1;
                }
            }
            clusters.push([r / n, c / n, s / n, q]);
        }
    }

    return clusters;
}

export function instantiate_detection_memory(size: number): (dets: number[][]) => number[][] {
    let n = 0;
    const memory: number[][][] = new Array(size).fill([]);

    function update_memory(dets: number[][]): number[][] {
        memory[n] = dets;
        n = (n + 1) % memory.length;
        dets = [];
        for (let i = 0; i < memory.length; ++i) {
            dets = dets.concat(memory[i]);
        }
        return dets;
    }

    return update_memory;
}