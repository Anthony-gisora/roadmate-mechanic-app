export const generateRecordTableHtml = (data) => {
  const tableRows = data
    .map(
      (item) =>
        `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${"usernameFrm"}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  item.requestType
                }</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  item.details
                }</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  item.status
                }</td>
            </tr>`
    )
    .join();
  console.log(tableRows);

  return `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body style="text-align: center;">
                <h1 style="font-size: 20px; font-family: sans-serif;">Mechanic Service Records</h1>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 12px; border: 1px solid #ddd;">Name</th>
              <th style="padding: 12px; border: 1px solid #ddd;">Email</th>
              <th style="padding: 12px; border: 1px solid #ddd;">Role</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
            </body>
        </html>
    `;
};
