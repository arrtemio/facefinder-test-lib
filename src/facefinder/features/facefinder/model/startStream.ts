import { cluster_detections, instantiate_detection_memory, run_cascade, unpack_cascade } from "./pico";
import { Camvas } from "./camvas";
import { Image, Iparams } from "./types/types";

const cascadeURL: string = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';

function rgbaToGrayscale(rgba: Uint8ClampedArray, nrows: number, ncols: number): Uint8Array {
    const gray = new Uint8Array(nrows * ncols);
    for (let r = 0; r < nrows; ++r) {
        for (let c = 0; c < ncols; ++c) {
            gray[r * ncols + c] = (2 * rgba[r * 4 * ncols + 4 * c + 0] + 7 * rgba[r * 4 * ncols + 4 * c + 1] + 1 * rgba[r * 4 * ncols + 4 * c + 2]) / 10;
        }
    }
    return gray;
}

interface StartStreamOptions {
    setNewMessage: (message: string | undefined) => void;
    setFirstShot: (imageDataURL: string) => void;
    setSecondShot: (imageDataURL: string) => void;
}

export function startStream(options: StartStreamOptions): void {
    const {setNewMessage, setFirstShot, setSecondShot} = options;

    let firstShot: null | string;
    let secondShot: null | string;

    const updateMemory = instantiate_detection_memory(5);
    let facefinderClassifyRegion:
        (r: number, c: number, s: number, pixels: Int8Array, ldim: number) => number =
            (r, c, s, pixels, ldim) => -1.0;

    const captureImage = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const imageDataURL = canvas.toDataURL('image/jpeg');

        if (!firstShot) {
            firstShot = imageDataURL;
            setFirstShot(firstShot);
        } else if (firstShot && !secondShot) {
            secondShot = imageDataURL;
            setSecondShot(secondShot);
        } else return;
    };

    fetch(cascadeURL)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const bytes = new Int8Array(buffer);
            facefinderClassifyRegion = unpack_cascade(bytes);
            console.log('* facefinder-wrapper loaded');
        })
        .catch(err => console.log(err));

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const processFrame = function (video: HTMLVideoElement, dt: number) {
        ctx.drawImage(video, 0, 0);
        const rgba = ctx.getImageData(0, 0, 640, 480).data;

        const image: Image = {
            "pixels": rgbaToGrayscale(rgba, 480, 640),
            "nrows": 480,
            "ncols": 640,
            "ldim": 640
        };

        const params: Iparams = {
            "shiftfactor": 0.1,
            "minsize": 100,
            "maxsize": 1000,
            "scalefactor": 1.1
        };

        let detections = run_cascade(image, facefinderClassifyRegion, params);

        detections = updateMemory(detections);
        detections = cluster_detections(detections, 0.2);

        for (let i = 0; i < detections.length; ++i) {
            const x = detections[i][1];
            const y = detections[i][0];
            const radius = detections[i][2];

            if (!firstShot) {
                if ((x <= 350 && x >= 280) && (y <= 200 && y >= 150)) {
                    if (radius / 2.4 >= 115) {
                        setNewMessage('too_close');
                    } else if (radius / 2.4 <= 100) {
                        setNewMessage('too_far');
                    } else {
                        captureImage();
                    }
                } else {
                    setNewMessage(undefined);
                }
            } else if (firstShot && !secondShot) {
                setNewMessage(undefined)
                if ((x < 340 && x > 295) && (y < 220 && y > 200)) {
                    if (radius / 2.4 > 60) {
                        setNewMessage('too_close');
                    } else if (radius / 2.4 < 50) {
                        setNewMessage('too_far');
                    } else {
                        setNewMessage('done');
                        captureImage();
                    }
                } else {
                    setNewMessage(undefined);
                }
            }
        }
    };

    // @ts-ignore
    const camvas = new Camvas(ctx, processFrame);
}