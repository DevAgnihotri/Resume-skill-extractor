// ...existing code...
import pdfParse from 'pdf-parse';

/**
 * Parse PDF buffer and extract text content
 * @param buffer PDF file buffer
 * @returns Extracted text from PDF
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // Set custom options to avoid the test file issue
    const options = {
      // This prevents pdf-parse from using internal test files
      pagerender: function(pageData: any) {
        return Promise.resolve(pageData.getTextContent())
          .then(function(textContent: any) {
            let text = '';
            for (let item of textContent.items) {
              text += item.str + ' ';
            }
            return text;
          });
      }
    };
    
    const data = await pdfParse(buffer, options);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure it is a valid PDF file.');
  }
}
