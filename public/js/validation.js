let scanner = new Instascan.Scanner({
    video: document.getElementById('preview'),
    mirror: false
});

scanner.addListener('scan', (content) => {
    alert('Escaneou o conteudo' + content);
});

Instascan.Camera.getCameras().then(cameras => {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        alert("Não existe camera no dispositivo");
    }
});