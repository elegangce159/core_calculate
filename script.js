document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});

    // 인풋 파일 처리 로직
    const inputData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    // 아웃풋 데이터 생성
    const outputData = processData(inputData);
    
    // 아웃풋 파일로 저장
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(outputData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Results");
    XLSX.writeFile(newWorkbook, 'output.xlsx');
  };
  reader.readAsArrayBuffer(file);
}

function processData(data) {
  return data.map(record => ({
    기관명: record.신청자소속기관,
    시료수: record.시료수,
    신청자명: record.신청자명,
    시간: calculateHours(record.실제예약시작일자, record.실제예약종료일자)
  }));
}

function calculateHours(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end - start) / 1000 / 3600; // 밀리초를 시간으로 변환
}
