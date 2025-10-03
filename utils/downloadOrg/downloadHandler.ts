// import * as Print from "expo-print";
// import * as Share from "expo-sharing";
// import { Platform } from "react-native";

// export const CreateAndSharePdf = async (html) => {
//   try {
//     const { url } = await Print.printToFileAsync({ html });
//     if (Platform.OS === "ios") {
//       await Share.shareAsync(url, { UTI: ".pdf", mimeType: "application/pdf" });
//     } else if (Platform.OS === "android") {
//       await Share.shareAsync(url, { UTI: ".pdf", mimeType: "application/pdf" });
//     } else {
//       await Share.shareAsync(url, { UTI: ".pdf", mimeType: "application/pdf" });
//     }
//   } catch (error) {
//     console.log("the PDF failed to be created: ", error);
//   }
};
