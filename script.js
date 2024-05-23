// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
    var files = e.target.files;
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        // ���⼭ ��ũ�� �����͸� ó���ϰ� ����� ������ �� �ֽ��ϴ�.
        console.log(workbook);  // �ֿܼ��� ��ũ�� ���� Ȯ��
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
