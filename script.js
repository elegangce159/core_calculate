// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
    var files = e.target.files;
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        // 여기서 워크북 데이터를 처리하고 결과를 생성할 수 있습니다.
        console.log(workbook);  // 콘솔에서 워크북 구조 확인
    };
    reader.readAsArrayBuffer(f);
}

function processFile() {
    let fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }
    handleFile({ target: { files: fileInput.files } });
}
