document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    alert('파일을 선택해주세요.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const inputData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      if (!inputData.length) {
        alert('유효한 데이터가 파일에 없습니다.');
        return;
      }

      const outputData = processData(inputData);
      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.json_to_sheet(outputData);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Results");
      XLSX.writeFile(newWorkbook, 'output.xlsx');
    } catch (error) {
      console.error(error);
      alert('파일 처리 중 오류가 발생했습니다: ' + error.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function processData(data) {
  return data.map(record => {
    const 기관명 = record.신청자소속기관 || '알 수 없음';
    const 시료수 = record.시료수 || 0;
    const 신청자명 = record.신청자명 || '알 수 없음';
    const 시간 = calculateHours(record.실제예약시작일자, record.실제예약종료일자);

    return {
      기관명: 기관명,
      시료수: 시료수,
      신청자명: 신청자명,
      시간: 시간
    };
  });
}

function calculateHours(startDate, endDate) {
  if (!startDate || !endDate || !startDate.trim() || !endDate.trim()) {
    return 0; // 빈칸이거나 공백인 경우 0으로 반환
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hours = (end - start) / 1000 / 3600; // 밀리초를 시간으로 변환
  if (isNaN(hours)) {
    throw new Error('예약 날짜 형식이 잘못되었습니다.');
  }
  return hours;
}
