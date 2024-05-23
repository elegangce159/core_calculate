function handleFile(e) {
    var files = e.target.files;
    if (files.length === 0) {
        console.log("No file selected.");
        return;
    }
    var f = files[0];
    console.log("File selected:", f.name, f.size);
    var reader = new FileReader();

    reader.onload = function(e) {
        try {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            console.log("Workbook loaded:", workbook);
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

    reader.readAsArrayBuffer(f);
}

function calculateHours(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    console.log("Parsed dates:", startDate, endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Invalid date format:", start, end);
        return 0;
    }
    return (endDate - startDate) / 3600000; // Convert milliseconds to hours
}
