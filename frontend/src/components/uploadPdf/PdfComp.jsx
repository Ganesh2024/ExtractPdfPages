import { useState } from "react";
import { Document, Page } from "react-pdf";

export const PdfComp= (props)=> {
  const [numPages, setNumPages] = useState(0);
  const [selecNums, setSelecNums] = useState([]);

  //to calculate total page numbers as we need show by iterating each page
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    props.pdfPages(numPages);
  }

  //to store selected pages 
  const handleCheckboxChange = (pageNumber) => {
    if (selecNums.includes(pageNumber)) {
      setSelecNums((prevSelecNums) =>
        prevSelecNums.filter((num) => num !== pageNumber)
      );
    } else {
      setSelecNums((prevSelecNums) => [
        ...prevSelecNums,
        pageNumber,
      ]);
    }
    props.pagesExtracted(selecNums);
  };

  return ( 

    <div className="pdf-div" >
      <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <div key={page} className="pageClass">
              <label>
                <input
                  type="checkbox"
                  value={page}
                  checked={selecNums.includes(page)}
                  onChange={() => handleCheckboxChange(page)}
                />
                {page}
              </label>
              <Page
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
      </Document>
    </div>
  );
}

