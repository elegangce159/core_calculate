// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
    var files = e.target.files;
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        // 데이터 처리 로직
        // 예: 첫 번째 시트의 데이터를 JSON으로 변환
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var json_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
        console.log(json_data);

        // JSON 데이터를 다운로드 가능한 파일로 변환
        downloadProcessedFile(json_data);
    };
    reader.readAsArrayBuffer(f);
}

function downloadProcessedFile(data) {
    const fileName = 'processed_data.json';
    const json = JSON.stringify(data, null, 4);
    const blob = new Blob([json], {type: 'application/json'});
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function processFile() {
    let fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }
    handleFile({ target: { files: fileInput.files } });
}
