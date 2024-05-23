// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
    var files = e.target.files;
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var data = XLSX.utils.sheet_to_json(worksheet, {header:1});

        // 데이터 처리 로직
        var processedData = processData(data);

        // 데이터 다운로드
        downloadProcessedData(processedData);
    };
    reader.readAsArrayBuffer(f);
}

function processData(data) {
    return data.map(row => {
        return {
            기관명: row[0], // 신청자소속기관
            시료수: row[1], // 시료수
            신청자명: row[2], // 신청자명
            시간_hr: calculateHours(row[3], row[4]) // 시간 계산
        };
    });
}

function calculateHours(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate - startDate) / 3600000; // 밀리세컨드로 나누어 시간 단위로 반환
}

function downloadProcessedData(data) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Processed Data");
    XLSX.writeFile(wb, "processed_data.xlsx");
}

function processFile() {
    let fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }
    handleFile({ target: { files: fileInput.files } });
}
