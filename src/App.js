import './App.css';
import { createWorker } from 'tesseract.js';
import React, { useEffect, useState } from 'react';

function App() {
  const worker = createWorker({
    logger: m => {console.log(m);
    if(m.status=='recognizing text') setProgress(Math.floor(m.progress*100))
    },
  });
  const doOCR = async () => {
    setButtonDisabled(true)
    setOcr('Recognizing...')
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(file);
    setOcr(text);
    setButtonDisabled(false)
    setProgress(0)
  };
  const [ocr, setOcr] = useState('Recognizing...');
  const [progress,setProgress] = useState(0)
  const [buttonDisabled,setButtonDisabled] = useState(false)
  const [file,setFile] = useState('')
  const convert = async(e)=>{
    
    if(!e)
    return;
    console.log(e)
    const reader =new FileReader();
    await reader.readAsDataURL(e)
    reader.addEventListener("load", () => setFile(reader.result));
    
  }
  return (
    <div className="App">

      {buttonDisabled&&<>
        <p>{ocr}</p>
      <div className="loader"></div>
      <div className="progressBarBackground">
        <div className="progressBar" style = {{width:progress+"%"}}>
          {progress+"%"}
        </div>
      </div>
      </>}
      <input type="file" id="inputFile" onChange={(e)=>{convert(e.target.files[0])}}/>
      
      <br/>
      <button onClick={()=>{doOCR();}} className="btn" disabled={buttonDisabled||file==''}>Convert Now</button>
      <div className="previewBox">
        <div className="file">{file!=''&&<img src={file}/>}</div>
        <div className="result">{ocr!='Recognizing...'&&<p>{ocr}</p>}</div>
      </div>
    </div>
  );
}

export default App;
