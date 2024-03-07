
import { useEffect, useState } from "react";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import { pdfjs } from "react-pdf";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "./UploadPdf.css";
import {PdfComp} from "./PdfComp";
import { useNavigate } from "react-router-dom";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString(); 





const url = "https://extractpdfpages.onrender.com";
// const url = "http://localhost:8000";

export const UploadPdf = () => {
  
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : null;

  if(userId===null){ //should i use useEffect()
    navigate("/register");
  }

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState(null); //stores URLs of pdfs uploaded by user
  const [openPdf, setOpenPdf] = useState(""); //stores URL of pdf to be opened
  const [numPages, setNumPages] = useState(0);
  const [selecNums, setSelecNums] = useState([]);

  useEffect(() => {
    getPdfs();
  }, []);

  //to get all pdf files already uploaded by user
  const getPdfs = async () => {
    try {
      const { data } = await axios.post(url + "/pdfList", userId); 
      // console.log("3.in getPdfs",data.files);
      setPdfFiles(data.files);
    } catch (err) {
      console.log(err);
    }
  };
  
  //to upload pdf into firebase and then sending file data to backend
  const submitPdf = async (e) => {
    e.preventDefault();
  
    if (file === null) {
      alert("No file uploaded!");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("userId", userId.userId);
    // console.log("userID",userId)
    // console.log(file);
  
    try {
      // Generate a unique identifier for the file (e.g., using Date.now())
      const uniqueIdentifier = Date.now();
      const name = `${uniqueIdentifier}-${file.name}`;
      // console.log("frontend name",name);

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(name);
  
      const snapshot = await fileRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();

      // console.log("downloadURL",downloadURL)
  
      formData.append("name",name);
      formData.append("downloadURL", downloadURL);
  
      // Make the axios post request
      const { data } = await axios.post(url + "/uploadPdf", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      // console.log(data);
  
      if (data.status === 200) {
        alert("Uploaded Successfully!!!");
        getPdfs();
        showPdf(data.downloadURL);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  
  

  // used to show pdf
  const showPdf = (downloadURL) => { //downloadURL
    setSelecNums([]);
    // console.log("ssss",selecNums)
    setOpenPdf(downloadURL); //setOpenPdf(downloadURL)
  };

  //to extract pdf pages which selected by user
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
      const pagesToExtract = selecNums.map((pageNum) => pageNum - 1); 

      const pages = await pdfNewDoc.copyPages(pdfSrcDoc, pagesToExtract);
      pages.forEach((page) => pdfNewDoc.addPage(page));
      const newpdf = await pdfNewDoc.save();
      return newpdf; 
    } catch (error) {
      console.error("Error in extractSelectedPages function:", error);
      throw error; 
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
          style={{ "border": "2px solid black" }}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div className="pdfList">
        {pdfFiles == null
          ? ""
          : pdfFiles.map((item) => {
              return (
                // item.name
                <div key={item.name} className="pdfInfo"> 
                  <h3>{item.title}</h3>
                  <button onClick={() => showPdf(item.downloadURL)}>
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
