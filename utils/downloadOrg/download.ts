import { CreateAndSharePdf } from "./downloadHandler";
import { generateRecordTableHtml } from "./generateDownloadFile";

export const handleDownload = (records) => {
  const newPDF = generateRecordTableHtml(records);
  CreateAndSharePdf(newPDF);
};
