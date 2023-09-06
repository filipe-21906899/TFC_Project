import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function CCData() {
  const [file, setFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData);

      try {
        await axios.post('http://localhost:3001/caderno_eleitoral/cc-data', jsonData);
        setSuccessMsg('Data uploaded successfully');
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDeleteAll = async () => {
    const confirmation = window.confirm('Are you sure you want to delete all data?');

    if (confirmation) {
      try {
        await axios.delete('http://localhost:3001/caderno_eleitoral/delete-all');
        setSuccessMsg('All data deleted successfully');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownload = async () => {
    try {
      // Fetch data from the server for Jogadores, Tecnicos, and CCGuardiao
      const jogadoresResponse = await axios.get('http://localhost:3001/jogadores/cc');
      const tecnicosResponse = await axios.get('http://localhost:3001/tecnicos/cc');
      const ccGuardiaoResponse = await axios.get('http://localhost:3001/jogadores/cc/guardiao');
  
      // Extract data from the responses
      const jogadoresData = jogadoresResponse.data;
      const tecnicosData = tecnicosResponse.data;
      const ccGuardiaoData = ccGuardiaoResponse.data;

      console.log(jogadoresData)
      console.log(tecnicosData)
      console.log(ccGuardiaoData)

      const maxIndex = Math.max(jogadoresData.length, ccGuardiaoData.length, tecnicosData.length);

      console.log(jogadoresData.length)

      const mappedData = Array.from({ length: maxIndex }, (_, index) => [
        jogadoresData[index] || '',
        ccGuardiaoData[index] || '',
        tecnicosData[index] || ''
      ]);

      console.log(mappedData)
  
      // Create a new Excel workbook and sheet
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.aoa_to_sheet([
        ['CCJogador', 'CCEncarregados', 'CCTecnico'],
        ...mappedData
      ]);
  
      // Add the sheet to the workbook
      XLSX.utils.book_append_sheet(workbook, sheet, 'CC_Data');

      // Set column widths (adjust these values as needed)
    const columnWidths = [
      { wch: 16 }, // CCJogador width
      { wch: 16 }, // CCEncarregados width
      { wch: 16 }  // CCTecnico width
    ];
    sheet["!cols"] = columnWidths.map(col => ({ width: col.wch }));
  
      // Generate a binary string from the workbook
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      // Create a Blob from the buffer
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Generate a URL for the Blob
      const url = URL.createObjectURL(blob);
  
      // Create a temporary anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'CC_Data.xlsx';
      anchor.style.display = 'none'; // Hide the anchor element
  
      // Append the anchor to the DOM
      document.body.appendChild(anchor);
  
      // Simulate a click on the anchor element to initiate the download
      anchor.click();
  
      // Clean up: remove the anchor from the DOM and revoke the Blob URL
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  return (
    <div>
      <h1>CCs Upload</h1>
      <div>
        <label htmlFor="file-input">Select a file: </label>
        <input disabled type="file" id="file-input" onChange={handleFileUpload} />
      </div>
      {file && (
        <div>
          <button onClick={handleSubmit}>Submeter</button>
          <button onClick={handleDeleteAll}>Delete All</button>
        </div>
      )}
      <div>
        <h1>Download CCs para uma folha Exel</h1>
        <button onClick={handleDownload}>Download</button>
      </div>
    
      {successMsg && <p>{successMsg}</p>}
    </div>
  );
}

export default CCData;
