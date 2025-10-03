import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

// Create and share a PDF from HTML content
export const CreateAndSharePdf = async (htmlContent) => {
  try {
    // Generate PDF from the HTML string
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
    });

    Alert.alert("Download Success", `Downloaded to: ${uri}`);
    console.log("PDF generated at:", uri);

    // Share the PDF file
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error(" Error creating/sharing PDF:", error);
  }
};
