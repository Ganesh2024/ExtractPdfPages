
import { useEffect, useState } from "react";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import { pdfjs } from "react-pdf";
// import {ExtractPdf} from "./ExtractPdf"
import "./UploadPdf.css";
import {PdfComp} from "./PdfComp";
import { useNavigate } from "react-router-dom";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();





const url = "https://extractpdfpages.onrender.com";

export const UploadPdf = () => {
  
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : null;

  if(userId===null){
    navigate("/register");
  }

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState(null);
  const [openPdf, setOpenPdf] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [selecNums, setSelecNums] = useState([]);

  useEffect(() => {
    getPdfs();
  }, []);

  const getPdfs = async () => {
    const { data } = await axios.post(url + "/pdfList", userId);
    // console.log("3.in getPdfs",data.files);
    setPdfFiles(data.files);
  };

  const submitPdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("userId", userId.userId);
    // console.log("1",title, file);

    const { data } = await axios.post(url + "/uploadPdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("2. after file uploading",data);
    
    if (data.status === 200) {
      alert("Uploaded Successfully!!!");
      getPdfs();
      showPdf(data.filename)
    }
  };

  const showPdf = (pdf) => {
    setSelecNums([]);
    console.log("ssss",selecNums)
    setOpenPdf(url+`/files/${pdf}`);
  };

  const handleExtract = async () => {
    try {
      const newPdf = await extractSelectedPages();
      const extractedPdfBlob = new Blob([newPdf], { type: "application/pdf" });
      const extractedPdfUrl = URL.createObjectURL(extractedPdfBlob);
      window.open(extractedPdfUrl, "_blank");
    } catch (error) {
      console.error("Error extracting PDF pages:", error);
    }
  };
  
  async function extractSelectedPages() {
    try {
      const pdfArrayBuffer = await axios.get(`${openPdf}`, {
        responseType: "arraybuffer",
      });
      const pdfSrcDoc = await PDFDocument.load(pdfArrayBuffer.data);
      const pdfNewDoc = await PDFDocument.create();
      const pagesToExtract = selecNums.map((pageNum) => pageNum - 1); // Adjust for 0-based indexing
      
      // const lastPage = pdfSrcDoc.getPageCount() - 1;
      // if (!pagesToExtract.includes(lastPage)) {
      //   pagesToExtract.push(lastPage);
      // }

      const pages = await pdfNewDoc.copyPages(pdfSrcDoc, pagesToExtract);
      pages.forEach((page) => pdfNewDoc.addPage(page));
      const newpdf = await pdfNewDoc.save();
      return newpdf; // Return the new PDF data
    } catch (error) {
      console.error("Error in extractSelectedPages function:", error);
      throw error; // Rethrow the error to be caught in handleExtract
    }
  }

  


  return (
    <div className="App">
      <form className="formStyle" onSubmit={submitPdf}>
        <h4>Upload Pdf</h4>
        <br />
        <input
          type="text"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
          style={{ border: "2px solid" }}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div className="pdfList">
        {pdfFiles == null
          ? ""
          : pdfFiles.map((item) => {
              return (
                <div key={item.filename} className="pdfInfo">
                  <h3>{item.title}</h3>
                  <button onClick={() => showPdf(item.filename)}>
                    Show Pdf
                  </button>
                </div>
              );
            })}
      </div>
      {selecNums.length != 0 ? <button onClick={handleExtract}style={{
        "margin":"1rem",
      }}>Extract</button>:""}
      <PdfComp pdfFile={openPdf} pdfPages={setNumPages} pagesExtracted = {setSelecNums}/>
    </div>
  );
};
