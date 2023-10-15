export function Camvas(
    ctx: CanvasRenderingContext2D,
    callback: (video: HTMLVideoElement, deltaTime: number) => void
): void {
    const video = document.createElement('video');

    video.autoplay = true;
    video.playsInline = true;
    video.style.display = 'none';
    video.width = 1;
    video.height = 1;

    const canvasWrapper = document.getElementById('canvas_wrapper') as HTMLDivElement;
    const streamContainer = document.createElement('div');
    streamContainer.appendChild(video);
    canvasWrapper.appendChild(streamContainer);

    function startVideoProcessing() {
        const lastFrameTime = Date.now();

        function processFrame() {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastFrameTime;
            callback(video, deltaTime);
            requestAnimationFrame(processFrame);
        }

        requestAnimationFrame(processFrame);
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            startVideoProcessing();
        })
        .catch(function (err) {
            console.error('Ошибка доступа к веб-камере:', err);
        });
}