// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
    var files = e.target.files;
    if (files.length === 0) {
        console.log("No file selected.");
        return;
    }

    var f = files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        try {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var jsonData = XLSX.utils.sheet_to_json(worksheet, {header:1});

            console.log("Sheet data:", jsonData);
            var processedData = processData(jsonData);
            downloadProcessedData(processedData);
        } catch (error) {
            console.error("Error processing file:", error);
        }
    };

    reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };

    reader.readAsArrayBuffer(f);
}

function processData(data) {
    return data.map(row => {
        return {
            기관명: row[0], // 신청자소속기관
            시료수: row[1], // 시료수
            신청자명: row[2], // 신청자명
            시간_hr: calculateHours(row[3], row[4]) // 실제예약시작일자와 실제예약종료일자 사이의 시간 계산
        };
    });
}

function calculateHours(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Invalid date format:", start, end);
        return 0;
    }
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
